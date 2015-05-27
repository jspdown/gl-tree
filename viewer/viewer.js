
var utils = require('./utils'),
    Renderer = require('./renderer'),
    config = require('./config'),
    $ = require('jquery'),
    webglContext = require('webgl-context'),
    box = require('./box'),
    shape = require('./shape'),
    vec3 = require('gl-matrix').vec3,
    vec2 = require('gl-matrix').vec2,
    mat4 = require('gl-matrix').mat4;
    
    
    // init editor
    var ace = require('brace');
    require('brace/mode/javascript');
    require('brace/theme/monokai');
    var editor = ace.edit('editor');
    editor.getSession().setUseWorker(false);
    editor.getSession().setMode('ace/mode/javascript');
    editor.setTheme('ace/theme/monokai');
    
    
$(document).ready(function () {
  // get webgl context
  var canvas = $(config.canvasElement),
      width = canvas.parent().width(),
      height = 900,
      gl = webglContext({
        canvas: canvas.get(0),
        width: width,
        height: height,
        antialias: true
      });
  
  
  // create renderer
  var renderer = new Renderer(gl, { 
    fps: config.fps,
    size: { x: width, y: height },
    alpha: false
  });
  renderer.run();
  
  // update shape from a custom script
  function executeCustomScript(customScript) {
    var root;
    eval(customScript);
    shape.setTree(root, renderer.scene);
  }
  
  executeCustomScript(editor.getValue());
  $('#edit button').click(function () {
    console.log('click');
    executeCustomScript(editor.getValue());
  })
});
