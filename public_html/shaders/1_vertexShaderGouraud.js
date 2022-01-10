export const VSG = `

uniform vec4 Ambient, Diffuse, Specular, LightPosition;
uniform float shininess;

out vec2 v_uv;
out vec4 v_color;

void main() {
    v_uv = uv;
    
    vec3 pos = (modelViewMatrix * vec4(position, 1.00)).xyz;
    vec3 N = normalize(normalMatrix * normal).xyz;
    vec3 L = normalize(LightPosition.xyz - pos);
    vec3 V = normalize(-pos);
    vec3 H = normalize(L + V);


    vec4 ambient = Ambient;

    float Fd = max(dot(L, N), 0.0);
    vec4 diffuse = Fd * Diffuse;
    

    float Fs = pow( max (dot (N, H), 0.0), shininess);
    vec4 specular = Fs * Specular;

    if (dot (L, N) < 0.0)
        specular = vec4(0.0, 0.0, 0.0, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

    v_color = ambient + diffuse + specular;
    v_color.a = 1.0;
}

`;

