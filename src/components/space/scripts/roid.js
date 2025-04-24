elation.extend("space.meshes.roid", function(args) {
  elation.space.thing.call(this, args);
  this.args = args;
  
  this.expose = [
    'id',
    'rotation',
    'position'
  ];
  
  this.postinit = function() {
    var properties = this.properties;
    
    this.render = properties.render;
    this.physical = properties.physical;
    //this.collisionradius = this.physical.radius;
    //console.log('roid',this.collisionradius);
    elation.space.geometry.get(this.render.mesh, this);

    this.health = this.physical.scale.reduce((a,b) => { return a + b }, 1) / 3;
    /*
    (function(self, mesh) {
      var loader = new THREE.JSONLoader();
      loader.load(mesh, function(geometry) { 
        //geometry.computeVertexNormals();
        self.loadMesh(geometry); 
      });
    })(this, this.render.mesh);
    */
    elation.events.add(null, 'renderframe_start', this);
    
    this.dynamics.skip = true;
    this.dynamics.radius = 0;
  }
  
  this.loadMesh = function(geometry) {
    var color = new THREE.Color();
    var num = Math.random();
    var f = (1 + this.physical.rand).toFixed(2);
    color.setHSV(Math.random(), num, 1-num);
    //var geometry = new THREE.CubeGeometry( 1, 1, 1 );
    geometry.computeTangents();
    geometry.computeVertexNormals();

    var material = this.material = elation.space.materials.getMaterial('asteroid_material_'+this.render.texture, new THREE.MeshPhongMaterial({ 
      map: this.render.texture,
      normalMap: THREE.ImageUtils.loadTexture(this.render.normalMap),
      shinniness: 0,
      shading: THREE.SmoothShading, 
      blending: THREE.AdditiveAlphaBlending,
      color: color.getHex()
    }));
    material.color = color;
    material.map.wrapS = material.map.wrapT = THREE.RepeatWrapping;
    material.normalMap.wrapS = material.normalMap.wrapT = THREE.RepeatWrapping;
    material.map.repeat.set(f,f);   
    material.normalMap.repeat.set(f,f);  
    var mesh = new THREE.Mesh(geometry, material);

    //mesh.receiveShadow = true;
    
    mesh.position.set(this.physical.position[0], this.physical.position[1], this.physical.position[2]);
    mesh.rotation.set(this.physical.rotation[0], this.physical.rotation[1], this.physical.rotation[2]);
    mesh.scale.set(this.physical.scale[0], this.physical.scale[1], this.physical.scale[2]);

    this.mesh = mesh;
    this.addToController();
    this.controller.scene.add(mesh);
    //this.updateCollisionSize();
  }
  
  this.addToController = function() {
    var o = this.controller.objects,
        name = this.args.name,
        type = this.args.type;
    
    if (!o[type])
      o[type] = {};
      
    if (!o[type][name])
      o[type][name] = [];    
    
    o[type][name].push(this.mesh);
  }
  
  this.collision = function(asteroid, normal, other) {
    console.log('collision', asteroid.health);
    if (other.object.type !== 'player') {
      if (!this.visible) return;
      // if (this.health) this.health -= 10;
      // if (this.health <= 0) 
        this.explode(asteroid);
    }
  }

  this.renderframe_start = function(ev) {
    if (!this.mesh)
      return;
        
    var min = .00005,
        max = .0005,
        mesh = this.mesh, 
        aspect, speed;
    
    aspect = 1 - (this.physical.maxscale / this.physical.scale[0]);
    speed = (max - min) * aspect + min;
    
    mesh.rotation.z += speed;
    mesh.rotation.y += -speed*1.5;
  }

  this.explode = function(asteroid) {
    // this.createExplosion();
    // createFlash(asteroid.position);
    this.playExplosionSound();
    // fragmentAsteroid(asteroid);
  }

  this.createExplosion = function(position) {
    var particles = [];
    var particleCount = 1000;
    var particleSystem;

    var geometry = new THREE.Geometry();
    var material = new THREE.ParticleBasicMaterial({
        color: 0xffffff,
        size: 0.1
    });

    for (var i = 0; i < particleCount; i++) {
        var particle = new THREE.Vector3(
            this.mesh.position.x + (Math.random() - 0.5) * 2, // Random X
            this.mesh.position.x + (Math.random() - 0.5) * 2, // Random Y
            this.mesh.position.x + (Math.random() - 0.5) * 2  // Random Z
        );
        particle.velocity = new THREE.Vector3(
            (Math.random() - 0.5) * 0.1, // Random velocity X
            (Math.random() - 0.5) * 0.1, // Random velocity Y
            (Math.random() - 0.5) * 0.1  // Random velocity Z
        );
        particles.push(particle);
        geometry.vertices.push(particle);
    }

    particleSystem = new THREE.ParticleSystem(geometry, material);
    this.controller.scene.add(particleSystem);
  }

  this.playExplosionSound = function() {
    this.controller.sound.load(`explode`,`src/components/space/sounds/explode.wav`, (buffer) => {
      this.controller.sound.play('explode');
      this.controller.scene.remove(this.mesh);
      this.visible = false;
    })
  }
  
  this.init();
});

elation.space.meshes.roid.prototype = new elation.space.thing();