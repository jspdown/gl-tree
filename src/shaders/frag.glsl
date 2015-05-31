precision highp float;

uniform vec3 u_ambiant_color;
uniform vec3 u_light_position;
uniform vec3 u_light_color;

varying vec4 v_position;

void main() {
  gl_FragColor = vec4(u_ambiant_color, 1.0);
}