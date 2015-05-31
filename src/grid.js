var c = require('./const'),
    vec3 = require('gl-matrix').vec3,
    mat4 = require('gl-matrix').mat4;

function Grid(row, col) {
  this.row = row;
  this.col = col;
  this._grid = [];
}

Grid.prototype.attach = function (x, y, obj, face) {
  this._grid.push({
    x: x,
    y: y,
    obj: obj,
    face: face
  });
};

/**
 * Generate rotation matrix
 * rotation angle to align face to face:
 * angle = acos(-fn1.fn2)
 * - face (string): face name 
 */
Grid.prototype.generateRotationMatrix = function (i, onFace) {
  var parentFaceNormal = c.normals[onFace],
      rotation, childFaceNormal, angle;
        
  childFaceNormal = c.normals[this._grid[i].face];
  angle = Math.acos(-vec3.dot(parentFaceNormal, childFaceNormal));
  
  rotation = mat4.create();
  mat4.identity(rotation);
  if (parentFaceNormal[1] === 0.0 && childFaceNormal[1] === 0.0) {
    mat4.rotationY(rotation, rotation, angle);
  } else if (parentFaceNormal[2] === 0.0 && childFaceNormal[2] === 0.0) {
    mat4.rotationZ(rotation, rotation, angle);      
  } else {
    mat4.rotationX(rotation, rotation, angle);
  }
  return rotation;
};

/**
 * Generate translation matrix
 * - onFace (string): face
 * - parentSize (vec3): computed parent size of this grid
 */
Grid.prototype.generateTranslationMatrix = function (onFace, parentSize, parentTranslation) {
  var translation = mat4.create(),
      parentFaceNormal = vec3.create();

  vec3.mul(parentFaceNormal, c.normals[onFace], parentSize);  
  mat4.translate(translation, translation, parentFaceNormal);
  return translation;
};

/**
 * Generate rotation and translation matrix
 */
Grid.prototype.generateMatrix = function (onFace, parentSize, parentTranslation) {
  var translation = this.generateTranslationMatrix(onFace, parentSize, parentTranslation),
      rotation;
  
  for (var i = 0; i < this._grid.length; i++) {
    rotation = this.generateRotationMatrix(i, onFace);
    this._grid[i].obj.generateMatrix(translation, rotation);
  }
}

Grid.prototype.flatten = function () {
  
};

module.exports = Grid;