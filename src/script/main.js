import xorshift from './lib/xorshift';
import GLCat from './lib/glcat';
import CatMath from './lib/catmath';
import Automaton from './lib/automaton.min';
import Path from './lib/glcat-path';
import step from './lib/step';
import Tweak from './lib/tweak';

import octahedron from './octahedron';
import { fail } from 'assert';

const glslify = require( 'glslify' );

// ------

xorshift( 13487134006 );

const clamp = ( _value, _min, _max ) => Math.min( Math.max( _value, _min ), _max );
const saturate = ( _value ) => clamp( _value, 0.0, 1.0 );

// ------

let automaton = new Automaton( {
  gui: divAutomaton,
  data: `
  {"rev":20170418,"length":1,"resolution":1000,"params":{"fillColor":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"jpegLofi":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.7,"value":0.06,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.798311444652908,"value":0.01,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":7.105427357601002e-15,"mode":2,"params":{},"mods":[false,false,false,false]}],"pixelsortThreshold":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]}],"jpegHigh":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.699812382739212,"value":0.3822774578069317,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]}],"どうするよ":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"altColor":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":0,"params":{},"mods":[false,false,false,false]}],"cameraRot":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[false,false,false,false]}],"loadingScaleX":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.375,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.5013477088948787,"value":3.3333333333333393,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.54177897574124,"value":2.142857142857146,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":0,"params":{},"mods":[false,false,false,false]}],"loadingScaleY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.375,"value":1,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.4690026954177898,"value":-0.5952380952380913,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.5390835579514824,"value":-2.499999999999991,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":0.5983827493261457,"value":0,"mode":0,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"blockSize":[{"time":0,"value":8,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":8,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.699812382739212,"value":128,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":64,"mode":0,"params":{},"mods":[false,false,false,false]}],"focus":[{"time":0,"value":45.184023310326175,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":15.612503486709784,"mode":4,"params":{"rate":1000,"damp":1},"mods":[false,false,false,false]},{"time":0.25,"value":42.49425195732287,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":10.512858216828425,"mode":4,"params":{"rate":2000,"damp":1},"mods":[{"velocity":0},false,false,false]},{"time":0.45,"value":42.03241802402827,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":7.4961272303534665,"mode":4,"params":{"rate":2000,"damp":1},"mods":[{"velocity":0},false,false,false]},{"time":0.65,"value":37.547946056960434,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":10,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"charShuffle":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.3427767354596623,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.7,"value":0.4758417038690459,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.800187617260788,"value":0,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"octSize":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":5,"mode":4,"params":{"rate":1000,"damp":1},"mods":[false,false,false,false]}],"morpher":[{"time":0,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.875,"value":1,"mode":4,"params":{"rate":1000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":-0.2,"mode":4,"params":{"rate":3000,"damp":1},"mods":[false,false,false,false]}],"killer":[{"time":0,"value":1.5,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.09615384615384616,"value":1.5,"mode":4,"params":{"rate":2000,"damp":1},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":2000,"damp":1},"mods":[false,false,false,false]}],"octY":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.8038461538461539,"value":7.105427357601002e-15,"mode":5,"params":{"gravity":70,"bounce":0.3},"mods":[false,false,false,false]},{"time":1,"value":-56.14285714285714,"mode":5,"params":{"gravity":2200.064,"bounce":0.3},"mods":[false,false,false,false]}],"cameraX":[{"time":0,"value":-3.15561710512641,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":0.0847828065756202,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":-1.218801046591798,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":-0.5765251527921276,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":-6.521743885496274,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":-8,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":3.22488287569875,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraY":[{"time":0,"value":-1.0390331137454907,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":2.8444638509976965,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":-0.393607129528176,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":-0.7853937257861308,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":4.394546884465176,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":2.9819476092102057,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":2.431182298321543,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraZ":[{"time":0,"value":16.876624220900677,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":15.615890575363611,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":5.10768565089596,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":6.065495468417207,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":4.728736601255578,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":6.788999876271241,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":15.458457079577887,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":13,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTX":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":-0.9181377723695601,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":-1.3799717056641612,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":-0.9073979409871815,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":-6.73151026449705,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":-7.305208728071706,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":2.472956012920335,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTY":[{"time":0,"value":1.9287636091368867,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.249,"value":1.3776565408483261,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":3.8541462050079733,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.449,"value":3.2248828756987495,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0.46781771217789286,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.649,"value":0.21717542458508987,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":0.65,"value":3.0577880173035474,"mode":2,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":4,"params":{"rate":500,"damp":1},"mods":[{"velocity":0},false,false,false]}],"cameraTZ":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseFuji":[{"time":0,"value":0.2956193235435962,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1.5,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseMochi":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.9,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseKadomatsu":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.85,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseHuman":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.25,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.85,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseObjects":[{"time":0,"value":0,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.85,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}],"phaseGay":[{"time":0,"value":0.25,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":0.45,"value":0.25,"mode":1,"params":{},"mods":[false,false,false,false]},{"time":1,"value":1,"mode":1,"params":{},"mods":[false,false,false,false]}]},"gui":{"snap":{"enable":false,"bpm":"60","offset":"0"}}}
`
} );
let auto = automaton.auto;

