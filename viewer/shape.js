
var box = require('./box'),
    utils = require('./utils'),
    mat4 = require('gl-matrix').mat4,
    mat3 = require('gl-matrix').mat3,
    vec3 = require('gl-matrix').vec3;

var glslify = require('glslify');

function setTree(root, scene) {
  scene.shape.root = root;
  scene.shape.needUpdate = true;
}

function init(gl, scene) {
  var shape = {};

  shape.root = null;

  shape.uniforms = [
    { name: 'u_projection', location: null },
    { name: 'u_modelView', location: null },
    { name: 'u_normalMatrix', location: null },
    { name: 'u_ambiant_color', location: null },
    { name: 'u_point_lighting_location', location: null },
    { name: 'u_point_lighting_color', location: null }
  ];

  shape.attributes = [
    { name: 'a_position', location: null },
    { name: 'a_normal', location: null }
  ];

  shape.program = utils.createProgram(
    gl,
    glslify('./shaders/shape.vert.glsl'),
    glslify('./shaders/shape.frag.glsl'),
    shape.uniforms, shape.attributes
  );
  scene.shape = shape;
}

function update(gl, scene) {
  if (!scene.shape.root) { return; }
  var flat = box.flatten(scene.shape.root);

  var vertexBuffer = gl.createBuffer(gl.ARRAY_BUFFER),
      normalBuffer = gl.createBuffer(gl.ARRAY_BUFFER),
      indexBuffer = gl.createBuffer(gl.ELEMENT_ARRAY_BUFFER);

  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat.vertices), gl.STREAM_DRAW);

  gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(flat.normals), gl.STREAM_DRAW);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(flat.indexes), gl.STREAM_DRAW);

  scene.shape.itemSize = 3;
  scene.shape.itemNbr = flat.indexes.length;
  scene.shape.vertexBuffer = vertexBuffer;
  scene.shape.normalBuffer = normalBuffer;
  scene.shape.indexBuffer = indexBuffer;
  scene.shape.needRender = true;
  scene.shape.needUpdate = false;
}

function render(gl, scene) {
  if (!scene.shape.root) { return; }

  gl.bindBuffer(gl.ARRAY_BUFFER, scene.shape.vertexBuffer);
  gl.vertexAttribPointer(scene.shape.attributes[0].location, scene.shape.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ARRAY_BUFFER, scene.shape.normalBuffer);
  gl.vertexAttribPointer(scene.shape.attributes[1].location, scene.shape.itemSize, gl.FLOAT, false, 0, 0);

  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, scene.shape.indexBuffer);

  var modelView = buildModelView(
    mat4.create(),
    scene.camera.position,
    scene.camera.rotation,
    scene.camera.scale
  );
  var normalMatrix = buildNormalMatrix(mat3.create(), modelView);

  gl.uniformMatrix4fv(scene.shape.uniforms[0].location, false, scene.projection);
  gl.uniformMatrix4fv(scene.shape.uniforms[1].location, false, modelView);
  gl.uniformMatrix3fv(scene.shape.uniforms[2].location, false, normalMatrix);
  gl.uniform3fv(scene.shape.uniforms[3].location, scene.ambiantColor);
  gl.uniform3fv(scene.shape.uniforms[4].location, scene.lightPosition);
  gl.uniform3fv(scene.shape.uniforms[5].location, scene.lightColor);

  gl.drawElements(gl.TRIANGLES, scene.shape.itemNbr, gl.UNSIGNED_SHORT, 0);
}

function buildModelView(modelView, position, rotation, scale) {
  mat4.identity(modelView);
  mat4.translate(modelView, modelView, position);
  mat4.rotateZ(modelView, modelView, rotation[2]);
  mat4.rotateX(modelView, modelView, rotation[0]);
  mat4.rotateY(modelView, modelView, rotation[1]);
  mat4.scale(modelView, modelView, scale);
  return modelView;
}

function buildNormalMatrix(normalMatrix, modelView) {
  mat3.fromMat4(normalMatrix, modelView);
  mat3.invert(normalMatrix, normalMatrix);
  mat3.transpose(normalMatrix, normalMatrix);
  return normalMatrix;
}

module.exports = {
  init: init,
  update: update,
  render: render,
  setTree: setTree
};
