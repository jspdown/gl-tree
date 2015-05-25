
var utils = require('./utils'),
    Renderer = require('./renderer'),
    config = require('./config'),
    $ = require('jquery'),
    webglContext = require('webgl-context');
    
$(document).ready(function () {

  var canvas = $(config.canvasElement),
      width = canvas.parent().width(),
      height = 600;

  var gl = webglContext({
    canvas: canvas.get(0),
    width: width,
    height: height,
    antialias: true
  });
  
  var renderer = new Renderer(gl, { 
    fps: config.fps,
    size: { x: width, y: height },
    alpha: false
  });
  renderer.run();
  
});