// ------

let width = 640;
let height = 640;
canvas.width = width;
canvas.height = height;

let gl = canvas.getContext( 'webgl' );
let glCat = new GLCat( gl );
glCat.getExtension( "OES_texture_float", true );
glCat.getExtension( "OES_texture_float_linear", true );
glCat.getExtension( "EXT_frag_depth", true );
glCat.getExtension( "WEBGL_draw_buffers", true );

let glCatPath = new Path( glCat, { drawbuffers: true } );

// ------

let tweak = new Tweak( divTweak );

// ------

let totalFrame = 0;
let frame = 0;
let frames = 200;
let time = 0.0;
let init = true;
let secs = 1.0;
let deltaTime = 0.0;

let updateTime = () => {
  let reset = false;

  totalFrame ++;
  frame ++;
  if ( frames <= frame ) {
    frame = 0;
    reset = true;
  }
  
  let prevTime = time;
  time = secs * frame / frames;
  deltaTime = ( time + ( reset ? secs : 0.0 ) ) - prevTime;

  init = false;
};

// ------

let particlePixels = 2;
let particlesSqrt = 64;
let particles = particlesSqrt * particlesSqrt;
let vertsPerParticle = 1;

let vboQuad = glCat.createVertexbuffer( [ -1, -1, 1, -1, -1, 1, 1, 1 ] );
let vboQuadUV = glCat.createVertexbuffer( [ 0, 0, 1, 0, 0, 1, 1, 1 ] );
let vboQuad3 = glCat.createVertexbuffer( [ -1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0 ] );

let oct = octahedron( 3 );
let vboOctPos = glCat.createVertexbuffer( oct.pos );
let vboOctNor = glCat.createVertexbuffer( oct.nor );

let vboParticle = glCat.createVertexbuffer( ( () => {
  let ret = [];
  for ( let i = 0; i < particlesSqrt * particlesSqrt * vertsPerParticle; i ++ ) {
    let ix = Math.floor( i / vertsPerParticle ) % particlesSqrt;
    let iy = Math.floor( i / particlesSqrt / vertsPerParticle );
    let iz = i % vertsPerParticle;
    
    ret.push( ix * particlePixels );
    ret.push( iy );
    ret.push( iz );
  }
  return ret;
} )() );

// ------

let textureRandomSize = 256;

let textureRandomUpdate = ( _tex ) => {
  glCat.setTextureFromArray( _tex, textureRandomSize, textureRandomSize, ( () => {
    let len = textureRandomSize * textureRandomSize * 4;
    let ret = new Uint8Array( len );
    for ( let i = 0; i < len; i ++ ) {
      ret[ i ] = Math.floor( xorshift() * 256.0 );
    }
    return ret;
  } )() );
};


