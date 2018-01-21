// にゃーん

let CatMath = {};

/**
 * adds a two vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
CatMath.vecAdd = ( a, b ) => a.map( ( e, i ) => e + b[i] );

/**
 * substracts a vec from an another vec
 * @param {array} a - vec
 * @param {array} b - vec
 */
CatMath.vecSub = ( a, b ) => a.map( ( e, i ) => e - b[i] );

/**
 * returns a cross of two vec3s
 * @param {array} a - vec3
 * @param {array} b - vec3
 */
CatMath.vec3Cross = ( a, b ) => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0]
];

/**
 * scales a vec by scalar
 * @param {number} s - scalar
 * @param {array} v - vec
 */
CatMath.vecScale = ( s, v ) => v.map( e => e * s );

/**
 * returns length of a vec
 * @param {array} v - vec
 */
CatMath.vecLength = v => Math.sqrt( v.reduce( ( p, c ) => p + c * c, 0.0 ) );

/**
 * normalizes a vec
 * @param {array} v - vec
 */
CatMath.vecNormalize = v => CatMath.vecScale( 1.0 / CatMath.vecLength( v ), v );

/**
 * applies two mat4s
 * @param {array} a - mat4
 * @param {array} b - mat4
 */
CatMath.mat4Apply = ( a, b ) => {
  return [
    a[ 0] * b[ 0] + a[ 4] * b[ 1] + a[ 8] * b[ 2] + a[12] * b[ 3],
    a[ 1] * b[ 0] + a[ 5] * b[ 1] + a[ 9] * b[ 2] + a[13] * b[ 3],
    a[ 2] * b[ 0] + a[ 6] * b[ 1] + a[10] * b[ 2] + a[14] * b[ 3],
    a[ 3] * b[ 0] + a[ 7] * b[ 1] + a[11] * b[ 2] + a[15] * b[ 3],

    a[ 0] * b[ 4] + a[ 4] * b[ 5] + a[ 8] * b[ 6] + a[12] * b[ 7],
    a[ 1] * b[ 4] + a[ 5] * b[ 5] + a[ 9] * b[ 6] + a[13] * b[ 7],
    a[ 2] * b[ 4] + a[ 6] * b[ 5] + a[10] * b[ 6] + a[14] * b[ 7],
    a[ 3] * b[ 4] + a[ 7] * b[ 5] + a[11] * b[ 6] + a[15] * b[ 7],

    a[ 0] * b[ 8] + a[ 4] * b[ 9] + a[ 8] * b[10] + a[12] * b[11],
    a[ 1] * b[ 8] + a[ 5] * b[ 9] + a[ 9] * b[10] + a[13] * b[11],
    a[ 2] * b[ 8] + a[ 6] * b[ 9] + a[10] * b[10] + a[14] * b[11],
    a[ 3] * b[ 8] + a[ 7] * b[ 9] + a[11] * b[10] + a[15] * b[11],
    
    a[ 0] * b[12] + a[ 4] * b[13] + a[ 8] * b[14] + a[12] * b[15],
    a[ 1] * b[12] + a[ 5] * b[13] + a[ 9] * b[14] + a[13] * b[15],
    a[ 2] * b[12] + a[ 6] * b[13] + a[10] * b[14] + a[14] * b[15],
    a[ 3] * b[12] + a[ 7] * b[13] + a[11] * b[14] + a[15] * b[15]
  ];
};

/**
 * transpose a mat4
 * @param {array} m - mat4
 */
CatMath.mat4Transpose = m => [
  m[ 0],m[ 4],m[ 8],m[12],
  m[ 1],m[ 5],m[ 9],m[13],
  m[ 2],m[ 6],m[10],m[14],
  m[ 3],m[ 7],m[11],m[15]
];

/**
 * returns an indentity mat4
 */
CatMath.mat4Identity = () => [1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];

CatMath.mat4Translate = ( v ) => [1,0,0,0,0,1,0,0,0,0,1,0,v[0],v[1],v[2],1];

CatMath.mat4Scale = ( v ) => [
  v[0],0,0,0,
  0,v[1],0,0,
  0,0,v[2],0,
  0,0,0,1
];

CatMath.mat4ScaleXYZ = ( s ) => [
  s,0,0,0,
  0,s,0,0,
  0,0,s,0,
  0,0,0,1
];

CatMath.mat4RotateX = ( t ) => [
  1,0,0,0,
  0,Math.cos(t),-Math.sin(t),0,
  0,Math.sin(t),Math.cos(t),0,
  0,0,0,1
];

CatMath.mat4RotateY = ( t ) => [
  Math.cos(t),0,Math.sin(t),0,
  0,1,0,0,
  -Math.sin(t),0,Math.cos(t),0,
  0,0,0,1
];

CatMath.mat4RotateZ = ( t ) => [
  Math.cos(t),-Math.sin(t),0,0,
  Math.sin(t),Math.cos(t),0,0,
  0,0,1,0,
  0,0,0,1
];

CatMath.mat4LookAt = ( pos, tar, air, rot ) => {
  let dir = CatMath.vecNormalize( CatMath.vecSub( tar, pos ) );
  let sid = CatMath.vecNormalize( CatMath.vec3Cross( dir, air ) );
  let top = CatMath.vec3Cross( sid, dir );
  sid = CatMath.vecAdd(
    CatMath.vecScale( Math.cos( rot ), sid ),
    CatMath.vecScale( Math.sin( rot ), top )
  );
  top = CatMath.vec3Cross( sid, dir );

  return [
    sid[0], top[0], dir[0], 0.0,
    sid[1], top[1], dir[1], 0.0,
    sid[2], top[2], dir[2], 0.0,
    - sid[0] * pos[0] - sid[1] * pos[1] - sid[2] * pos[2],
    - top[0] * pos[0] - top[1] * pos[1] - top[2] * pos[2],
    - dir[0] * pos[0] - dir[1] * pos[1] - dir[2] * pos[2],
    1.0
  ];
};

CatMath.mat4Perspective = ( fov, aspect, near, far ) => {
  let p = 1.0 / Math.tan( fov * Math.PI / 360.0 );
  let d = far / ( far - near );
  return [
    p / aspect, 0.0, 0.0, 0.0,
    0.0, p, 0.0, 0.0,
    0.0, 0.0, d, 1.0,
    0.0, 0.0, -near * d, 0.0
  ];
};

export default CatMath;