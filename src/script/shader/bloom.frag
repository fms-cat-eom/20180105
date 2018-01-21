#define V vec2(0.,1.)
#define saturate(i) clamp(i,0.,1.)
#define PI 3.14159265
#define SAMPLES 40

// ------

precision highp float;

uniform vec2 resolution;
uniform bool isVert;
uniform sampler2D sampler0;
uniform sampler2D samplerDry;

uniform float gaussVar;

float gaussian( float _x, float _v ) {
  return 1.0 / sqrt( 2.0 * PI * _v ) * exp( - _x * _x / 2.0 / _v );
}

void main() {
  vec2 uv = gl_FragCoord.xy / resolution;
  vec2 bv = ( isVert ? vec2( 0.0, 1.0 ) : vec2( 1.0, 0.0 ) ) / resolution;

  vec3 sum = V.xxx;
  for ( int i = -SAMPLES; i <= SAMPLES; i ++ ) {
    vec2 v = saturate( uv + bv * float( i ) );
    vec3 tex = texture2D( sampler0, v ).xyz;
    float mul = gaussian( abs( float( i ) ), gaussVar );
    sum += tex * mul;
  }

  gl_FragColor = vec4( sum, 1.0 );
}
