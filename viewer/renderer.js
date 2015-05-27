
var utils = require('./utils'),
    config = require('./config'),
    mat4 = require('gl-matrix').mat4,
    vec3 = require('gl-matrix').vec3,
    shape = require('./shape');

function Renderer(gl, options) {  
  this.gl = gl;
  this._interval = null;
  this.timePerFrame = 1000 / options.fps;
  
  this.scene = {
    projection: mat4.create(),
    modelView: mat4.create(),
    timeReference: Date.now(),
    ambiantColor: config.ambiantColor,
    lightPosition: config.lightPosition,
    lightColor: config.lightColor,
    camera: {
      needUpdate: true,
      height: options.size.y || 900,
      width: options.size.x || 400,
      position: config.camera.position,
      rotation: config.camera.rotation,
      scale: config.camera.scale,
      fov: config.camera.fov,
      far: config.camera.far,
      near: config.camera.near
    }
  };
  
  gl.clearColor(44/255, 62/255, 80/255, 1.0);
  gl.enable(gl.DEPTH_TEST);
}

Renderer.prototype.run = function () {
  shape.init(this.gl, this.scene);
  
  var _this = this;
  this._interval = setInterval(function () {
    _this._renderLoop();
  }, this.timePerFrame);
};

Renderer.prototype.stop = function () {
  if (this._interval) {
    clearInterval(this._interval);
  }
};

Renderer.prototype._renderLoop = function () {
  var gl = this.gl;

  if (this.scene.camera.needUpdate) {
    this._updateCamera();
    this.scene.shape.needRender = true;
  }
  if (this.scene.shape.needUpdate) {   
    shape.update(gl, this.scene);
  }
  
  if (this.scene.shape.needRender) {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);  
    gl.useProgram(this.scene.shape.program);
    
    shape.render(gl, this.scene);
    this.scene.shape.needRender = false;
  }
  
  this.scene.camera.rotation[0] = (this.scene.camera.rotation[0] + config.rotationSpeed) % (2 * Math.PI);
  this.scene.camera.rotation[1] = (this.scene.camera.rotation[1] + config.rotationSpeed) % (2 * Math.PI);
  this.scene.camera.rotation[2] = (this.scene.camera.rotation[2] + config.rotationSpeed) % (2 * Math.PI);

  this.scene.camera.needUpdate = true;
};

Renderer.prototype._updateCamera = function () {
  var c = this.scene.camera;
   
  mat4.perspective(this.scene.projection, c.fov, c.width / c.height, c.near, c.far);
  this.scene.camera.needUpdate = false;
}


module.exports = Renderer;