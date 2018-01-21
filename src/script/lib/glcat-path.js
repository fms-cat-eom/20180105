const glslify = require( 'glslify' );

let requiredFields = ( object, nanithefuck, fields ) => {
  fields.map( field => {
    if ( typeof object[ field ] === "undefined" ) {
      throw "GLCat-Path: " + field + " is required for " + nanithefuck;
    }
  } );
};

let Path = class {
  constructor( glCat, params ) {
    let it = this;

    it.glCat = glCat;
    it.gl = glCat.gl;

    it.paths = {};
    it.globalFunc = () => {};
    it.params = params || {};
  }

  add( paths ) {
    let it = this;

    for ( let name in paths ) {
      let path = paths[ name ];
      requiredFields( path, "path object", [
        "width",
        "height",
        "vert",
        "frag",
        "blend",
        "func"
      ] );
      it.paths[ name ] = path;

      if ( typeof path.depthTest === "undefined" ) { path.depthTest = true; }
      
      if ( path.framebuffer ) {
        if ( path.drawbuffers ) {
          path.framebuffer = it.glCat.createDrawBuffers( path.width, path.height, path.drawbuffers );
        } else if ( path.float ) {
          path.framebuffer = it.glCat.createFloatFramebuffer( path.width, path.height );
        } else {
          path.framebuffer = it.glCat.createFramebuffer( path.width, path.height );
        }
      }
      path.program = it.glCat.createProgram( path.vert, path.frag );
    }
  }

  render( name, params ) {
    let it = this;
 
    if ( !params ) { params = {}; }
    let path = it.paths[ name ];
    params.target = typeof params.target !== "undefined" ? params.target : path.framebuffer ? path.framebuffer.framebuffer : null;
 
    it.gl.viewport( 0, 0, path.width, path.height );
    it.glCat.useProgram( path.program );
    it.gl.bindFramebuffer( it.gl.FRAMEBUFFER, params.target );
    if ( it.params.drawbuffers ) {
      it.glCat.drawBuffers( path.drawbuffers ? path.drawbuffers : params.target === null ? [ it.gl.BACK ] : [ it.gl.COLOR_ATTACHMENT0 ] );
    }
    it.gl.blendFunc( ...path.blend );
    if ( path.clear ) { it.glCat.clear( ...path.clear ); }
    path.depthTest ? it.gl.enable( it.gl.DEPTH_TEST ) : it.gl.disable( it.gl.DEPTH_TEST );
 
    it.glCat.uniform2fv( 'resolution', [ path.width, path.height ] );
    it.globalFunc( path, params );
    path.func( path, params );
  }

  resize( name, width, height ) {
    let it = this;

    let path = it.paths[ name ];

    path.width = width;
    path.height = height;

    if ( path.framebuffer ) {
      if ( it.params.drawbuffers && path.drawbuffers ) {
        path.framebuffer = it.glCat.createDrawBuffers( path.width, path.height, path.drawbuffers );
      } else if ( path.float ) {
        path.framebuffer = it.glCat.createFloatFramebuffer( path.width, path.height );
      } else {
        path.framebuffer = it.glCat.createFramebuffer( path.width, path.height );
      }
    }

    if ( typeof path.onresize === "function" ) {
      path.onresize( path, width, height );
    }
  }

  setGlobalFunc( func ) { this.globalFunc = func; }

  fb( name ) {
    if ( !this.paths[ name ] ) { throw "glcat-path.fb: path called " + name + " is not defined"; }
    if ( !this.paths[ name ].framebuffer ) { throw "glcat-path.fb: there is no framebuffer for the path " + name; }

    return this.paths[ name ].framebuffer;
  }
};

export default Path;