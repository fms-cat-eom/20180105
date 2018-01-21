precision highp float;

uniform vec2 resolution;
uniform sampler2D samplerDry;
uniform sampler2D samplerWet;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec3 dry = texture2D( samplerDry, uv ).xyz;
  vec3 wet = texture2D( samplerWet, uv ).xyz;
  gl_FragColor.xyz = (
    dry +
    max( vec3( 0.0 ), wet / 4.0 - 0.2 )
  );
  gl_FragColor.w = 1.0;
}