let textureKadomatsu = glCat.createTexture();
let textureMale = glCat.createTexture();
let textureFemale = glCat.createTexture();
let textureMochi = glCat.createTexture();
let textureFujisan = glCat.createTexture();
let textureGay = glCat.createTexture();

let textureRandomStatic = glCat.createTexture();
glCat.textureWrap( textureRandomStatic, gl.REPEAT );
textureRandomUpdate( textureRandomStatic );

let textureRandom = glCat.createTexture();
glCat.textureWrap( textureRandom, gl.REPEAT );

// ------

let renderA = document.createElement( 'a' );

let saveFrame = () => {
  renderA.href = canvas.toDataURL( 'image/jpeg' );
  renderA.download = ( '0000' + totalFrame ).slice( -5 ) + '.jpg';
  renderA.click();
};

// ------

let mouseX = 0.0;
let mouseY = 0.0;

// ------

let cameraPos = [ 0.0, 0.0, 0.0 ];
let cameraTar = [ 0.0, 0.0, 0.0 ];
let cameraRot = 0.0;
let cameraFov = 90.0;

let cameraNear = 0.01;
let cameraFar = 100.0;

let matP;
let matV;

let updateMatrices = () => {
  matP = CatMath.mat4Perspective( cameraFov, width / height, cameraNear, cameraFar );
  matV = CatMath.mat4LookAt( cameraPos, cameraTar, [ 0.0, 1.0, 0.0 ], cameraRot );
};
updateMatrices();

// ------

let bgColor = [ 0.51, 0.01, 0.02, 1.0 ];

// ------

glCatPath.setGlobalFunc( () => {
  glCat.uniform1i( 'init', init );
  glCat.uniform1f( 'time', time );
  glCat.uniform1f( 'deltaTime', deltaTime );
  glCat.uniform3fv( 'cameraPos', cameraPos );
  glCat.uniform1f( 'cameraRot', cameraRot );
  glCat.uniform1f( 'cameraFov', cameraFov );
  glCat.uniform1f( 'cameraNear', cameraNear );
  glCat.uniform1f( 'cameraFar', cameraFar );
  glCat.uniform1f( 'particlesSqrt', particlesSqrt );
  glCat.uniform1f( 'particlePixels', particlePixels );
  glCat.uniform1f( 'frame', frame % frames );
  glCat.uniform1f( 'frames', frames );
  glCat.uniform1f( 'vertsPerParticle', vertsPerParticle );
  glCat.uniformMatrix4fv( 'matP', matP );
  glCat.uniformMatrix4fv( 'matV', matV );
  glCat.uniform4fv( 'bgColor', bgColor );
} );

