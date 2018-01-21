#define HUGE 9E16
#define EPS 5E-3
#define PI 3.14159265
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,m) (floor((i)/(m))*(m))

// ------

#extension GL_EXT_draw_buffers : require
precision highp float;

varying vec2 vUv;
varying vec3 vPos;

uniform vec4 color;
uniform vec4 bgColor;
uniform vec3 cameraPos;
uniform vec3 cameraNear;
uniform vec3 cameraFar;
uniform sampler2D sampler0;
uniform float phase;

// ------

void main() {
  vec2 uv = vec2( 0.0, 1.0 ) + vec2( 1.0, -1.0 ) * vUv;
  float scan = uv.y - ( 1.0 - phase );
  if ( scan < 0.0 ) { discard; }

  vec4 tex = texture2D( sampler0, uv );
  float delta = (
    length(
      texture2D( sampler0, uv + vec2( EPS, 0.0 ) ) -
      texture2D( sampler0, uv - vec2( EPS, 0.0 ) )
    ) + length(
      texture2D( sampler0, uv + vec2( 0.0, EPS ) ) -
      texture2D( sampler0, uv - vec2( 0.0, EPS ) )
    )
  );
  float amp = 2.5 * smoothstep( 0.2, 0.5, delta );
  amp += 24.0 * ( amp + 0.1 * tex.w ) * exp( -40.0 * scan );
  if ( amp == 0.0 ) { discard; }

  vec3 col = amp * color.xyz;
  // col += 0.1 * mix( tex.xyz, vec3( 0.0 ), saturate( amp ) );

  float depth = length( vPos - cameraPos );

  gl_FragData[ 0 ] = vec4( col, 1.0 );
  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );
}