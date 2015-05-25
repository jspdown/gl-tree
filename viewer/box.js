var Geometry = require('./geometry'),
    vec3 = require('gl-matrix').vec3,
    mat4 = require('gl-matrix').mat4;

var s_faces = {
  FRONT: 0,
  BACK: 1,
  LEFT: 2,
  RIGHT: 3,
  TOP: 4,
  BOTTOM: 5
};

/**
 * row data of a cube
 */
 
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
 * get vertices
 * get vertices and compute its size
 */
function getS_Vertices(size) {
  var x = size[0],
      y = size[1],
      z = size[2];
      
  return [
    [0, 0, 0],  [x, 0, 0],  [0, y, 0],  [x, y, 0], // FRONT
    [0, 0, z],  [x, 0, z],  [0, y, z],  [x, y, z], // BACK
    [0, 0, 0],  [0, 0, z],  [0, y, 0],  [0, y, z], // LEFT
    [x, 0, 0],  [x, 0, z],  [x, y, 0],  [x, y, z], // RIGHT
    [0, 0, 0],  [x, 0, 0],  [0, 0, z],  [x, 0, z], // TOP
    [0, y, 0],  [x, y, 0],  [0, y, z],  [x, y, z]  // BOTTOM
  ];
}


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

/**
 * get translation to set vertices in a correct position
 * following the face on which we attach the new box we have to
 * translate their positions by those calculated here
 * face (s_faces): the face on which we are
 * scale (vec3): computed scale of the box we are attaching to
 * return: a transformation matrix (mat4) that represent the translation
 */
function getFaceOffset(face, parentSize, childSize) {
  if (!face) {
    return vec3.fromValues(0, 0, 0);
  }
  var offset = vec3.fromValues(
    s_normals[face * 3 * 4    ] * (face % 2 == 0 ? -childSize[0] : parentSize[0]),
    s_normals[face * 3 * 4 + 1] * (face % 2 == 0 ? -childSize[1] : parentSize[1]),
    s_normals[face * 3 * 4 + 2] * (face % 2 == 0 ? -childSize[2] : parentSize[2])    
  );

  return offset;
}

/**
 * get vertices of the given node
 * node (box): box
 * position (vec3) computed parent position
 * scale (vec3) computed parent scale
 * return: array of flatten vertices
 */
function getVertices(node, face, position, parentScale, childScale, s_vertices) {
  var transform = mat4.create(),
      vertex = vec3.create(),
      offset = getFaceOffset(face, parentScale, childScale),
      vertices = []; 
  
  mat4.identity(transform);
  mat4.translate(transform, transform, offset);
  mat4.translate(transform, transform, position);
  
  for (var v = 0; v < s_vertices.length; v++) {
    vec3.copy(vertex, s_vertices[v]);
    vec3.transformMat4(vertex, vertex, transform);
    
    vertices[v * 3    ] = vertex[0];
    vertices[v * 3 + 1] = vertex[1];
    vertices[v * 3 + 2] = vertex[2];
  }
  return vertices;
}

/**
 * get barycentric coords
 * return array of flatten barycentric coords
 */
function getBarycentric(s_vertices) {
  var barycentric = [];
  for (var i = 0; i < s_vertices.length; i++) {
    if (i % 3 == 0) {
      barycentric[i * 3    ] = 1;
      barycentric[i * 3 + 1] = 0;
      barycentric[i * 3 + 2] = 0; 
    } else if (i % 3 == 1) {
      barycentric[i * 3    ] = 0;
      barycentric[i * 3 + 1] = 1;
      barycentric[i * 3 + 2] = 0; 
    } else {
      barycentric[i * 3    ] = 0;
      barycentric[i * 3 + 1] = 0;
      barycentric[i * 3 + 2] = 1;
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
 * flatten
 * root: box root element
 * position: computed parent position
 * scale: computed parent scale
 * return: 
 *  - vertices: flat vertices
 *  - normals: flat normals
 *  - indexes: flat indexes 
 */
 /**
  * TODO:
  * - translate child following the face
  * - translate after scale of the half
  */
function flatten(root, position, scale, currentIndex, parentFace) {
  
  position = position || vec3.fromValues(0, 0, 0);
  scale = scale || vec3.fromValues(1, 1, 1);
  currentIndex = currentIndex || 0;
  console.log('FLATTEN\ncurrentIndex = ', currentIndex, 
  '\nparentFace = ', parentFace,
  '\nparent scale = ', scale, 
  '\nnode scale = ', root.scale);
  var rootPosition = vec3.create(),
      rootScale = vec3.create();  
  
  console.log(root);
  vec3.add(rootPosition, position, root.position);
  vec3.mul(rootScale, scale, root.scale);
  
  var s_vertices = getS_Vertices(rootScale);
  
  var vertices = getVertices(root, parentFace, rootPosition, scale, rootScale, s_vertices),
      normals = getNormals(),
      indexes = getIndexes(currentIndex),
      barycentric = getBarycentric(s_vertices),
      tmp;
  
  currentIndex += s_vertices.length;
  
  for (var f = 0; f < 6; f++) {
    for (var c = 0; c < root.faces[f].length; c++) {
      tmp = flatten(root.faces[f][c], rootPosition, rootScale, currentIndex, f);
      vertices = vertices.concat(tmp.vertices);
      normals = normals.concat(tmp.normals);
      indexes = indexes.concat(tmp.indexes);
      barycentric = barycentric.concat(tmp.barycentric);
    }
  }
  return {
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