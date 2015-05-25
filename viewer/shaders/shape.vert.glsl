
uniform mat4 u_projection;
uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;
uniform vec3 u_lightDirection;

attribute vec3 a_position;
attribute vec3 a_normal;
attribute vec3 a_barycentric;

varying vec3 v_lightWeight;
varying vec3 v_barycentric;

void main() {
  v_barycentric = a_barycentric;
  gl_Position = u_projection * u_modelView * vec4(a_position, 1.0);
  
  vec3 directionalColor = vec3(1, 1, 1);
  vec3 ambiantColor = vec3(193.0 / 255.0, 239.0 / 255.0, 75.0 / 255.0);

  vec3 transformedNormal = u_normalMatrix * a_normal;
  float directionalLightWeight = max(dot(transformedNormal, u_lightDirection), 0.0);
  v_lightWeight = ambiantColor + directionalColor * ((directionalLightWeight * directionalLightWeight) / 2.0);
}
