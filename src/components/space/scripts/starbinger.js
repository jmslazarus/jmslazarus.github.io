console.log('load starbinger')
var args = {
  sector: {
    "parentname": "",
    "name": "Starbinger",
    "type": "sector",
    "quantity": 1,
    "properties": {
      "sector": {
        "skybox": "/media/space/textures/skybox/",
        "hideplane": 1,
      },
      "render": {
        "hud": "console,overlay,targeting,aeronautics,target,ops,target_overlay"
      },
    },
    "things": [
      {
        "parentname": "/Starbinger",
        "name": "Sector 001",
        "type": "sector",
        "quantity": 1,
        "properties": {
          "sector": {
            "skybox": "/media/space/textures/skybox/",
            "hideplane": 1,
          },
          "render": {
            "noradar": 1
          }
        },
        "things": [
          {
            "parentname": '/Starbinger/Sector 001',
            "name": 'Star',
            "type": 'star',
            "quantity": 1,
            "properties": {
              'generated': {
                'type': 'G4',
                'seed': 0.434830,
                'color': '0xfff7c0',
                'temp': 6000,
                'radius': 1.0,
                'mass': 1.0,
                'lum': 1.2,
                'hzone': 1.1,
                'lifetime': 15000,
                'randoms': '60, 0.434830'
              },
              'physical': {
                "position": [ 0, 0, -11570000 ],
                "radius": 13920000
              },
              'render': {
                "color": '0xfff7c0',
                "exists": 1
              }
            }
          },
          {
            "parentname": "/Starbinger/Sector 001",
            "name": "Mars",
            "type": "planet",
            "quantity": 1,
            "properties": {
              "physical": {
                "exists": 1,
                "position": [ 6114500, 0, 0],
                "radius": 2.2268e6,
                "mass": 6.4185e23,
                "angularvelocity": [0,7.115074e-5,0]
              },
              "render": {
                "exists": 1,
                "texture": "src/components/space/images/mars_12k_color.jpg",
                "heightmap": "src/components/space/images/mars_12k_topo.jpg",
                "normalmap": "src/components/space/images/mars_12k_normal.jpg"
              }
            }
          }
        ]
      },
      {
        "parentname": "/Starbinger",
        "name": "Sector 002",
        "type": "sector",
        "quantity": 1,
        "properties": {
          "sector": {
            "skybox": "/media/space/textures/skybox/",
            "hideplane": 1,
          },
          "render": {
            "hud": "console,rotacol,overlay,targeting,aeronautics,target,ops,target_overlay",
            "noradar": 1
          }
        },
        "things": [
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "Player",
            "type": "player",
            "quantity": 1,
            "properties": {
              "render": {
                "noradar": 1,
                "norender": 0,
                "mesh": "src/components/space/models/hud_octopit.js",
                "exists": 1
              },
              "physical": {
                "quaternion": [-0.1956027320967742, -0.4251050882119863, -0.025945271248133114, 0.8833753891027916],
                "scale": [1,1,1],
                "rotation": [0,0,0],
                "position": [-187,78,169749]
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "Shuttle",
            "type": "ship",
            "quantity": 1,
            "properties": {
              "render": {
                "shading": "flat",
                "mesh": "src/components/space/models/shuttle2.js",
                "exists": 1
              },
              "physical": {
                "label": "Light Shuttle",
                "rotation": [0,0,0],
                "scale": [3.5,3.5,3.5],
                "position": [4500,2315,167600]
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "Outpost Station",
            "type": "station",
            "quantity": 1,
            "properties": {
              "physical": {
                "rotation": [0,1,0],
                "scale": [30,30,30],
                "radius": 200,
                "mass": 50000,
                "position": [-2050,1050,160000]
              },
              "render": {
                "mesh": "src/components/space/models/station.js",
                "exists": 1
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "Fighter",
            "type": "ship",
            "quantity": 1,
            "properties": {
              "physical": {
                "label": "Medium Fighter",
                "exists": 1,
                "rotation": [0,0,0],
                "scale": [5,5,5],
                "position": [-350,-6515,169600]
              },
              "render": {
                "exists": 1,
                "texture": "/~lazarus/elation/images/space/moonmap1024.jpg",
                "shading": "smooth",
                "mesh": "src/components/space/models/tau.js"
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "Shuttle",
            "type": "ship",
            "quantity": 1,
            "properties": {
              "physical": {
                "label": "Utility Pod",
                "exists": 1,
                "scale": [1,1,1],
                "rotation": [0,0,0],
                "position": [5500,-2315,169600]
              },
              "render": {
                "shading": "flat",
                "mesh": "src/components/space/models/geodesicator.js"
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "Rock Colony",
            "type": "station",
            "quantity": 1,
            "properties": {
              "physical": {
                "scale": [600,600,600],
                "position": [20000,-20000,130000]
              },
              "render": {
                "mesh": "src/components/space/models/roidcity.js",
                "exists": 1
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "AF_01",
            "type": "roidfield",
            "quantity": 1,
            "properties": {
              "physical": {
                "fieldradius": 5000,
                "count": 0,
                "radius": 1,
                "scale": [5,5,5],
                "position": [10000,-10000,155000]
              },
              "render": {
                "noradar": 1,
                "mesh": "src/components/space/models/roid",
                "exists": 1
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "AF_02",
            "type": "roidfield",
            "quantity": 1,
            "properties": {
              "physical": {
                "fieldradius": 5000,
                "count": 30,
                "radius": 1,
                "position": [8078,-2000,169749]
              },
              "render": {
                "noradar": 1,
                "mesh": "src/components/space/models/roid",
                "exists": 1
              }
            },
            "things": []
          },
          {
            "parentname": "/Starbinger/Sector 002",
            "name": "AF_03",
            "type": "roidfield",
            "quantity": 1,
            "properties": {
              "physical": {
                "fieldradius": 15000,
                "count": 100,
                "radius": 1,
                "position": [0,0,160000]
              },
              "render": {
                "mesh": "src/components/space/models/roid",
                "noradar": 1,
                "exists": 1
              }
            },
            "things": []
          }
        ]
      }
    ]
  }
}
elation.component.add('space.starbinger', {
  usewebgl: Detector.webgl,
  lights: {},
  materials: {},
  objects_array: [],
  objects: {},
  rendering: true,
  camerapos: new THREE.Vector3(0,0,0),
  camnewpos: new THREE.Vector3(0,0,0),

  init: function() {
    // args.sector = args.sector.things[0];
    this.args = args;
    this.dustCount = 50000;
    this.dustFieldMaximum = 8000;
    this.dustFieldMinimum = 333;
    this.dustFieldRadius = this.dustFieldMaximum / 2;
    this.dustSize = 6;
    
    elation.space.controller = this;
    this.viewsize = this.getsize();

    this.scene = this.args?.scene || new THREE.Scene();
    this.sceneCube = new THREE.Scene();
    //this.scene.fog = new THREE.FogExp2(0xCCE8FF, 0.0000008);
    
    this.camera = new THREE.PerspectiveCamera(50, this.viewsize[0] / this.viewsize[1], 1, 1.5e15);
    this.tcamsize = [ 512, 512 ];
    //this.targetcam = new THREE.OrthographicCamera(w / -2, w / 2, h / 2, h / -2, -256, 512);
    this.targetcam = new THREE.PerspectiveCamera(30, this.tcamsize[0] / this.tcamsize[1], .1, 256);
    this.cameraCube = new THREE.PerspectiveCamera(50, this.viewsize[0] / this.viewsize[1], 1, 100);
    elation.events.add(window,'resize',this);
    this.camera.position = this.camerapos;
    this.scene.add(this.camera);
    this.scene.add(this.targetcam);
    this.sceneCube.add(this.cameraCube);    
    
    console.log('-!- starbinger init', {
      args: this.args, 
      viewsize: this.viewsize,
      camera: this.camera,
      targetcam: this.targetcam,
      cameraCube: this.cameraCube,
      scene: this.scene, 
      sceneCube: this.sceneCube, 
      container: this.container
    })
    this.initRenderer(); 
    this.initControls();

    console.log('-!- starbinger sector:', this.args)
    
    var HUD = elation.utils.arrayget(this.args, 'sector.properties.render.hud').split(',');
    HUD.push('radar3d');
    HUD.push('mainmenu');

    elation.ui.hud.init(HUD, this);
    
    this.collisionSystem = new CollisionSystem();
    this.addObjects(this.args.sector, this.scene);

    if (this.container) {
      this.container.appendChild(this.renderer.domElement);
    } else {
      document.body.appendChild(this.renderer.domElement);
    }
    
    this.stats = new Stats();
    this.stats.domElement.style.position = 'fixed';
    this.stats.domElement.style.bottom = '0px';
    this.stats.domElement.style.left = '0px';
    this.stats.domElement.style.zIndex = 100;
    this.container.appendChild( this.stats.domElement );

    this.projector = new THREE.Projector();
    this.mouse = [0,0];
    elation.events.add(this.container, 'mousemove', this);

    this.lastupdate = new Date().getTime();
    this.loop();

    if (elation.utils.physics) {
      elation.utils.physics.system.setController(this);
      setTimeout(() => { 
        elation.utils.physics.system.start();
        //elation.ui.hud.target.list.nextTarget();
        // this.addCollisionSystem(this);
      }, 500);
    }
    
    //elation.ui.hud.console.log('initializing, please wait...');
    //this.createAdminTool();
    //elation.space.thing.setController = this;
    
    this.addSkybox();
    this.addDust();
    this.initSound();
    this.initMOTD();
  },
  initSound: function() {
    this.sound = elation.utils.sound.system;
    this.sound.load(`hit`,`src/components/space/sounds/hit.wav`, (buffer) => {
      console.log('-!- Audio.Loaded:', 'hit')
    });
    this.sound.load(`explode`,`src/components/space/sounds/explode.wav`, (buffer) => {
      console.log('-!- Audio.Loaded:', 'explode')
    });
  },
  initMOTD: function() {
    elation.ui.hud.console.log('');
    elation.ui.hud.console.log('Movement: <p>W</p>,<p>S</p> | Strafing: <p>A</p>,<p>D</p>,<p>R</p>,<p>F</p> | Rolling: <p>Q</p>,<p>E</p> | Targeting: <p>SCROLL</p>');
    elation.ui.hud.console.log('Fire: <p>Mouse0</p> | Afterburner: <p>X</p>,<p>Mouse2</p> | Boost: <p>Mouse1</p> | Brake: <p>SHIFT</p>');
    elation.ui.hud.console.log('Firing Mode: <p>G</p> | Change Weapon: <p>1-4</p> | Switch Flight Mode: <p>C</p>');
  },
  resize: function(event) {
    this.viewsize = this.getsize();
		this.camera.aspect = this.viewsize[0] / this.viewsize[1];
		this.targetcam.aspect = this.tcamsize[0] / this.tcamsize[1];
		this.cameraCube.aspect = this.viewsize[0] / this.viewsize[1];
		this.camera.updateProjectionMatrix();
		this.targetcam.updateProjectionMatrix();
		this.cameraCube.updateProjectionMatrix();

		this.renderer.setSize( this.viewsize[0], this.viewsize[1] );

    //this.camera = new THREE.PerspectiveCamera(50, this.viewsize[0] / this.viewsize[1], 1, 1.5e15);
    //this.cameraCube = new THREE.PerspectiveCamera(50, this.viewsize[0] / this.viewsize[1], 1, 100);
  },
  addSkybox: function() {
    var texture = THREE.ImageUtils.loadTexture( 'src/components/space/images/galaxy_starfield.png');
    texture.repeat.y = 1;
    texture.repeat.x = .5;
    var material = new THREE.MeshBasicMaterial({ map: texture, depthWrite: false });
    var materialArray = material;
    var skyboxGeom = new THREE.CubeGeometry(100, 100, 100);
    
    this.skybox = new THREE.Mesh(skyboxGeom, materialArray);
    this.skybox.flipSided = true;
    this.skybox.position = this.cameraCube.position;
    
    this.sceneCube.add(this.skybox);
    this.renderer.autoClear = false;
    this.cameraCube.useQuaternion = true;
  },
  randomInRange: function(min, max) {
    var rand = Math.random(),
        value = (max - min) * rand + min;
    
    return Math.round(value);
  },
  addDust: function() {
    // create the particles
    this.dustParticles = new THREE.Geometry();
    
    var pMaterial = new THREE.ParticleBasicMaterial({
          size: this.dustSize,
          map: THREE.ImageUtils.loadTexture(
            "src/components/space/images/particle.png"
          ),
          blending: THREE.AdditiveBlending,
          depthTest: true,
          depthWrite: false,
          vertexColors: true,
          opacity: .85,
          transparent: true
        });
    
    for (var p = 0; p < this.dustCount; p++) {
      var ppos = new THREE.Vector3(
            this.camera.position.x + Math.random() * this.dustFieldMaximum - this.dustFieldRadius,
            this.camera.position.y + Math.random() * this.dustFieldMaximum - this.dustFieldRadius,
            this.camera.position.z + Math.random() * this.dustFieldMaximum - this.dustFieldRadius
          );
      
      if (this.camera.position.distanceTo(ppos) <= this.dustFieldRadius) {
        particle = new THREE.Vertex(ppos);
        this.dustParticles.vertices.push(particle);
      }
    }
    
    for(var colors=[],i=0; i < this.dustParticles.vertices.length; i++) {
      colors[i] = new THREE.Color();
      colors[i].setHSV(Math.random(), .3, .75);
    }
    
    this.dustParticles.colors = colors;
    this.dustSystem = new THREE.ParticleSystem(this.dustParticles, pMaterial);
    this.dustSystem.sortParticles = false;
    this.scene.add(this.dustSystem);
  },
  initControls: function() {
    this.controlsenabled = true;
    this.controls = elation.component.create(0, 'space.controls', this.renderer.domElement, this.args)
  },
  initRenderer: function() {
    this.renderer = (this.usewebgl ? new THREE.WebGLRenderer({ clearColor: 0x000000, clearAlpha: 1, antialias: true, maxShadows: 1000}) : new THREE.CanvasRenderer());
    this.renderer.setSize(this.viewsize[0], this.viewsize[1]);
    this.altrenderer = new THREE.WebGLRenderTarget( this.tcamsize[0], this.tcamsize[1], { format: THREE.RGBFormat } );
    this.renderer.shadowMapEnabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.shadowMapType = THREE.BasicShadowMap;

    //this.renderer.sortObjects = false;
    this.renderer.autoClear = false;
  },
  getsize: function() {
    if (this.container) {
      this.container.style.height = window.innerHeight + 'px';
      return [this.container.offsetWidth, this.container.offsetHeight];
    }
    return [window.innerWidth, window.innerHeight];
  },
  loop: function(ev) {
    if (!this.rendering) {
      return;
    }
    // deltaTime
    this.campos = new THREE.Vector3(
      this.camera.position.x,
      this.camera.position.y,
      this.camera.position.z
    );
    (function(self) {
      self.animation_id = requestAnimationFrame( function() { self.loop(ev); } );
    })(this);
  
    this.newsize = newsize = this.getsize();
    var ts = new Date().getTime();
    
    this.renderer.setViewport(0, 0, this.newsize[0], this.newsize[1]);
    this.lastupdatedelta = (ts - this.lastupdate) / 1000;
    
    elation.events.fire('renderframe_start', this);
    
    if (this.controls && this.controlsenabled) {
      this.controls.update();
    }
    
    if (elation.utils.physics) {
      elation.utils.physics.system.iterate(this.lastupdatedelta);
    }
    
    //elation.events.fire('renderframe_middle', this);
    
    if (this.dustSystem) {
      var pCount = this.dustCount,
          ship = this.objects.player.Player,
          particle;
      
      while (pCount--) {
        particle = this.dustParticles.vertices[pCount];
        
        if (
          (particle && this.camera.position.distanceTo(particle.position) > this.dustFieldRadius) ||
          (particle && this.camera.position.distanceTo(particle.position) < this.dustFieldMinimum / 2)
        ) {
          particle.position = ship.matrixWorld.multiplyVector3(new THREE.Vector3(
            Math.random() * this.dustFieldMaximum - this.dustFieldRadius,
            Math.random() * this.dustFieldMaximum - this.dustFieldRadius,
            Math.random() * this.dustFieldMaximum - this.dustFieldRadius
          ));
          
        }
      }
      
      this.dustSystem.geometry.__dirtyVertices = true;
    }
    
    if (this.camera) {
      if (this.viewsize[0] != newsize[0] || this.viewsize[1] != newsize[1]) {
        this.viewsize = newsize;
        this.renderer.setSize(this.viewsize[0], this.viewsize[1]);
        this.camera.aspect = this.viewsize[0] / this.viewsize[1];
        this.targetcam.aspect = this.tcamsize[0] / this.tcamsize[1];
        this.camera.updateProjectionMatrix();
        this.targetcam.updateProjectionMatrix();
      }
      
			this.cameraCube.quaternion.copy( this.camera.quaternion );
      
      this.renderer.clear();
      this.renderer.render(this.sceneCube, this.cameraCube);
      this.renderer.render(this.scene, this.targetcam, this.altrenderer, true);
      this.renderer.render(this.scene, this.camera);

    }
    
    elation.events.fire('renderframe_end', this);

    this.stats.update();
    this.lastupdate = ts;

    if (this.collisionSystem) {
      this.collisionSystem.update(this.lastupdatedelta);
    }
  },
  clearScene: function(root) {
    root = root || this.scene;
    
    for (var i=0; i<this.objects_array.length; i++) {
      root.remove(this.objects_array[i]);
    }
  },
  addObjects: function(thing, root) {
    var currentobj = false;
    if (typeof elation.space.meshes[thing.type] === 'function') {
      currentobj = new elation.space.meshes[thing.type](thing, this);
      if (elation.utils.arrayget(currentobj, 'properties.physical.exists') !== 0) {
        console.log("-!- starbinger added new " + thing.type + ": " + thing.parentname + '/' + thing.name);
        this.objects_array.push(currentobj);
        root.add(currentobj);

        if (thing.things) {
          for (var k in thing.things) {
            this.addObjects(thing.things[k], currentobj);
          }
        }
        
        if (!this.objects[thing.type])
          this.objects[thing.type] = {};
        
        this.objects[thing.type][currentobj.name] = currentobj;
      }
    } else {
      if (elation.utils.arrayget(thing, 'properties.physical.exists') !== 0) {
        console.log("-!- Engine.Objects: Unknown thing type '" + thing.type + "'", thing);
      }
    }
  },
  attachCameraToObject: function(thing, nosave) {
    //this.camera = this.followcamera;
    //this.controlsenabled = false;
    if (thing instanceof THREE.Camera) {
      if (!nosave) {
        this.oldcamera = this.camera;
      }
      this.camera = thing;
    } else if (thing) {
      this.camera.position = thing.position;
      this.camera.rotation = thing.rotation;
      this.camera.quaternion = thing.quaternion;
      this.camera.useTarget = false;
      this.camera.useQuaternion = true;
      console.log('camera attach', this.camera, thing);
    } else {
      if (this.oldcamera) {
        this.camera = this.oldcamera;
      }
    }
    this.camerapos = this.camera.position;
    if (elation.ui.hud && elation.ui.hud.radar) {
      elation.ui.hud.radar.setCamera(this.camera);
    }
  },
  mousemove: function(ev) {
    this.mouse[0] = ( ev.clientX / this.viewsize[0] ) * 2 - 1;
    this.mouse[1] = ( ev.clientY / this.viewsize[1] ) * 2 - 1;
  },
  createAdminTool: function() {
    var div = elation.html.create({tag: 'div', classname: "space_world_admin"});
    // var component = elation.space.admin("admin", div, { controller: this });
    this.container.appendChild(div);
  }
});