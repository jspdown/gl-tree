var vec3 = require('gl-matrix').vec3;

module.exports = {
  domElement: '#animation',
  fps: 2,
  height: 800,
  camera: {
    position: vec3.fromValues(0, 0, 0),
    rotation: vec3.fromValues(0, 0, 0)
  },
  lights: {
    ambiant: vec3.fromValues(0.8, 0.2, 0.1),
    position: vec3.fromValues(0, 0, 0),
    color: vec3.fromValues(1, 1, 1)
  }
};