// Content for 'my-awesome-extension.js'

function demoExtension(viewer, options) {
  Autodesk.Viewing.Extension.call(this, viewer, options);
  this.lockViewport = this.lockViewport.bind(this);
  this.unlockViewport = this.unlockViewport.bind(this);
}

demoExtension.prototype = Object.create(Autodesk.Viewing.Extension.prototype);
demoExtension.prototype.constructor = demoExtension;

demoExtension.prototype.load = function() {
  var viewer = this.viewer;

  var lockBtn = document.getElementById('MyAwesomeLockButton');
  lockBtn.addEventListener('click', function() {
    viewer.setNavigationLock(true);
  });

  var unlockBtn = document.getElementById('MyAwesomeUnlockButton');
  unlockBtn.addEventListener('click', function() {
    viewer.setNavigationLock(false);
  });
  return true;
};

demoExtension.prototype.unload = function() {
  alert('demoExtension is now unloaded!');
  return true;
};

Autodesk.Viewing.theExtensionManager.registerExtension('demoExtension', demoExtension);
