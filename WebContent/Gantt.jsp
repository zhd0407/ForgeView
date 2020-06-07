<%@ page pageEncoding="utf-8"%>

 
<head>
<title>Gantt</title>
	<script src="/BIM/plugins/jquery-3.3.1/jquery-3.3.1.min.js"></script>
	<script src="/BIM/plugins/dhtmlxGantt_v4.0.0/codebase/dhtmlxgantt.js" charset="utf-8"></script>
	<script src="/BIM/plugins/dhtmlxGantt_v4.0.0/codebase/locale/locale_cn.js" charset="utf-8"></script>
	<script src="/BIM/plugins/dhtmlxGantt_v4.0.0/codebase/ext/dhtmlxgantt_marker.js" charset="utf-8"></script>	
	<link rel="stylesheet" href="/BIM/plugins/dhtmlxGantt_v4.0.0/codebase/skins/dhtmlxgantt_meadow.css" type="text/css" media="screen" title="no title" charset="utf-8">
     <style type="text/css" media="screen">
	   body{
	        margin:0px;
	        padding:0px;
	        height:100%;
	        overflow:auto;
	    }
	</style> 
    <script type="text/javascript"> 
      //后台取横坐标
   	var ganttType = "2";

   	var tasks={
	    data:[
	        {id:1, text:"项目 #1", start_date:"2016-05-01",end_date:"2018-05-01", progress:0.6, open:true},
	        {id:2, text:"项目 #1.1", start_date:"2016-05-01",end_date:"2017-05-01", progress:1, open:true,parent:1},
	        {id:3, text:"项目 #1.2", start_date:"2017-05-02",end_date:"2017-07-30", progress:0.2, open:true,parent:1},
	        {id:4, text:"项目 #2", start_date:"2018-06-01",end_date:"2018-12-31", progress:0.8, open:true},
	        {id:5, text:"项目 #2.1", start_date:"2018-06-01",end_date:"2018-06-30", progress:1, open:true,parent:4},
	        {id:6, text:"项目 #2.2", start_date:"2018-07-01",end_date:"2018-09-30", progress:0.8, open:true,parent:4},
	        {id:7, text:"项目 #2.3", start_date:"2018-10-01",end_date:"2018-12-31", progress:0.2, open:true,parent:4},
	        {id:8, text:"项目 #2.3.1", start_date:"2018-10-01",end_date:"2018-10-31", progress:0.2, open:true,parent:7},
	    ],
	    links:[
	        {id:1, source:2, target:3, type:"0"},
	        {id:2, source:5, target:6, type:"0"},
	        {id:3, source:6, target:7, type:"0"}
	        ]
	};   
     	
     	
 /*
 		
  ● data - 定义甘特图中的任务 
  　　○ id - (string, number)任务id 
  　　○ start_date - (Date)任务开始日期 
  　　○ text - (string)任务描述 
  　　○ progress - (number) 任务完成度，0到1 
  　　○ duration - (number) 在当前时间刻度下的任务持续周期 
  　　○ parent - (number) 父任务的id 
  ● links - 定义甘特图中的任务关联线 
  　　○ id - (string, number) 关联线id 
  　　○ source - (number) 数据源任务的id 
  　　○ target - (number) 目标源任务的id 
  　　○ type - (number) 关联线类型：0 - “结束到开始”，1 - “开始到开始”，2 - “结束到结束” */
    
    
    
    $(function(){
    	if("1"==ganttType){
	   	    //年	
	    	gantt.config.scale_unit = "year";
	    	gantt.config.step = 1;
	    	gantt.config.date_scale = "%Y";  
    	}else if("2"==ganttType){
	    	 //月
	        gantt.config.scale_unit = "year";
	    	gantt.config.date_scale = "%Y";
	
	    	gantt.config.scale_height = 50;
	
	    	gantt.config.subscales = [
	    		{unit:"month", step:1, date:"%F" }
	    	]; 
    	}else if("3"==ganttType){
	    	//日
	    	gantt.config.scale_unit = "month";
			gantt.config.date_scale = "%F, %Y";
		
			gantt.config.scale_height = 50;
			gantt.config.subscales = [
				{unit:"day", step:1, date:"%j" }
			];
			gantt.config.min_column_width = 20; 
    	}else if("4"==ganttType){
		//周
	    	var weekScaleTemplate = function(date){
				var dateToStr = gantt.date.date_to_str("%d %M");
				var endDate = gantt.date.add(gantt.date.add(date, 1, "week"), -1, "day");
				return dateToStr(date) + " - " + dateToStr(endDate);
			};
	
			gantt.config.scale_unit = "week";
			gantt.config.step = 1;
			gantt.templates.date_scale = weekScaleTemplate;
			gantt.config.subscales = [
				{unit:"day", step:1, date:"%D" }
			];
			gantt.config.min_column_width = 20;
			gantt.config.scale_height = 50;
    	}
    	
    	
    	gantt.config.xml_date = "%Y-%m-%d";
    	//调整颜色
    	gantt.templates.grid_row_class = function(start, end, item){
			return item.$level==0?"gantt_project":"";
		};
		gantt.templates.task_row_class = function(start, end, item){
			return item.$level==0?"gantt_project":"";
		};
		gantt.templates.task_class = function(start, end, item){
			return item.$level==0?"gantt_project":"";
		};
    	//将今天线划出
		var date_to_str = gantt.date.date_to_str(gantt.config.task_date);
		/* var today = new Date(2016, 6, 1);
		gantt.addMarker({
			start_date: today,
			css: "today",
			text: "Today",
			title:"Today: "+ date_to_str(today)
		}); 
		 */
	 	/* gantt.attachEvent("onTaskClick", function(id, e) {
			var task = gantt.getTask(id);
		     alert("项目："+task.text+"   完成率："+task.progress); 
		});  */
		
		gantt.templates.task_text=function(start,end,task){
			if(task.progress!=0){
		   		 return task.progress*100+"%";
			}else{
				return " ";
			}
		};
	    gantt.init("gantt_here");
	    gantt.parse(tasks); 
	      
	    
	     var day = 1;
	     var month = 6;
	     var year = 2016;
	     
	     
	    setInterval(function () {
	    	if(day++>28){
	    		day = 1;
	    		if(month>12){
	    			year++;
	    			month = 1;
	    		}else{
	    			month++;
	    		}
	    	}
	    	
	    	gantt.updateMarker({start_date: new Date(year, month, day),css: "today"})
	    }, 100); 
    });
    	
 
/*     function  xiazai(){
    	 gantt.exportToPDF({
 	        name:"gantt.pdf",
 	        locale:"cn" 
 		});
    } */
   
   </script>
  </head>
  
  <body>  
	<div>
		<div id="gantt_here" style='width:100%; height:100%;overflow:auto'  >
		</div>
	</div>
  </body>
</html>
