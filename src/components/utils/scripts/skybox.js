elation.extend('space.skybox', new function() {
  this.init = function() {
    this.sceneCube = new THREE.Scene();
    this.cameraCube = new THREE.PerspectiveCamera(50, this.viewsize[0] / this.viewsize[1], 1, 100);
    this.sceneCube.add(this.cameraCube);
  }
  
  this.create = function(scene, renderer) {
    var texture = THREE.ImageUtils.loadTexture( '/~lazarus/elation/images/space/galaxy_starfield.png');
    texture.repeat.y = 1;
    texture.repeat.x = .5;
    var material = new THREE.MeshBasicMaterial({ map: texture, depthWrite: false });
    var materialArray = material;
    var skyboxGeom = new THREE.CubeGeometry(100, 100, 100);
    
    this.skybox = new THREE.Mesh(skyboxGeom, materialArray);
    this.skybox.flipSided = true;
    this.skybox.position = this.cameraCube.position;
    
    this.sceneCube.add(this.skybox);
    renderer.autoClear = false;
  }
});