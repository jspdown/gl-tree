var Geometry = require('./geometry'),
    vec3 = require('./gl-matrix').vec3,
    mat4 = require('./gl-matrix').mat4;

var s_faces = {
  FRONT: 0,
  BACK: 1,
  LEFT: 2,
  RIGHT: 3,
  TOP: 4,
  BOTTOM: 5
};

var s_vertices = [
  [0, 0, 0],  [1, 0, 0],  [0, 1, 0],  [1, 1, 0], // FRONT
  [0, 0, 1],  [1, 0, 1],  [0, 1, 1],  [1, 1, 1], // BACK
  [0, 0, 0],  [0, 0, 1],  [0, 1, 0],  [0, 1, 1], // LEFT
  [1, 0, 0],  [1, 0, 1],  [1, 1, 0],  [1, 1, 1], // RIGHT
  [0, 0, 0],  [1, 0, 0],  [0, 0, 1],  [1, 0, 1], // TOP
  [0, 1, 0],  [1, 1, 0],  [0, 1, 1],  [1, 1, 1]  // BOTTOM
];

var s_normals = [
  0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
  0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,
  -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
  1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0, 
  0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,
  0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0 
];

var s_indexes = [
  0, 1, 2,      2, 3, 1,
  4, 5, 6,      6, 7, 5,
  8, 9, 10,     10, 11, 9,
  12, 13, 14,   14, 15, 13,
  16, 17, 18,   18, 19, 17,
  20, 21, 22,   22, 23, 21
];

/**
 * create a box object
 * position (vec3): parent relative position
 * scale (vec3): box size 
 * return: vec3 box
 */
function create(position, scale) {
  return {
    position: position,
    scale: scale,
    faces: [
      [], // FRONT
      [], // BACK
      [], // LEFT
      [], // RIGHT
      [], // TOP
      []  // BOTTOM
    ]
  }; 
}

function getVertices(node, position, scale) {
  var transform = mat4.create(); 
  
  mat4.indentity(transform);
  mat4.translate(transform, transform, position);
  mat4.scale(transform, transform, scale);
  
  
  for (var v = 0; v < s_vertices.length; v++) {
      
  }
}

function getNormals() {
  return s_normals;  
}

function getIndexes(root, currentIndex) {
  return s_indexes.map(function (index) {
    return index + currentIndex;
  });
}

/**
 * flatten
 * root: box root element
 * position: computed parent position
 * scale: computed parent scale
 * return: 
 *  - vertices: flat vertices
 *  - normals: flat normals
 *  - indexes: flat indexes 
 */
function flatten(root, position, scale, currentIndex) {
  position = position || vec3(0, 0, 0);
  scale = scale || vec3(1, 1, 1);
  currentIndex = currentIndex || 0;
  
  var rootPosition = vec3.create(),
      rootScale = vec3.create();  

  vec3.mul(rootPosition, position, root.position);
  vec3.add(rootScale, scale, root.scale);
  
  /**
   * TODO:
   * getVertices
   * getNormals √
   * getIndexes √
   */
  var vertices = getVertices(root, rootPosition, rootScale),
      normals = getNormals(root),
      indexes = getIndexes(root, currentIndex),
      tmp;
  
  currentIndex += s_indexes.length;
  
  for (var f = 0; f < 6; f++) {
    for (var c = 0; c < root.faces[f].length; c++) {
      tmp = flatten(root.faces[f][c], rootPosition, rootScale, currentIndex);
      vertices.concat(tmp.vertices);
      normals.concat(tmp.normals);
      indexes.concat(tmp.indexes);
    }
  }
  return {
    vertices: vertices,
    normals: normals,
    indexes: indexes
  };
}

/**
 * add a child to the given box
 * box (box): box node
 * face (int): face id
 * childBox (box): child box to add in
 */
function addChild(box, face, childBox) {
  box.faces[face].push(childBox);
} 


module.exports = {
  create: create,
  flatten: flatten,
  addChild: addChild
};