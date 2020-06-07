package com.base.forge;

import java.io.IOException;
import java.io.PrintWriter;
import java.sql.*;
import java.util.Date;

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
	public static String dbpath = "C:\\Users\\Administrator\\Desktop\\BIM\\model.sdb";

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
		out.print(getTreeJson(request,response));
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

	
	public JSONArray getTreeJson(HttpServletRequest request, HttpServletResponse response) {
		String parentId = request.getParameter("parentId");
		
		JSONArray retArr = new JSONArray();
		Connection c = null;
		try {
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + getTreeJson.dbpath);
			c.setAutoCommit(false);
			System.out.println("Get Tree, Opened database successfully");
			int dept = 3;
			
			if(parentId==null||"".equals(parentId)||"undefined".equals(parentId)) {
				retArr = getRootNode(c,dept);
			}else {
				retArr = getChildNode(parentId,c,1,1);
			}
			c.close();
		} catch (Exception e) {
			System.err.println(e.getClass().getName() + ": " + e.getMessage());
			System.exit(0);
		}
		return retArr;
	}

	public JSONArray getRootNode(Connection c,int dept) throws SQLException{
		int level = 1;
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
        retArr = getDataFromDb(sql,c,dept,level);
        return retArr;
	}
	
    public JSONArray getChildNode(String pId,Connection c,int dept,int level) throws SQLException{
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
        return getDataFromDb(sql,c,dept,level);
    }

    public JSONArray getDataFromDb(String sql,Connection c,int dept,int level) throws SQLException{
        JSONArray arr = new JSONArray();
        Statement stmt = null;
        stmt = c.createStatement();
        ResultSet rs = stmt.executeQuery( sql );
        
        while ( rs.next() ) {
            JSONObject tmpObj = new JSONObject();
            String id = rs.getString("entity_id");
            tmpObj.put("id",id);
            tmpObj.put("name",rs.getString("name"));
            tmpObj.put("checked",true);
            int cnum = rs.getInt("child");
            if(cnum>0){
                tmpObj.put("isParent",true);
                if(level<dept) {
                	 tmpObj.put("children",getChildNode(id,c,dept,level+1));
                	 tmpObj.put("open",true);
                }
            }else {
            	 tmpObj.put("isParent",false);
            }
            arr.put(tmpObj);
            level++;
        }
        rs.close();
        stmt.close();
        return arr;
    }

}
