
var mat4 = require('gl-matrix').mat4;

function createShader(gl, shaderType, source) {
  var shader = gl.createShader(shaderType);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error('COMPILE ERROR:' + gl.getShaderInfoLog(shader));
  }
  return shader;
}

function createProgram(gl, vertexSource, fragmentSource, uniforms, attributes) {
  var program = gl.createProgram();
  
  gl.attachShader(program, createShader(gl, gl.VERTEX_SHADER, vertexSource));
  gl.attachShader(program, createShader(gl, gl.FRAGMENT_SHADER, fragmentSource));
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error('LINK ERROR:' + gl.getProgramInfoLog(program));
  }  
  for (var a = 0, al = attributes.length; a < al; a++) {
    attributes[a].location = gl.getAttribLocation(program, attributes[a].name);
    gl.enableVertexAttribArray(attributes[a].location);
  }
  for (var u = 0, ul = uniforms.length; u < ul; u++) {
    uniforms[u].location = gl.getUniformLocation(program, uniforms[u].name);
  }

  return program;
}

function hexToRgb(hex) {
  var rs = hex.substr(1, 2),
      gs = hex.substr(3, 2),
      bs = hex.substr(5, 2);

  return {
    r: parseInt(rs, 16) / 255,
    g: parseInt(gs, 16) / 255,
    b: parseInt(bs, 16) / 255
  };
}

function degToRad(deg) {
  return deg * Math.PI / 180; 
}

function radToDeg(rad) {
  return 180 * rad / Math.PI; 
}


module.exports = {
  degToRad: degToRad,
  radToDeg: radToDeg,
  hexToRgb: hexToRgb,
  createProgram: createProgram
};