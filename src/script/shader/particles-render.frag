#define PARTICLE_LIFE_SPEED 2.0

#define HUGE 9E16
#define PI 3.14159265
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,m) (floor((i)/(m))*(m))

// ------

#extension GL_EXT_draw_buffers : require
precision highp float;

varying vec3 vPos;
varying float vLife;
varying vec2 vChar;
varying vec2 vUv;

uniform vec3 color;
uniform vec3 cameraPos;

uniform sampler2D textureWord;

// ------

void main() {
  if ( vLife <= 0.0 ) { discard; }

  float shape = smoothstep( 0.5, 0.4, length( gl_PointCoord.xy - 0.5 ) );
  if ( shape < 0.5 ) { discard; }

  float depth = length( vPos - cameraPos );

  gl_FragData[ 0 ] = vec4( color * sin( PI * vLife ), 1.0 );
  gl_FragData[ 1 ] = vec4( depth, 0.0, 0.0, 1.0 );
}