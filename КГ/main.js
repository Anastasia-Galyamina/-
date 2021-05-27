const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
    throw new Error('WebGL not supported');
}

let h = 0.5
let a = h/Math.sqrt(3)
let d = 2*a
let l = 2*h

const vertexData = [

// Front
	a, l, h,
	-a, l, h,
	-a, -l, h,
 	a, l, h,
	a, -l, h,
	-a, -l, h,   

// Front Right
	a, l, h,
	d, l, 0,
	d, -l, 0,
 	a, l, h,
	a, -l, h,
	d, -l, 0, 

// Front Left
	-a, l, h,
	-d, l, 0,
	-d, -l, 0,
 	-a, l, h,
	-a, -l, h,
	-d, -l, 0, 

// Back
	-a, l, -h,
	a, l, -h,
	a, -l, -h,
 	-a, l, -h,
	-a, -l, -h,
	a, -l, -h,   

// Back Right
	a, l, -h,
	d, l, 0,
	d, -l, 0,
 	a, l, -h,
	a, -l, -h,
	d, -l, 0, 

// Back Left
	-a, l, -h,
	-d, l, 0,
	-d, -l, 0,
 	-a, l, -h,
	-a, -l, -h,
	-d, -l, 0, 


// Up
	-a, l, h,
	a, l, h,
	0, 2*l, 0, 

	-a, l, h,
	-d, l, 0,
	0, 2*l, 0,

	-a, l, -h,
	-d, l, 0,
	0, 2*l, 0,

	-a, l, -h,
	a, l, -h,
	0, 2*l, 0,

	a, l, -h,
	d, l, 0,
	0, 2*l, 0,

	a, l, h,
	d, l, 0,
	0, 2*l, 0,

// Down
	-a, -l, h,
	a, -l, h,
	0, -2*l, 0, 

	-a, -l, h,
	-d, -l, 0,
	0, -2*l, 0,

	-a, -l, -h,
	-d, -l, 0,
	0, -2*l, 0,

	-a, -l, -h,
	a, -l, -h,
	0, -2*l, 0,

	a, -l, -h,
	d, -l, 0,
	0, -2*l, 0,

	a, -l, h,
	d, -l, 0,
	0, -2*l, 0,

  
];



let colorData = [];

for (let face = 0; face < 18; face++) {
    let faceColor = [Math.random(255), Math.random(255), Math.random(255)];
	    for (let vertex = 0; vertex < 14; vertex++) {
        colorData.push(...faceColor);
    }
}
	
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW);

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW);

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 matrix;

void main() {
    vColor = color;
    gl_Position = matrix * vec4(position, 1);
}
`);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
    gl_FragColor = vec4(vColor, 1);
}
`);
gl.compileShader(fragmentShader);
console.log(gl.getShaderInfoLog(fragmentShader));

const program = gl.createProgram();
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);

gl.linkProgram(program);

const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);
gl.enable(gl.DEPTH_TEST);

const uniformLocations = {
    matrix: gl.getUniformLocation(program, `matrix`),
};

const matrix = mat4.create();

//mat4.translate(matrix, matrix, [.2, .5, 0]);

mat4.scale(matrix, matrix, [0.3, 0.3, 0.3]);

function animate() {
    requestAnimationFrame(animate);
    //mat4.rotateZ(matrix, matrix, Math.PI/2 / 70);    
    gl.uniformMatrix4fv(uniformLocations.matrix, false, matrix);
    gl.drawArrays(gl.TRIANGLES, 0, vertexData.length / 3);
}

function RotateX() {
   mat4.rotateX(matrix, matrix, Math.PI/4);    
}

function RotateY() {
   mat4.rotateY(matrix, matrix, Math.PI/4);    
}

function RotateZ() {
   mat4.rotateZ(matrix, matrix, Math.PI/4);    
}
animate();
