precision highp float;

varying vec3 v_lightWeight;
varying vec3 v_barycentric;

void main() {
  if (any(lessThan(v_barycentric, vec3(0.01)))) {
    gl_FragColor = vec4(0, 0, 0, 1);
  } else { 
    gl_FragColor = vec4(v_lightWeight, 1);
  }
}

