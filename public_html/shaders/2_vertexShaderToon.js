export const VST = `

uniform vec4 LightPosition;

out vec2 v_uv;
out vec3 v_normal, v_lightDir, v_eye;

void main() {

    v_uv = uv;
    
    v_lightDir = normalize(LightPosition.xyz);
    v_normal = normalize((normalMatrix * position).xyz);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

`;
