

//For built in attributes 3js throws in see
//https://threejs.org/docs/#api/en/renderers/webgl/WebGLProgram

varying vec3 vertexColor;

void main() {
    vec4 worldPostion = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vertexColor = vec3(0, 0, distance(cameraPosition, worldPostion.xyz) / 100.0);
    gl_Position = worldPostion;
}