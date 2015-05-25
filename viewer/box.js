var Geometry = require('./geometry'),
    vec3 = require('./gl-matrix').vec3;

var faces = {
  FRONT: 0,
  BACK: 1,
  LEFT: 2,
  RIGHT: 3,
  TOP: 4,
  BOTTOM: 5
};

var vertices = [
  [0, 0, 0],  [1, 0, 0],  [0, 1, 0],  [1, 1, 0], // FRONT
  [0, 0, 1],  [1, 0, 1],  [0, 1, 1],  [1, 1, 1], // BACK
  [0, 0, 0],  [0, 0, 1],  [0, 1, 0],  [0, 1, 1], // LEFT
  [1, 0, 0],  [1, 0, 1],  [1, 1, 0],  [1, 1, 1], // RIGHT
  [0, 0, 0],  [1, 0, 0],  [0, 0, 1],  [1, 0, 1], // TOP
  [0, 1, 0],  [1, 1, 0],  [0, 1, 1],  [1, 1, 1]  // BOTTOM
];

var normals = [
  [0, 0, -1],   [0, 0, -1],   [0, 0, -1],   [0, 0, -1],
  [0, 0, 1],    [0, 0, 1],    [0, 0, 1],    [0, 0, 1],
  [-1, 0, 0],   [-1, 0, 0],   [-1, 0, 0],   [-1, 0, 0],
  [1, 0, 0],    [1, 0, 0],    [1, 0, 0],    [1, 0, 0], 
  [0, -1, 0],   [0, -1, 0],   [0, -1, 0],   [0, -1, 0],
  [0, 1, 0],    [0, 1, 0],    [0, 1, 0],    [0, 1, 0] 
];

var indexes = [
  [0, 1, 2],      [2, 3, 1],
  [4, 5, 6],      [6, 7, 5],
  [8, 9, 10],     [10, 11, 9],
  [12, 13, 14],   [14, 15, 13],
  [16, 17, 18],   [18, 19, 17],
  [20, 21, 22],   [22, 23, 21]
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

/**
 * add a child to the given box
 * box (box): box node
 * face (int): face id
 * childBox (box): child box to add in
 */
function addChild(box, face, childBox) {
  box.faces[face].push(childBox);
} 

function extrude(box, face, length, x, y, w, h) {
  var px, py, pz,
      sx, sy, sz;
      
  if (normals[face * 4][0] != 0) {
    px = x; py = y; pz = box.scale.z;
    sx = w, sy = h, sz = normals[face * 4][0] * length;
  } else if (normals[face * 4][1] != 0) {
    
  } else if (normals[face * 4][2] != 0) {
    
  }
  
  var px = normals[face * 4][0] != 0 ? length * normals[face * 4][0] : x,
      py = normals[face * 4][1] != 0 ? length * normals[face * 4][1] : y,
      pz = normals[face * 4][2] != 0 ? length * normals[face * 4][2] : z,  
  
  var sx = 0,
      sy = 0,
      sz = 0;
      
  var child = create(
    vec3.fromValue(px, py, pz), 
    vec3.fromValue(sx, sy, sz)
  );
  
  box.faces[face].push(child);
}

module.exports = {
  create: create,
  addChild: addChild,
  faces: faces,
  extrude: extrude,
  geometry: new Geometry(vertices, indexes, normals) 
};