glCatPath.add( {
  return: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    func: ( _p, params ) => {
      gl.viewport( 0, 0, params.width, params.height );
      glCat.uniform2fv( 'resolution', [ params.width, params.height ] );

      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  こんにちは: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bg.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 1.0 ],
    framebuffer: true,
    drawbuffers: 2,
    float: true,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  hny: {
    width: width,
    height: height,
    vert: glslify( './shader/object.vert' ),
    frag: glslify( './shader/hny.frag' ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    drawbuffers: 2,
    func: ( _p, params ) => {
      glCat.attribute( 'pos', vboQuad3, 3 );
      glCat.attribute( 'uv', vboQuadUV, 2 );
      
      let matM = CatMath.mat4Identity();
      matM = CatMath.mat4Apply( CatMath.mat4ScaleXYZ( params.scale ), matM );
      matM = CatMath.mat4Apply( CatMath.mat4Translate( params.position ), matM );
      glCat.uniformMatrix4fv( 'matM', matM );

      glCat.uniform1f( 'phase', params.phase );
      glCat.uniform4fv( 'color', [ 0.9, 0.6, 0.2, 1.0 ] );
      glCat.uniformTexture( 'sampler0', params.texture, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  particlesComputeReturn: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'texture', glCatPath.fb( "particlesCompute" ).texture, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },

  particlesCompute: {
    width: particlesSqrt * particlePixels,
    height: particlesSqrt,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/particles-compute.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: () => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1f( 'charShuffle', auto( 'charShuffle' ) );
      glCat.uniformTexture( 'textureReturn', glCatPath.fb( "particlesComputeReturn" ).texture, 0 );
      glCat.uniformTexture( 'textureRandom', textureRandom, 1 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  particlesRender: {
    width: width,
    height: height,
    vert: glslify( './shader/particles-render.vert' ),
    frag: glslify( './shader/particles-render.frag' ),
    drawbuffers: 2,
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    func: () => {
      glCat.attribute( 'vuv', vboParticle, 3 );
      glCat.uniform2fv( 'resolutionPcompute', [ particlesSqrt * particlePixels, particlesSqrt ] );
      glCat.uniform3fv( 'color', [ 5.0, 3.0, 1.0 ] );
      glCat.uniformTexture( 'texturePcompute', glCatPath.fb( "particlesCompute" ).texture, 0 );
      gl.drawArrays( gl.POINT, 0, particles * vertsPerParticle );
    }
  },
  
  predof: {
    width: width / 4,
    height: height / 4,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  dof: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/dof.frag' ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniform1f( 'focus', auto( 'focus' ) );
      glCat.uniformTexture( 'sampler0', params.dry, 0 );
      glCat.uniformTexture( 'samplerPredof', params.predof, 1 );
      glCat.uniformTexture( 'samplerDepth', params.depth, 2 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  prebloom: {
    width: width / 4,
    height: height / 4,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/return.frag' ),
    blend: [ gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  "Gowrock - bloom": {
    width: width / 4.0,
    height: height / 4.0,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bloom.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    tempFb: glCat.createFloatFramebuffer( width / 4.0, height / 4.0 ),
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      for ( let i = 0; i < 3; i ++ ) {
        let gaussVar = [ 5.0, 15.0, 40.0 ][ i ];
        gl.bindFramebuffer( gl.FRAMEBUFFER, _p.tempFb.framebuffer );
        glCat.clear( ..._p.clear );

        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniform1i( 'isVert', false );
        glCat.uniform1f( 'gaussVar', gaussVar );
        glCat.uniformTexture( 'sampler0', params.input, 0 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
        
        gl.bindFramebuffer( gl.FRAMEBUFFER, params.target );

        glCat.attribute( 'p', vboQuad, 2 );
        glCat.uniform1i( 'isVert', true );
        glCat.uniform1f( 'gaussVar', gaussVar );
        glCat.uniformTexture( 'sampler0', _p.tempFb.texture, 0 );
        glCat.uniformTexture( 'samplerDry', params.input, 1 );
        gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
      }
    }
  },
  
  bloomFinalize: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/bloom-finalize.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    framebuffer: true,
    float: true,
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'samplerDry', params.dry, 0 );
      glCat.uniformTexture( 'samplerWet', params.wet, 1 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
  
  おたくはすぐポストエフェクトを挿す: {
    width: width,
    height: height,
    vert: glslify( './shader/quad.vert' ),
    frag: glslify( './shader/post.frag' ),
    blend: [ gl.ONE, gl.ONE ],
    clear: [ 0.0, 0.0, 0.0, 0.0 ],
    func: ( _p, params ) => {
      glCat.attribute( 'p', vboQuad, 2 );
      glCat.uniformTexture( 'sampler0', params.input, 0 );
      gl.drawArrays( gl.TRIANGLE_STRIP, 0, 4 );
    }
  },
} );

// ------

let updateUI = () => {
  let now = new Date();
  let deadline = new Date( 2018, 0, 5, 0, 0 );

  divCountdown.innerText = "Deadline: " + Math.floor( ( deadline - now ) / 1000 );

  divFrame.innerText = "Frames: " + totalFrame;
};

// ------

let update = () => {
  if ( frame % frames === 0 ) { xorshift( 79017846734887343443 ); }

  if ( !tweak.checkbox( 'play', { value: true } ) ) {
    setTimeout( update, 10 );
    return;
  }
  
  textureRandomUpdate( textureRandom );

  updateUI();

  updateTime();
  updateMatrices();
  
  automaton.update( time );

  cameraPos = [
    auto( "cameraX" ),
    auto( "cameraY" ),
    auto( "cameraZ" )
  ];
  cameraTar = [
    auto( "cameraTX" ),
    auto( "cameraTY" ),
    auto( "cameraTZ" )
  ]
  cameraRot = auto( "cameraRot" );

  glCatPath.render( "こんにちは" );

  // glCatPath.render( "monitor", { target: glCatPath.fb( "こんにちは" ).framebuffer } );

  glCatPath.render( "particlesComputeReturn" );
  glCatPath.render( "particlesCompute" );
  glCatPath.render( "particlesRender", { target: glCatPath.fb( "こんにちは" ).framebuffer } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ 0.0, 0.0, -10.0 ],
    scale: 40.0,
    phase: auto( "phaseFuji" ),
    texture: textureFujisan
  } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ 0.0, 6.0, -4.0 ],
    scale: 6.0,
    phase: auto( "phaseObjects" ),
    texture: textureMochi
  } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ -8.0, 0.0, 0.0 ],
    scale: 5.0,
    phase: auto( "phaseObjects" ),
    texture: textureKadomatsu
  } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ 8.0, 0.0, 0.0 ],
    scale: 5.0,
    phase: auto( "phaseObjects" ),
    texture: textureKadomatsu
  } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ -3.0, -2.0, 3.0 ],
    scale: 5.0,
    phase: auto( "phaseObjects" ),
    texture: textureMale
  } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ 3.0, -2.0, 2.99 ],
    scale: 5.0,
    phase: auto( "phaseObjects" ),
    texture: textureFemale
  } );

  glCatPath.render( "hny", { target: glCatPath.fb( "こんにちは" ).framebuffer,
    position: [ -0.3, 4.8, 4.0 ],
    scale: 6.0,
    phase: auto( "phaseGay" ),
    texture: textureGay
  } );

  glCatPath.render( "predof", { input: glCatPath.fb( "こんにちは" ).textures[ 0 ] } );
  glCatPath.render( "dof", { dry: glCatPath.fb( "こんにちは" ).textures[ 0 ], predof: glCatPath.fb( "predof" ).texture, depth: glCatPath.fb( "こんにちは" ).textures[ 1 ] } );
  glCatPath.render( "prebloom", { input: glCatPath.fb( "dof" ).texture } );
  glCatPath.render( "Gowrock - bloom", { input: glCatPath.fb( "prebloom" ).texture } );
  glCatPath.render( "bloomFinalize", { dry: glCatPath.fb( "dof" ).texture, wet: glCatPath.fb( "Gowrock - bloom" ).texture } );
  glCatPath.render( "おたくはすぐポストエフェクトを挿す", { input: glCatPath.fb( "bloomFinalize" ).texture, target: null } );

  if ( tweak.checkbox( 'save', { value: false } ) ) {
    saveFrame();
  }
  
  requestAnimationFrame( update );
};

// ------

step( {
  0: ( done ) => {
    let loadTexture = ( tex, glCatPath ) => {
      let img = new Image();
      img.onload = () => {
        glCat.setTexture( tex, img );
        done();
      }
      img.src = glCatPath;
    };

    loadTexture( textureKadomatsu, "images/kadomatsu.png" );
    loadTexture( textureMale, "images/male.png" );
    loadTexture( textureFemale, "images/female.png" );
    loadTexture( textureMochi, "images/mochi.png" );
    loadTexture( textureFujisan, "images/fujisan.png" );
    loadTexture( textureGay, "images/gay.png" );
  },

  6: ( done ) => {
    update();
  }
} );

window.addEventListener( 'keydown', ( _e ) => {
  if ( _e.which === 27 ) {
    tweak.checkbox( 'play', { set: false } );
  }
} );

window.addEventListener( 'mousemove', event => {
  mouseX = event.clientX;
  mouseY = event.clientY;
} );