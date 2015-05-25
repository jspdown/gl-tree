
function Geometry(vertices, faces, normals) {
  this.vertices = vertices;
  this.faces = faces;
  this.normals = normals;
}

Geometry.prototype.merge = function () {
  return this;
};

Geometry.prototype.updateBarycentric = function () {
  var barycentric = [];
  for (var i = 0; i < this.faces.length; i++) {
    barycentric.push([1, 0, 0]);
    barycentric.push([0, 1, 0]);
    barycentric.push([0, 0, 1]);
  }
  this.barycentric = barycentric;
};

Geometry.prototype.flatten = function () {
  var flattenVertices = [],
      flattenFaces = [],
      flattenNormals = [],
      flattenBarycentric = [],
      i;

  for (i = 0; i < this.vertices.length; i++) {
    flattenVertices[i * 3    ] = this.vertices[i][0];
    flattenVertices[i * 3 + 1] = this.vertices[i][1];
    flattenVertices[i * 3 + 2] = this.vertices[i][2];

    flattenNormals[i * 3    ] = this.normals[i][0];
    flattenNormals[i * 3 + 1] = this.normals[i][1];
    flattenNormals[i * 3 + 2] = this.normals[i][2];    

    flattenBarycentric[i * 3    ] = this.barycentric[i][0];
    flattenBarycentric[i * 3 + 1] = this.barycentric[i][1];
    flattenBarycentric[i * 3 + 2] = this.barycentric[i][2];    

  }
  for (i = 0; i < this.faces.length; i++) {
    flattenFaces[i * 3    ] = this.faces[i][0];
    flattenFaces[i * 3 + 1] = this.faces[i][1];
    flattenFaces[i * 3 + 2] = this.faces[i][2];    
  }

  return {
    vertices: flattenVertices,
    faces: flattenFaces,
    normals: flattenNormals,
    barycentric: flattenBarycentric
  };
};

Geometry.prototype.split = function (a, b, k) {

};

module.exports = Geometry;