var c = require('./const'),
    vec3 = require('gl-matrix').vec3;

function Obj(options) {
  options = options || {};
  
  this.mesh = options.mesh || 'box';
  this.position = options.position || vec3.fromValues(0, 0, 0);
  this.sizeType = options.sizeType || c.RELATIVE;
  this.size = options.size || vec3.fromValues(1, 1, 1);
  this.faces = {
    FRONT: [],
    BACK: [],
    LEFT: [],
    RIGHT: [],
    TOP: [],
    BOTTOM: []
  };
}

Obj.prototype.addGrid = function (face, grid) {
  this.faces[face].push(grid);
};

Obj.prototype.computeModelView = function (parentSize, parentPosition) {
  
};

Obj.prototype.align = function (face) {
  
};



module.exports = Obj;