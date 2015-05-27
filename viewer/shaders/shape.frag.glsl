precision highp float;

uniform mat3 u_normalMatrix;
uniform vec3 u_ambiant_color;
uniform vec3 u_point_lighting_location;
uniform vec3 u_point_lighting_color;

varying vec3 v_transformed_normal;
varying vec4 v_position;
varying vec3 v_barycentric;

void main() {  
  vec3 transformed_point_lighting_location = u_normalMatrix * u_point_lighting_location;
  vec3 light_weighting;
  vec3 light_direction = normalize(transformed_point_lighting_location - v_position.xyz);
  
  float directional_light_weighting = max(dot(normalize(v_transformed_normal), light_direction), 0.0);
  light_weighting = u_ambiant_color + u_point_lighting_color * directional_light_weighting;
  
  gl_FragColor = vec4(vec3(1.0, 1.0, 1.0) * light_weighting, 1.0);
}