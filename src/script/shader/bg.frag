#extension GL_EXT_frag_depth : require
#extension GL_EXT_draw_buffers : require
precision highp float;

uniform vec4 bgColor;

// ------

void main() {
  gl_FragData[ 0 ] = bgColor;
  gl_FragData[ 1 ] = vec4( 9E9, 0.0, 0.0, 1.0 );
  gl_FragDepthEXT = 1.0;
}