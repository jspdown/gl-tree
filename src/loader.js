
var fs = require('fs')

function Loader() {
  
}

Loader.prototype.load = function (path) {
  var _this = this,
      obj = {
    vertices: [],
    normals: [],
    faces: []
  };
  
  fs.readFileSync(path, 'utf8')
  .split('\n')
  .forEach(function (line) {
    _this._parseLine(obj, line);
  });
  return obj;
};

Loader.prototype._parseLine = function (obj, line) {
  var str = line.split(' ');
  
  switch (str[0]) {
    case 'v':
      obj.vertices = obj.vertices.concat(this._getVertex(str.slice(1)));
      break;
    case 'vn':
      obj.normals = obj.normals.concat(this._getNormal(str.slice(1)));
      break;
    case 'f':
      obj.faces = obj.faces.concat(this._getFace(str.slice(1)));
      break;
  }
};

Loader.prototype._getVertex = function (elems) {
  return elems.map(parseInt);
};
Loader.prototype._getNormal = Loader.prototype._getVertex;

Loader.prototype._getFace = function (elems) {
  return elems.map(function (elem) {
    var indexes = elem.split('/');
    return {
      vertex: parseInt(indexes[0]),
      normal: parseInt(indexes[2])
    };
  });
};

module.exports = Loader;