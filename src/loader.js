
var fs = require('fs')

function Loader() {
  
}

Loader.prototype.load = function (path) {
  var _this = this;
  
  var obj = {
    vertices: [],
    normals: [],
    vertexIndex: [],
    normalIndex: []
  };
  
  fs.readFileSync(path, 'utf8')
  .split('\n')
  .forEach(function (line) {
    _this._parseLine(obj, line);
  });
  return obj;
};

Loader.prototype._parseLine = function (obj, line) {
  var elems = line.split(' ');
  
  switch (elems[0]) {
    case 'v':   this._parseVertex(obj, elems.slice(1));
    break;
    case 'vn':  this._getNormal(obj, elems.slice(1));
    break;
    case 'f':   this._getFace(obj, elems.slice(1));
    break;
  }
};

Loader.prototype._flatten = function () {
  console.log('flatten');
};

Loader.prototype._parseVertex = function (obj, elems) {
  obj.vertices.push(elems.map(parseInt));
};

Loader.prototype._parseNormal = function (obj, elems) {
  obj.normals.push(elems.map(parseInt));
};

Loader.prototype._parseFace = function (obj, elems) {
  var vertex = [],
      normal = [];
      
  elems.forEach(function (elem) {
    var e = elem.split('/');
    vertex.push(parseInt(e[0]));
    normal.push(parseInt(e[2]));
  }); 
  obj.vertexIndex.push(vertex);
  obj.normalIndex.push(vertex);
};

module.exports = Loader;