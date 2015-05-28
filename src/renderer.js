
var config = require('./config'),
    utils = require('./utils'),
    webgl = require('webgl-context'),
    $ = require('jquery'),
    vec3 = require('gl-matrix').vec3,
    mat4 = require('gl-matrix').mat4;
    
var glslify = require('glslify');

function Renderer() {
  this.gl = this._getWebGLContext();
  
  this._initCamera();
  this._initMaterial();
  this._initBuilding();
  this._initLights();
  
  this.gl.clearColor(0, 0, 0, 1);
  this.gl.enable(this.gl.DEPTH_TEST);
}

Renderer.prototype.render = function () {
  var _this = this;
  
  setInterval(function () {
    requestAnimationFrame(function () {
      if (_this.needUpdate) { _this._update(); }
      if (_this.needDraw) { _this._draw(); }    
    });
  }, 1000 / config.fps);
};


Renderer.prototype._initCamera = function () {
  var canvas = $(config.domElement),
      width = canvas.parent().width(),
      height = config.height,
      near = 0.1,
      far = 1000;
      
  this.camera = {
    width: width,
    height: height,
    position: config.camera.position,
    rotation: config.camera.rotation
  };
  this.projectionMatrix = mat4.create();
  mat4.perspective(this.projectionMatrix, Math.PI / 2, width / height, near, far);
};

Renderer.prototype._initMaterial = function () {
  var uniforms = [
    { name: 'u_projection' },
    { name: 'u_ambiant_color' },
    { name: 'u_light_position' },
    { name: 'u_light_color' }
  ];
  var attributes = [
    { name: 'a_position' },
    { name: 'a_model_view' },
    { name: 'a_normal' }
  ];
  var program = utils.createProgram(
    this.gl,
    glslify('./shaders/vert.glsl'),
    glslify('./shaders/frag.glsl'),
    uniforms, attributes
  );
  
  return {
    uniforms: uniforms,
    attributes: attributes,
    program: program
  };
};

Renderer.prototype._initBuilding = function () {
  this.building = {
    objectTree: null,
    vertex: this.gl.createBuffer(this.gl.ARRAY_BUFFER),
    normal: this.gl.createBuffer(this.gl.ARRAY_BUFFER),
    modelView: this.gl.createBuffer(this.gl.ARRAY_BUFFER),
    index: this.gl.createBuffer(this.gl.ELEMENT_ARRAY_BUFFER)
  };
};

Renderer.prototype._initLights = function () {
  this.lights = {
    ambiant: config.lights.ambiant,
    position: config.lights.position,
    color: config.lights.color
  };
};

Renderer.proyotype._getWebGLContext = function () {
  var canvas = $(config.domElement),
      width = canvas.parent().width(),
      height = config.height;
      
  return webgl({
    canvas: canvas.get(0),
    width: width,
    height: height
  });
};

Renderer.prototype._update = function () {
  var flat = this.building.objectTree.flatten(),
      gl = this.gl;
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.vertex);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat.vertex), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.normal);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat.normal), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.modelView);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat.modelView), gl.STATIC_DRAW);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.building.vertex);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flat.index), gl.STATIC_DRAW);
  this.building.nbrVertices = flat.index.length;
  
  this.needUpdate = false;
};

Renderer.prototype._draw = function () {
  var gl = this.gl;
  
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  gl.useProgram(this.material.program);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.vertex);
  gl.vertexAttribPointer(this.material.attibutes[0].location, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.normal);
  gl.vertexAttribPointer(this.material.attibutes[1].location, 3, gl.FLOAT, false, 0, 0);
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.modelView);
  gl.vertexAttribPointer(this.material.attibutes[2].location, 16, gl.FLOAT, false, 0, 0);
  
  gl.uniformMatrix4fv(this.material.uniforms[0].location, false, this.projectionMatrix);
  gl.uniform3fv(this.material.uniforms[1], this.lights.ambiant);
  gl.uniform3fv(this.material.uniforms[2], this.lights.position);
  gl.uniform3fv(this.material.uniforms[3], this.lights.color);
  
  gl.bindBuffer(gl.ARRAY_BUFFER, this.building.index);
  gl.drawElements(gl.TRIANGLES, this.building.nbrVertices, gl.UNSIGNED_SHORT, 0);
  
  this.needDraw = false;
};





module.exports = Renderer;

