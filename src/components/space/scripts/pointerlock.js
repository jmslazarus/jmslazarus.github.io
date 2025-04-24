elation.extend('pointerlock', function(controls) {
  this.controls = controls;
  this.container = this.controls.container;
  this.mainmenu = elation.space.menu.main;
  this.parent = elation.space.starbinger(0);
  
  this.init = function() {
    elation.events.add(this.container, 'click', this);
    elation.events.add(document, 'pointerlockchange,mozpointerlockchange,webkitpointerlockchange', this);
    
    elation.html.addclass(document.body, 'show_interface');
    this.sound = elation.utils.sound.system;
    // this.sound.load(`unknownsample`,`src/components/space/sounds/unknownsample2.wav`, (buffer) => {
    //   console.log('-!- Audio.Loaded: song', 'unknownsample')
    //   this.sound.loop('unknownsample');
    // });
  }
  
  this.click = function(element) {
    if (!this.locked)
      this.request();
  }
  
  this.request = function(element) {
    if (typeof this.container.requestPointerLock != 'undefined')
      this.container.requestPointerLock();
    if (typeof this.container.webkitRequestPointerLock != 'undefined')
      this.container.webkitRequestPointerLock();
    if (typeof this.container.mozRequestPointerLock != 'undefined')
      this.container.mozRequestPointerLock();
      
    console.log('-!- PointerLock: Locked mouse cursor, hit ESC to unlock');
  }

  this.exit = function() {
    console.log('-!- PointerLock: Returning cursor control to OS');
    if (typeof document.requestPointerLock != 'undefined')
      document.requestPointerLock();
    if (typeof document.webkitExitPointerLock != 'undefined')
      document.webkitExitPointerLock();
    if (typeof document.mozExitPointerLock != 'undefined')
      document.mozExitPointerLock();
  }

  this.pointerlockchange = function(event) {
    if (document.pointerLockElement === this.container || document.mozPointerLockElement === this.container || document.webkitPointerLockElement === this.container) {
      this.locked = true;
      // this.sound.loop('unknownsample');
      this.sound.loop('engine');
      this.sound.loop('powerplant');
      this.sound.loop('radar');
      this.parent.rendering = true;
      this.parent.loop();
      elation.html.removeclass(document.body, 'show_interface');
    } else {
      this.locked = false;
      // this.sound.pause('unknownsample');
      this.sound.pause('engine');
      this.sound.pause('powerplant');
      this.sound.pause('radar');
      this.parent.rendering = false;
      elation.html.addclass(document.body, 'show_interface');
    }
    
    this.controls.state.mouse_x = 0;
    this.controls.state.mouse_y = 0;
    this.controls.state['mouse_drag_x'] = 0;
    this.controls.state['mouse_drag_y'] = 0;
    this.controls.changes.push("mouse_drag_x");
    this.controls.changes.push("mouse_drag_y");

    this.controls.pointerlock = this.locked;
    //this.parent.haltrendering = this.locked;
    this.mainmenu.toggle(this.locked);
    event.preventDefault();
    event.cancelBubble = true;
    event.stopPropagation();
  }
  
  this.handleEvent = function(event) {
    var replace = {
      'pointerlockchange':'pointerlockchange',
      'mozpointerlockchange':'pointerlockchange',
      'webkitpointerlockchange':'pointerlockchange'
    };
    
    var type = replace[event.type] ? replace[event.type] : event.type;
    this[type](event);
  }
  
  this.init();
});