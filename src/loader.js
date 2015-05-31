var request = require('superagent'),
    Q = require('q');

function Loader() {
  this.loaded = {};
}

Loader.prototype.load = function (name, path) {
  var _this = this,
      deferred = Q.defer();
 
  var obj = {
    vertices: [],
    normals: [],
    vertexIndex: [],
    normalIndex: []
  };
  
  this._readFile(path, function (err, lines) {
    if (!err) {
      lines.forEach(function (line) {
        _this._parseLine(obj, line);
      });
      _this.loaded[name] = obj;
      deferred.resolve(obj);
    } else {
      deferred.reject(err);
    }
  });
  
  return deferred.promise;
};

Loader.prototype.getMeshes = function () {
  return this.loaded;
};

Loader.prototype._readFile = function (path, callback) {
  request(path, function (err, data) {
    if (!err && data) { 
      callback(null, data.text.split('\n'));
    } else {
      callback(err, null);
    }
  });
};

Loader.prototype._parseLine = function (obj, line) {
  var elems = line.split(' ');
  
  switch (elems[0]) {
    case 'v':   this._parseVertex(obj, elems.slice(1));
    break;
    case 'vn':  this._parseNormal(obj, elems.slice(1));
    break;
    case 'f':   this._parseFace(obj, elems.slice(1));
    break;
  }
};

Loader.prototype._parseVertex = function (obj, elems) {
  obj.vertices.push(parseFloat(elems[0]));
  obj.vertices.push(parseFloat(elems[1]));
  obj.vertices.push(parseFloat(elems[2]));
};

Loader.prototype._parseNormal = function (obj, elems) {
  obj.normals.push(parseFloat(elems[0]));
  obj.normals.push(parseFloat(elems[1]));
  obj.normals.push(parseFloat(elems[2]));
};

Loader.prototype._parseFace = function (obj, elems) {
  elems.forEach(function (elem) {
    var e = elem.split('/');
    obj.vertexIndex.push(parseInt(e[0]));
    obj.normalIndex.push(parseInt(e[2]));
  });
};

module.exports = Loader;