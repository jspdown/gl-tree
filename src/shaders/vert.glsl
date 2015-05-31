
uniform mat4 u_projection;

attribute vec3 a_position;
attribute mat4 a_model_view;
attribute vec3 a_normal;

varying vec4 v_position;
varying vec3 v_normal;

void main() {
  v_normal = a_normal;
  v_position = a_model_view * vec4(a_position, 1.0);
  gl_Position = u_projection * v_position;
}

