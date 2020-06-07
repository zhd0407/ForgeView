//构件定义选中事件
function EventsTutorial(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
}

EventsTutorial.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
EventsTutorial.prototype.constructor = EventsTutorial;

EventsTutorial.prototype.onSelectionEvent = function(event) {
	changeNodeSelectedByModelSelection();

};
/**
 * 工具栏事件
 * */
EventsTutorial.prototype.onNavigationModeEvent = function(event) {
   // var domElem = document.getElementById('MyToolValue');
   // domElem.innerText = this.viewer.getActiveNavigationTool(); // same value as event.id
};

EventsTutorial.prototype.load = function() {
    this.onSelectionBinded = this.onSelectionEvent.bind(this);
    this.onNavigationModeBinded = this.onNavigationModeEvent.bind(this);
    this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    this.viewer.addEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
    return true;
};

EventsTutorial.prototype.unload = function() {
    this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onSelectionBinded);
    this.viewer.removeEventListener(Autodesk.Viewing.NAVIGATION_MODE_CHANGED_EVENT, this.onNavigationModeBinded);
    this.onSelectionBinded = null;
    this.onNavigationModeBinded = null;
    return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('EventsTutorial', EventsTutorial);
