
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;

attribute vec3 a_position;
attribute vec3 a_normal;

varying vec4 v_position;
varying vec3 v_transformed_normal;

void main() {
  v_transformed_normal = u_normalMatrix * a_normal;
  v_position = u_modelView * vec4(a_position, 1.0);

  gl_Position = u_projection * v_position;
}
