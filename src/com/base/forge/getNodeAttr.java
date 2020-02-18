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
		JSONArray retArr = new JSONArray();
		Connection c = null;
		String db = "C:\\Users\\Administrator\\Desktop\\工作\\BIM\\apache-tomcat-bim\\webapps\\ROOT\\output\\model.sdb";
		//String db = "C:\\Users\\wangjinlong\\Desktop\\sqliteDatabase\\model.sdb";
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + db);
			c.setAutoCommit(false);
			System.out.println("Opened database successfully");
			Statement stmt = null;
	        stmt = c.createStatement();
	        String sql = "select _objects_attr.category,"
	        		+ "(select (select value from _objects_val a where id = t.value_id )"
	        		+ " from _objects_eav t " 
	        		+ " where t.entity_id = _objects_eav.entity_id " 
	        		+ " and  (select name from _objects_attr where id =t.attribute_id ) ='name' ) title,"
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
	        
	     /*   var aa = [{
            	"displayName":"新增属性",
            	"displayValue":dbId,
            	"displayCategory":"测试",
            	"attributeName":"新增属性",
            	"type":"20",
            	"units":null,
            	"hidden":false,
            	"precision":0
            }];*/
	        retObj.put("title", "");
	        while ( rs.next() ) {
        		if("".equals(retObj.getString("title"))){
	        		retObj.put("title", rs.getString("title"));
	        	}
        		JSONObject tmpObj = new JSONObject();
        		tmpObj.put("displayName", rs.getString("name"));
        		tmpObj.put("displayValue", rs.getString("value"));
        		tmpObj.put("attributeName", rs.getString("name"));
        		tmpObj.put("displayCategory", rs.getString("category"));
        		tmpObj.put("type", rs.getString("data_type"));
        		tmpObj.put("units", "");
        		tmpObj.put("hidden", false);
        		tmpObj.put("precision", 0);
        		retArr.put(tmpObj);
	        	
	        }
	        retObj.put("properties", retArr);
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
