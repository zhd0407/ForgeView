package com.base.forge;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class getTreeJson
 */
@WebServlet("/getTreeJson")
public class getTreeJson extends HttpServlet {
	private static final long serialVersionUID = 1L;

    /**
     * Default constructor. 
     */
    public getTreeJson() {
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		
		response.setHeader("content-type", "text/html;charset=UTF-8");
		PrintWriter out = response.getWriter();
		
		out.print(getTreeJson());
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

	
	public JSONArray getTreeJson() {
		JSONArray retArr = new JSONArray();
		Connection c = null;
		
		String db = "C:\\Users\\Administrator\\Desktop\\นคื๗\\BIM\\apache-tomcat-bim\\webapps\\ROOT\\output\\model.sdb";
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + db);
			c.setAutoCommit(false);
			System.out.println("Opened database successfully");
			
			retArr = getRootNode(c);
			
			c.close();
		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}
		return retArr;
	}

	public JSONArray getRootNode(Connection c) throws SQLException{
		 JSONArray retArr = new JSONArray();
        //root
        String sql = "select entity_id,        \n" +
                "        (\n" +
                "        select \n" +
                "                (select value from _objects_val where id = t.value_id )  \n" +
                "        from _objects_eav t \n" +
                "        where t.entity_id = _objects_eav.entity_id \n" +
                "        and  (select name from _objects_attr where id =t.attribute_id ) ='name'\n" +
                "      ) name,\n" +
                "       (\n" +
                "        select \n" +
                "              count(1)\n" +
                "        from _objects_eav t \n" +
                "        where t.entity_id = _objects_eav.entity_id \n" +
                "        and  (select name from _objects_attr where id =t.attribute_id ) ='child'\n" +
                "      ) child\n" +
                "      \n" +
                " from _objects_eav \n" +
                " where \n" +
                "       entity_id not in (\n" +
                "                 select entity_id  \n" +
                "                 from _objects_eav,_objects_attr\n" +
                "                 where _objects_attr.id = _objects_eav.attribute_id\n" +
                "                       and _objects_attr.name ='parent'\n" +
                " )\n" +
                " and attribute_id = (select id from _objects_attr where name= 'name')";
        retArr = getDataFromDb(sql,c);
        return retArr;
	}
	
    public JSONArray getChildNode(String pId,Connection c) throws SQLException{
       String sql = "select entity_id,        \n" +
               "        (\n" +
               "        select \n" +
               "                (select value from _objects_val where id = t.value_id )  \n" +
               "        from _objects_eav t \n" +
               "        where t.entity_id = _objects_eav.entity_id \n" +
               "        and  (select name from _objects_attr where id =t.attribute_id ) ='name'\n" +
               "      ) name,\n" +
               "       (\n" +
               "        select \n" +
               "              count(1)\n" +
               "        from _objects_eav t \n" +
               "        where t.entity_id = _objects_eav.entity_id \n" +
               "        and  (select name from _objects_attr where id =t.attribute_id ) ='child'\n" +
               "      ) child\n" +
               "      \n" +
               " from _objects_eav \n" +
               " where \n" +
               "       entity_id in (\n" +
               "                select entity_id  \n" +
               "   from _objects_eav,_objects_attr\n" +
               "   where _objects_attr.id = _objects_eav.attribute_id\n" +
               "         and _objects_attr.name ='parent'\n" +
               " and (select value from _objects_val where id = _objects_eav.value_id )  =" + pId +
               " )\n" +
               " and attribute_id = (select id from _objects_attr where name= 'name')";
        return getDataFromDb(sql,c);
    }

    public JSONArray getDataFromDb(String sql,Connection c) throws SQLException{
        JSONArray arr = new JSONArray();
        Statement stmt = null;
        stmt = c.createStatement();
        ResultSet rs = stmt.executeQuery( sql );
        while ( rs.next() ) {
            JSONObject tmpObj = new JSONObject();
            String id = rs.getString("entity_id");
            tmpObj.put("id",id);
            tmpObj.put("name",rs.getString("name"));
            int cnum = rs.getInt("child");
            if(cnum>0){
                tmpObj.put("isParent",true);
                tmpObj.put("children",getChildNode(id,c));
            }
            tmpObj.put("open",true);
            arr.put(tmpObj);
        }
        rs.close();
        stmt.close();
        return arr;
    }

}
