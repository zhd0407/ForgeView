class CustomPropsPanel extends Autodesk.Viewing.Extensions.ViewerPropertyPanel {
    constructor( viewer ) {
        super( viewer );
    }
    
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
        
        try {
            const data = await this.getRemoteProps( dbId );
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