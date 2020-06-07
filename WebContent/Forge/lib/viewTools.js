//ENABLE_DEBUG = false;
var config = {
		//安装扩展
    extensions: [
        "Autodesk.Viewing.ZoomWindow","EventsTutorial"
    ],
    disabledExtensions: {
        measure: false,
        section: false,
    },
    memory: {
        limit: 32 * 1024    //32 GB
    }
};

var element = document.getElementById('viewer-local');
//带原生工具栏
var viewer = new Autodesk.Viewing.Private.GuiViewer3D(element, config);
//不带原生工具栏
//var viewer = new Autodesk.Viewing.Viewer3D(element, config);

var options = {
    env: 'Local',
    offline: 'true',
    useADP: false
};

Autodesk.Viewing.Initializer (options, function () {
    var startedCode = viewer.start();
    if (startedCode > 0) {
        console.error('Failed to create a Viewer: WebGL not supported.');
        return;
    }
    //直接在这里获取viewer.model无法获取到，需要到成功后的回调里才能获取到
    viewer.loadModel("./3d.svf", undefined, onLoadSuccess, onLoadError);
   
});

function onLoadSuccess(event) {
	//因无法解析原来的树结构，导致无法重构树结构
	//此处改为ztree，需要改造viewer3D.js代码，见var Tree = function 方法
	createTreeAfterModelload();
	viewer.setPropertyPanel( new CustomPropsPanel( viewer ) );
	
	
	
	
	//createTreeAfterModelload();
	//viewer.setReverseVerticalLookDirection(true);
//	setSettingsPane(viewer);
}

function setSettingsPane(viewer){
	debugger;
	var stp = viewer.getSettingsPanel(true);
	if (stp) {
		if(!stp.isVisible()){
			stp.setVisible(true);
			stp.addTab("tab1","新tab",{"tabClassName":"tabDiv","minWidth":"200","index":1});
			stp.createCloseButton();
			var cid = stp.addCheckbox("tab1","外观","checked",stpOnchange,null);
			stp.addControl("tab1",cid);
			stp.selectTab("tab1");
			
		}
    } else {
    	stp = new SettingsPanel(viewer,"myStp", "createNewStp",null);
    	stp.setVisible(true,true);
    	
    	this.setSettingsPanel(stp);
    	stp.syncUI();
    }
	
}

function stpOnchange(){
	
}

function createTreeAfterModelload(){
	var setting = {
			check: {
				enable: true,
				chkStyle: "checkbox",
				chkboxType: { "Y": "s", "N": "s" }
			},
			async:{
				enable:true,
				url:"/BIM/getTreeJson",
				otherParam:["parentId",""],
				type: "get"
			},
			callback: {
				onClick: zTreeOnClick,
				onDblClick: zTreeOnDblClick,
				onCheck: zTreeOnCheck,
				beforeAsync: zTreeBeforeAsync,
				onAsyncSuccess: zTreeOnAsyncSuccess
			}
		};
	
	$.fn.zTree.init($("#treeDemo"), setting);
	
}
function zTreeOnAsyncSuccess(event, treeId, treeNode, msg){
	changeNodeSelectedByModelSelection();
}

function changeNodeSelectedByModelSelection(){
	//点击构件，将选中的构件在ztree上选中，自动定位
    var currSelection = viewer.getSelection();
    var treeObj = getZtree();
    //将所有选项清除选中
    if(treeObj){
    	 var selectedNodes = treeObj.getSelectedNodes();
	    for(var i=0;i< selectedNodes.length;i++ ){
	    	treeObj.cancelSelectedNode(selectedNodes[i]);
		}
    }
    //设置节点选中
    var unloadNodeIds = "";
    for(var i=0;i< currSelection.length;i++ ){
    	 var nodes = treeObj.getNodesByParam("id", currSelection[i], null); 
    	 if(nodes.length>0){
    		 treeObj.selectNode(nodes[0],true);
    	 }else{
    		 unloadNodeIds += currSelection[i] + "|";
    	 }
    }
    //获取未加载的节点的上层节点并选中
    if(unloadNodeIds.length>0){
    	  $.ajax({
	        type : "POST",//提交方式
	        url  : "/BIM/getNodeParentNodeIds?ids=" + unloadNodeIds,//提交地址
	        data : {},//提交的数据
	        dataType : "json",
	        success  : function(data){  //返回结果
	        	if(data.length>0){
	        		for(var i=0;i<data.length;i++){
		        		var ids = data[i];
		        		for(var j=0;j<ids.length;j++){
		        			var nodes = treeObj.getNodesByParam("id", ids[j], null); 
		        	    	 if(nodes.length>0){
		        	    		 treeObj.selectNode(nodes[0],true);
		        	    	 }
		        		}
		        	}
	        	}
	        },
	        error : function(data){
	            alert("错误");
	        }
	    });
    }
}

function zTreeBeforeAsync(treeId,treeNode){
	var treeObj = getZtree();
	if(treeNode){
		treeObj.setting.async.otherParam = ["parentId",treeNode.id];
	}
	return true;
}

//点击树节点，更新属性面板
function zTreeOnClick(event, treeId, treeNode) {
    if(treeNode.id){
    	var treeObj = getZtree();
    	var nodes = treeObj.getCheckedNodes(true);
    	if(nodes.length>0){
    		viewer.show(parseInt(treeNode.id));
    	}else{
    		viewer.isolate(parseInt(treeNode.id));
    	}
    	treeObj.checkNode(treeNode, true, true);
    	 var customPropsPanel = viewer.getPropertyPanel();
    	 //获取面板后，直接将属性放入面板即可，不需要再将面板放入到viewer
    	 customPropsPanel.setNodeProperties(treeNode.id);
    }
};

function zTreeOnDblClick(event, treeId, treeNode) {
	//隔离构建
	viewer.isolate(parseInt(treeNode.id));
	//获取要定位视角的所有构建ID
	var currNodeId = treeNode.id;
	var dbIds = [parseInt(currNodeId)];
	var treeObj = getZtree();
	var nodes = treeObj.getCheckedNodes(true);
	for(var i=0;i<nodes.length;i++){
		var id = parseInt(nodes[i].id);
		if(dbIds.indexOf(id)<0){
			viewer.show(id);
			dbIds.push(id);
		}
	}
	//视角
	viewer.fitToView(dbIds);
};
var allNodes = [];
//下拉框勾选
function zTreeOnCheck(event, treeId, treeNode) {
	var treeObj = getZtree();
	var nodes = treeObj.getCheckedNodes(true);
	if(treeNode.checked){
		if(nodes.length==1){
			viewer.isolate(parseInt(treeNode.id));
		}else{
			//初始化直接勾选父节点，如果不隔离，会导致模型不隐藏
			viewer.isolate(parseInt(nodes[0].id));
			viewer.show(parseInt(treeNode.id));
		}
	}else{
		viewer.hide(parseInt(treeNode.id));
	}
	
	var count = 1;
	allNodes = treeObj.transformToArray(treeObj.getNodes());
	/*setInterval(function () {
		if(count<allNodes.length){
			if(!allNodes[count].isParent){
				console.log(count);
				viewer.show(parseInt(allNodes[count].id));
			}
		}
		count++;
    }, 50); 
	*/
	
	
};

function getZtree(){
	return $.fn.zTree.getZTreeObj("treeDemo");
}

function changeModelColor(nodeId){
	var color = new THREE.Vector4( 85,113,163, 1 );
	viewer.setThemingColor( nodeId, color);
}

function onLoadError(event) {
    console.log('fail');
}