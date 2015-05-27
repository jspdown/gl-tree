var vec3 = require('gl-matrix').vec3,
    mat4 = require('gl-matrix').mat4;

var s_faces_numItem = 6;
var s_faces = {
  FRONT: 0,
  BACK: 1,
  LEFT: 2,
  RIGHT: 3,
  TOP: 4,
  BOTTOM: 5
};

/**
 * row data of a box
 */

var s_normals_numItem = 24;
var s_normals_sizeItem = 3;  

var s_normals = [
  0, 0, -1,   0, 0, -1,   0, 0, -1,   0, 0, -1,
  0, 0, 1,    0, 0, 1,    0, 0, 1,    0, 0, 1,
  -1, 0, 0,   -1, 0, 0,   -1, 0, 0,   -1, 0, 0,
  1, 0, 0,    1, 0, 0,    1, 0, 0,    1, 0, 0, 
  0, -1, 0,   0, -1, 0,   0, -1, 0,   0, -1, 0,
  0, 1, 0,    0, 1, 0,    0, 1, 0,    0, 1, 0 
];

var s_indexes_numItem = 12;
var s_indexes_sizeItem = 3;  

var s_indexes = [
  0, 1, 2,      2, 3, 1,
  4, 5, 6,      6, 7, 5,
  8, 9, 10,     10, 11, 9,
  12, 13, 14,   14, 15, 13,
  16, 17, 18,   18, 19, 17,
  20, 21, 22,   22, 23, 21
];

var s_vertices_numItem = 24;
var s_vertices_sizeItem = 3;  

var s_vertices = [
  [0, 0, 0],  [1, 0, 0],  [0, 1, 0],  [1, 1, 0], // FRONT
  [0, 0, 1],  [1, 0, 1],  [0, 1, 1],  [1, 1, 1], // BACK
  [0, 0, 0],  [0, 0, 1],  [0, 1, 0],  [0, 1, 1], // LEFT
  [1, 0, 0],  [1, 0, 1],  [1, 1, 0],  [1, 1, 1], // RIGHT
  [0, 0, 0],  [1, 0, 0],  [0, 0, 1],  [1, 0, 1], // TOP
  [0, 1, 0],  [1, 1, 0],  [0, 1, 1],  [1, 1, 1]  // BOTTOM
];

/**
 * create a box object
 * position (vec3): parent relative position
 * scale (vec3): box size 
 * return: box (vec3)
 */
function create(position, scale) {
  return {
    position: position,
    scale: scale,
    tags: [],
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

function getVertices(face, translation, scale) {
  var transform = mat4.create(),
      vertex = vec3.create(),
      vertices = [], 
      v;
  
  mat4.identity(transform);
  mat4.translate(transform, transform, translation);
  
  for (v = 0; v < s_vertices_numItem; v++) {
      vec3.set(vertex, 
        s_vertices[v][0] * scale[0],
        s_vertices[v][1] * scale[1],
        s_vertices[v][2] * scale[2]
      );
      vec3.transformMat4(vertex, vertex, transform);
    	vertices[v * s_vertices_sizeItem    ] = vertex[0];
    	vertices[v * s_vertices_sizeItem + 1] = vertex[1];
    	vertices[v * s_vertices_sizeItem + 2] = vertex[2];
  }
  
  return vertices;
}

/**
 * get barycentric coords
 * return array of flatten barycentric coords
 */
function getBarycentric() {
  var barycentric = [];
  
  for (var i = 0; i < s_vertices_numItem; i++) {
    if (i % 3 == 0) {
      barycentric[i * 3    ] = 1; barycentric[i * 3 + 1] = 0; barycentric[i * 3 + 2] = 0; 
    } else if (i % 3 == 1) {
      barycentric[i * 3    ] = 0; barycentric[i * 3 + 1] = 1; barycentric[i * 3 + 2] = 0; 
    } else {
      barycentric[i * 3    ] = 0; barycentric[i * 3 + 1] = 0; barycentric[i * 3 + 2] = 1;
    }
  }
  return barycentric;
};

/**
 * get normals
 * return: array of flatten normals 
 */
function getNormals() {
  return s_normals;  
}

/**
 * get indexes
 * currentIndex: currentIndex in the
 */
function getIndexes(currentIndex) {
  return s_indexes.map(function (index) {
    return index + currentIndex;
  });
}

/**
 * flatten a node
 * node: 
 * - position unit are relative to parent scale
 * params: 
 * - node (box): the node you want to flatten
 * - parent: {
 *   position (vec3): absolute parent position
 *   scale (vec3): absolute parent scale
 *   onFace (s_faces): parent face where `node` is attached
 *   index (int): nbr of vertices. used for indexing
 * }
 * return: 
 *  - vertices: flatten vertices
 *  - normals: flatten normals
 *  - indexes: flatten indexes
 *  - barycentric: flattenBarycentric
 */

function flatten(node, parent) {
  parent = parent || {};

  var position = parent.position || vec3.fromValues(0, 0, 0),
      scale = parent.scale || vec3.fromValues(1, 1, 1),
      onFace = typeof parent.onFace === 'undefined' ? -1 : parent.onFace,
      index = parent.index || 0;
  
  // Compute absolute node scale
  var nodeScale = vec3.create();
  // compute absolute node scale by multuplying absolute parent scale and parent relative node scale
  vec3.mul(nodeScale, scale, node.scale);
  
  // Compute absolute parent face attached position
  var parentFaceAttachedTranslation = vec3.fromValues(0, 0, 0),
      scaledNormal = vec3.create();
  // add parent position to the translation
  vec3.add(parentFaceAttachedTranslation, parentFaceAttachedTranslation, position);
  // compute parent face attached translation by multiplying face normal by parent scale
  if (onFace != -1) {
    // define k as the scale needed by this normal depending on the parent face
    // modulo 2 is a nice side effect of our face storing structure
    var k = onFace % 2 == 0 ? nodeScale : scale;
    vec3.mul(scaledNormal, k, [
      s_normals[onFace * (s_indexes_numItem)    ],
      s_normals[onFace * (s_indexes_numItem) + 1],
      s_normals[onFace * (s_indexes_numItem) + 2]
    ]);
    vec3.add(parentFaceAttachedTranslation, parentFaceAttachedTranslation, scaledNormal);
  }
  
  // Compute absolute node position 
  var nodeTranslation = vec3.create();
  // compute node translation from its parent relative positions (scale)
  vec3.mul(nodeTranslation, scale, node.position);
  // add parent face attached translation
  vec3.add(nodeTranslation, nodeTranslation, parentFaceAttachedTranslation);
  
  var flat,
      vertices = getVertices(node, nodeTranslation, nodeScale),
      normals = getNormals(),
      indexes = getIndexes(index),
      barycentric = getBarycentric();
  
  
  index += s_vertices_numItem;
  for (var f = 0; f < s_faces_numItem; f++) {
    for (var n = 0; n < node.faces[f].length; n++) {
      flat = flatten(node.faces[f][n], {
        position: nodeTranslation,
        scale: nodeScale,
        onFace: f,
        index: index  
      });
            
      vertices = vertices.concat(flat.vertices);
      normals = normals.concat(flat.normals);
      indexes = indexes.concat(flat.indexes);
      barycentric = barycentric.concat(flat.barycentric);
  	  index = flat.index;
    }
  }
  return {
    index: index,
    vertices: vertices,
    normals: normals,
    indexes: indexes,
    barycentric: barycentric
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
  faces: s_faces,
  create: create,
  flatten: flatten,
  addChild: addChild
};