package com.base.forge;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.logging.Logger;

import javax.servlet.ServletException;
import javax.servlet.ServletInputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONArray;
import org.json.JSONObject;

/**
 * Servlet implementation class getNodeParentNodeIds
 */
@WebServlet("/getNodeParentNodeIds")
public class getNodeParentNodeIds extends HttpServlet {
	private static final long serialVersionUID = 1L;
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public getNodeParentNodeIds() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		JSONArray retArr = new JSONArray();
		Connection c = null;
		try{
			String ids =request.getParameter("ids");
			Class.forName("org.sqlite.JDBC");
			c = DriverManager.getConnection("jdbc:sqlite:" + getTreeJson.dbpath);
			c.setAutoCommit(false);
			System.out.println("Get child's parent ids, Opened database successfully");
			String[] id = ids.split("\\|");
			for(int i=0;i<id.length;i++) {
				JSONArray arr = new JSONArray();
				getParentNodes(id[i],arr,c);
				retArr.put(arr);
			}
			c.close();
		}catch (Exception e) {
			e.printStackTrace();
		}
		PrintWriter out = response.getWriter();
		out.write(retArr.toString());
		out.flush();
		out.close();

	}

	private void getParentNodes(String cId,JSONArray arr,Connection c) {
		String sql = "SELECT entity_id," + 
				"	(SELECT ( SELECT value FROM _objects_val" + 
				"				WHERE id = t.value_id )" + 
				"		FROM _objects_eav t" + 
				"		WHERE t.entity_id = _objects_eav.entity_id" + 
				"		AND ( SELECT name FROM _objects_attr" + 
				"			WHERE id = t.attribute_id ) = 'parent'" + 
				"	) parent" + 
				" FROM _objects_eav" + 
				" WHERE entity_id = " + cId +
				" AND attribute_id = ( " + 
				"	SELECT id FROM _objects_attr WHERE name = 'name')";
		Statement stmt = null;
        try {
			stmt = c.createStatement();
			ResultSet rs = stmt.executeQuery( sql );
	        while ( rs.next() ) {
	            String parentId = rs.getString("parent");
	            if(parentId!=null&&!"".equals(parentId)&&!"null".equals(parentId)) {
	            	arr.put(parentId);
	            	getParentNodes(parentId, arr, c);
	            }
	        }
	        rs.close();
	        stmt.close();
		} catch (SQLException e) {
			e.printStackTrace();
		}
        
	}
	
	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		doGet(request, response);
	}

}
