//自定义面板
class CustomPropsPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
    constructor( viewer ) {
        super( viewer );
    }
    //从自定义的接口中获取属性
    getRemoteProps( dbId ) {
        return new Promise(( resolve, reject ) => {
            fetch( "/BIM/getNodeAttr?id="+dbId, {
                method: 'get',
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            })
            .then( ( response ) => {
                if( response.status === 200 ) {
                  return response.json();
                } else {
                  return reject( new Error( response.statusText ) );
                }
            })
            .then( ( data ) => {
               if( !data ) return reject( new Error( '无法从服务器获取属性' ) );
            
               return resolve( data );
            })
            .catch( ( error ) => reject( new Error( error ) ) );
        });
    }
    
    async setNodeProperties( dbId ) {
        this.propertyNodeId = dbId;
        if( !this.viewer ) return;
        $("#ViewerPropertyPanel").removeAttr("onclick");
        try {
            const data = await this.getRemoteProps( dbId );
            $("#ViewerPropertyPanel").attr("onclick","createSimplePanel(\'"+dbId+"\',1);");
            this.setTitle( data.title, { localizeTitle: true } );
            /*var aa = [{
            	"displayName":"新增属性",
            	"displayValue":dbId,
            	"displayCategory":"测试",
            	"attributeName":"新增属性",
            	"type":"20",
            	"units":null,
            	"hidden":false,
            	"precision":0
            }];*/
           /* $.ajax({
    	        type : "GET",//提交方式
    	        url  : "/BIM/getNodeAttr?id="+treeNode.id,//提交地址
    	        data : {},//提交的数据
    	        dataType : "json",
    	        success  : function(data){  //返回结果
    	        	 this.setProperties( data );
    	        },
    	        error : function(data){
    	            alert("错误");
    	        }
    	    });*/
            this.setProperties( data.properties );
           
            this.highlight( this.viewer.searchText );
    
            this.resizeToContent();
    
            if( this.isVisible() ) {
                const toolController = this.viewer.toolController,
                mx = toolController.lastClickX,
                my = toolController.lastClickY,
                panelRect = this.container.getBoundingClientRect(),
                px = panelRect.left,
                py = panelRect.top,
                pw = panelRect.width,
                ph = panelRect.height,
                canvasRect = this.viewer.canvas.getBoundingClientRect(),
                cx = canvasRect.left,
                cy = canvasRect.top,
                cw = canvasRect.width,
                ch = canvasRect.height;
        
                if( (px <= mx && mx < px + pw) && (py <= my && my < py + ph) ) {
                    if( (mx < px + (pw / 2)) && (mx + pw) < (cx + cw) ) {
                       this.container.style.left = Math.round( mx - cx ) + 'px';
                       this.container.dockRight = false;
                    } else if( cx <= (mx - pw) ) {
                       this.container.style.left = Math.round( mx - cx - pw ) + 'px';
                       this.container.dockRight = false;
                    } else if( (mx + pw) < (cx + cw) ) {
                       this.container.style.left = Math.round( mx - cx ) + 'px';
                       this.container.dockRight = false;
                    } else if( (my + ph) < (cy + ch) ) {
                       this.container.style.top = Math.round( my - cy ) + 'px';
                       this.container.dockBottom = false;
                    } else if( cy <= (my - ph) ) {
                       this.container.style.top = Math.round( my - cy - ph ) + 'px';
                       this.container.dockBottom = false;
                    }
               }
          }
       } catch( error ) {
           this.showDefaultProperties();
       }
    }
}

function createSimplePanel(dbId,modelId){
	var div = createDiv(dbId,modelId);
	var sp = new SimplePanel(NOP_VIEWER.container,"mySp","自定义面板："+dbId, div, 700,150);
	sp.setVisible(true);
}

function createDiv(dbId,modelId){
	var div = document.createElement("div");
	div.className="addPropertyPanelClass";
	div.innerHTML ="<div class='layui-collapse' lay-filter='test'>" +
			"  <div class='layui-colla-item'>" +
			"    <h2 class='layui-colla-title'>为什么JS社区大量采用未发布或者未广泛支持的语言特性？</h2>" +
			"    <div class='layui-colla-content'>" +
			"      <p>有不少其他答案说是因为JS太差。我下面的答案已经说了，这不是根本性的原因。但除此之外，我还要纠正一些对JS具体问题的误解。JS当初是被作为脚本语言设计的，所以某些问题并不是JS设计得差或者是JS设计者的失误。比如var的作用域问题，并不是“错误”，而是当时绝大部分脚本语言都是这样的，如perl/php/sh等。模块的问题也是，脚本语言几乎都没有模块/命名空间功能。弱类型、for-in之类的问题也是，只不过现在用那些老的脚本语言的人比较少，所以很多人都误以为是JS才有的坑。另外有人说JS是半残语言，满足不了开发需求，1999年就该死。半残这个嘛，就夸张了。JS虽然有很多问题，但是设计总体还是优秀的。——来自知乎@贺师俊</p>" +
			"    </div>" +
			"  </div>" +
			"  <div class='layui-colla-item'>" +
			"    <h2 class='layui-colla-title'>为什么前端工程师多不愿意用 Bootstrap 框架？</h2>" +
			"    <div class='layui-colla-content'>" +
			"      <p>因为不适合。如果希望开发长期的项目或者制作产品类网站，那么就需要实现特定的设计，为了在维护项目中可以方便地按设计师要求快速修改样式，肯定会逐步编写出各种业务组件、工具类，相当于为项目自行开发一套框架。——来自知乎@Kayo</p>" +
			"    </div>" +
			"  </div>" +
			"  <div class='layui-colla-item'>" +
			"    <h2 class='layui-colla-title'>layui 更适合哪些开发者？</h2>" +
			"    <div class='layui-colla-content'>" +
			"      <p>在前端技术快速变革的今天，layui 仍然坚持语义化的组织模式，甚至于模块理念都是采用类AMD组织形式，并非是有意与时代背道而驰。layui 认为以jQuery为核心的开发方式还没有到完全消亡的时候，而早期市面上基于jQuery的UI都普通做得差强人意，所以需要有一个新的UI去重新为这一领域注入活力，并采用一些更科学的架构方式。" +
			"      <br><br>" +
			"      因此准确地说，layui 更多是面向那些追求开发简单的前端工程师们，以及所有层次的服务端程序员。</p>" +
			"    </div>" +
			"  </div>" +
			"  <div class='layui-colla-item'>" +
			"    <h2 class='layui-colla-title'>贤心是男是女？</h2>" +
			"    <div class='layui-colla-content'>" +
			"      <p>man！ 所以这个问题不要再出现了。。。</p>" +
			"    </div>" +
			"  </div>" +
			"</div>";
	return div;
}


/**
 * 定义扩展，初始化时自动添加面板，因为该面板需要在点击事件构造，此处不自动构造属性面板
 */
 /*
class CustomProperyPanelExt extends Autodesk.Viewing.Extension {
    constructor( viewer, options ) {
        super( viewer, options );
    }

    load() {
        this.viewer.setPropertyPanel( new CustomPropsPanel( viewer ) );
        return true;
    }
    
    unload() {
        return true;
    }
}
Autodesk.Viewing.theExtensionManager.registerExtension( 'Autodesk.ADN.CustomPropsPanel', CustomProperyPanelExt );*/