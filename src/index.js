var Loader = require('./loader'),
    Renderer = require('./renderer'),
    Q = require('q');

var loader = new Loader();

Q.all([
  loader.load('box', 'mesh/box.obj'),
  loader.load('box2', 'mesh/box.obj')
]).then(function () {
  return loader.getMeshes();
}).then(function (meshes) {
  var renderer = new Renderer(meshes);
  
  renderer.render();
})
.catch(function (err) {
  console.error(err);
});
