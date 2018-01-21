#define HUGE 9E16
#define PI 3.14159265
#define V vec3(0.,1.,-1.)
#define saturate(i) clamp(i,0.,1.)
#define lofi(i,m) (floor((i)/(m))*(m))

// ------

attribute vec3 vuv;

varying vec3 vPos;
varying float vLife;

uniform vec2 resolution;
uniform vec2 resolutionPcompute;
uniform vec3 cameraPos;
uniform float cameraRot;
uniform float cameraFov;
uniform float vertsPerParticle;
uniform mat4 matP;
uniform mat4 matV;

uniform sampler2D texturePcompute;

// ------

void main() {
  vec2 puv = ( vuv.xy + 0.5 ) / resolutionPcompute;
  vec2 dppix = vec2( 1.0 ) / resolutionPcompute; 

  vec4 pos = texture2D( texturePcompute, puv );
  vec4 vel = texture2D( texturePcompute, puv + dppix * V.yx );

  vPos = pos.xyz;
  vLife = pos.w;

  vec4 outPos = matP * matV * vec4( pos.xyz, 1.0 );
  gl_PointSize = resolution.y / 20.0 * sin( PI * pos.w ) * ( 0.5 + 0.5 * vel.w ) / outPos.z;
  gl_Position = outPos;
}