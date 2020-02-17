class ToolbarExtension extends Autodesk.Viewing.Extension {
    constructor( viewer, options ) {
        super( viewer, options );
        this.onToolbarCreated = this.onToolbarCreated.bind( this );
    }
    //自定义按钮
    createUI() {
      const viewer = this.viewer;
    
      // 自订义按钮 1
      const button1 = new Autodesk.Viewing.UI.Button( 'my-view-front-button' );
      button1.onClick = () => {
          viewer.setViewCube( 'front' );
      };
      button1.addClass( 'my-view-front-button' );
      button1.setToolTip( 'View front' );
    
      // 自订义按钮 2
      const button2 = new Autodesk.Viewing.UI.Button( 'my-view-back-button' );
      button2.onClick = () => {
          viewer.setViewCube('back');
      };
      button2.addClass( 'my-view-back-button' );
      button2.setToolTip( 'View Back' );
    
      // 自订义工具列
      this.subToolbar = new Autodesk.Viewing.UI.ControlGroup( 'my-custom-view-toolbar' );
      this.subToolbar.addControl( button1 );
      this.subToolbar.addControl( button2 );
    
      viewer.toolbar.addControl(this.subToolbar);
    }
    
    onToolbarCreated() {
      this.viewer.removeEventListener(av.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded);
      this.onToolbarCreatedBinded = null;
      this.createUI();
    }
    //获取工具列
    load() {
      if( this.viewer.toolbar ) {
        // Toolbar is already available, create the UI
        this.createUI();
      } else {
        // Toolbar hasn't been created yet, wait until we get notification of its creation
        this.onToolbarCreatedBinded = this.onToolbarCreated.bind(this);
        this.viewer.addEventListener( Autoesek.Viewing.TOOLBAR_CREATED_EVENT, this.onToolbarCreatedBinded );
      }
    
      return true;
    }
    //清除自订义工具列及按钮
    unload() {
      this.viewer.toolbar.removeControl( this.subToolbar );
      return true;
    }
}
//状态扩展包
Autodesk.Viewing.theExtensionManager.registerExtension( 'ToolbarExtension', ToolbarExtension ); 