//ENABLE_DEBUG = false;
var config = {
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
var viewer = new Autodesk.Viewing.Private.GuiViewer3D(element, config);
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

    viewer.loadModel("./3d.svf", undefined, onLoadSuccess, onLoadError);

});

$(document).ready(function(){
	 $.ajax({
        type : "GET",//提交方式
        url  : "/BIM/getTreeJson",//提交地址
        data : { },//提交的数据
        dataType : "json",
        success  : function(data){  //返回结果
            console.log(data);
            var setting = {
            	callback: {
            		onClick: zTreeOnClick
            	}
            };
            var zNodes = data;
            $.fn.zTree.init($("#treeDemo"), setting, zNodes);
        },
        error : function(data){
            alert("错误");
        }
    });
});

function getZtree(){
	return $.fn.zTree.getZTreeObj("treeDemo");
}

function zTreeOnClick(event, treeId, treeNode) {
    
    if(treeNode.id){
    	 $.ajax({
	        type : "GET",//提交方式
	        url  : "/BIM/getNodeAttr?id="+treeNode.id,//提交地址
	        data : {},//提交的数据
	        dataType : "json",
	        success  : function(data){  //返回结果
	            console.log(data);
	        },
	        error : function(data){
	            alert("错误");
	        }
	    });
    }
};

function onLoadSuccess(event) {
    console.log('success');
}

function onLoadError(event) {
    console.log('fail');
}