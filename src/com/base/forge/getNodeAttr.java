package com.base.forge;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class getNodeAttr
 */
@WebServlet("/getNodeAttr")
public class getNodeAttr extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getNodeAttr() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		response.setHeader("content-type", "text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		String id = request.getParameter("id");
		out.print(getNodeAttr(id));
		out.flush();
		out.close();
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

	public JSONObject getNodeAttr(String id){
		JSONObject retObj = new JSONObject();
		Connection c = null;
		String db = "C:\\Users\\Administrator\\Desktop\\นคื๗\\BIM\\apache-tomcat-bim\\webapps\\ROOT\\output\\model.sdb";
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + db);
			c.setAutoCommit(false);
			System.out.println("Opened database successfully");
			Statement stmt = null;
	        stmt = c.createStatement();
	        String sql = "select _objects_attr.category,"
	        		+ " _objects_attr.name,"
	        		+ " _objects_attr.data_type,"
	        		+ " _objects_val.id,"
	        		+ " _objects_val.value"
	        		+ " from _objects_eav, _objects_attr, _objects_val"
	        		+ " where _objects_eav.entity_id = '" + id + "' and"
	        		+ " _objects_eav.attribute_id = _objects_attr.id and"
	        		+ " _objects_eav.value_id = _objects_val.id"
	        		+ " and _objects_attr.flags != 1"
	        		+ " and _objects_attr.name !='name' "
	        		+ " group by _objects_attr.category,_objects_attr.name "
	        		+ " order by _objects_attr.category,_objects_attr.name";
	        ResultSet rs = stmt.executeQuery( sql );
	        while ( rs.next() ) {
	        	JSONArray tmpArr = null;
	        	String name = rs.getString("category");
	        	if(retObj.has(name)){
	        		tmpArr = retObj.getJSONArray(name);
	        	}else{
	        		tmpArr = new JSONArray();
	        	}
	        	JSONObject tmpObj = new JSONObject();
        		tmpObj.put(rs.getString("name"), rs.getString("value"));
        		tmpArr.put(tmpObj);
        		retObj.put(name,tmpArr);
	        }
	        
	        rs.close();
	        stmt.close();
			c.close();
		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}
		
		return retObj;
	}
	
}
