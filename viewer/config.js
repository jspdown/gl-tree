
var vec3 = require('gl-matrix').vec3,
    utils = require('./utils');

module.exports = {
  camera: {
    fov: utils.degToRad(45),
    far: 100,
    near: 0.5,
    position: vec3.fromValues(-0.5, -0.0, -7),
    rotation: vec3.fromValues(Math.PI / 6, 0, 0),
    scale: vec3.fromValues(1, 1, 1)
  },
  rotationSpeed: Math.PI / 500,
  canvasElement: '#animation',
  fps: 60,
  cubes: {
    x: 30,
    y: 10
  },
  lightDirection: vec3.fromValues(0, 2, 5)
};