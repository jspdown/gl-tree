var c = require('./const'),
    vec3 = require('gl-matrix').vec3,
    mat4 = require('gl-matrix').mat4;


function Obj(options) {
  options = options || {};
  
  this.mesh = options.mesh || 'box';
  this.scale = options.scale || vec3.fromValues(1, 1, 1);
  this.faces = {
    FRONT: [],
    BACK: [],
    LEFT: [],
    RIGHT: [],
    TOP: [],
    BOTTOM: []
  };
  this.computed = {};
}

Obj.prototype.addGrid = function (face, grid) {
  this.faces[face].push(grid);
};


/**
 * Compute size
 * Compute reel size by aplying scale to original size given
 */
Obj.prototype.computeSize = function (meshSize) {
  this.computed.size = vec3.fromValues(
    this.scale[0] * meshSize[0],
    this.scale[2] * meshSize[1],
    this.scale[1] * meshSize[2]
  );
};

/**
 * Set rotation matrix
 * - matrix (mat4): the rotation matrix
 */
Obj.prototype.setRotationMatrix = function (matrix) {
  this.computed.rotationMatrix = matrix;
};

/**
 * Compute scale matrix
 * scale the current mesh to the one given in this.scale
 */
Obj.prototype.computeScaleMatrix = function () {
  var scale = mat4.create();
  
  mat4.scale(scale, scale, this.scale);
  this.computed.scaleMatrix = scale;
};

/**
 * Compute translation matrix
 * WIP
 */
Obj.prototype.computeTranslationMatrix = function (gridTranslation) { 
  var localOrigin = [
    this.computed.size[0] / 2,
    this.computed.size[1] / 2,
    this.computed.size[2] / 2
  ]
  
  var translation = vec3.clone(gridTranslation);
  
  vec3.translate(translation, translation, localOrigin);
  vec3.translate(translation, translation, position);   
  this.computed.translationMatrix = translation;
  
};


Obj.prototype.generateMatrix = function () {
};

Obj.prototype.flatten = function () {
};


module.exports = Obj;