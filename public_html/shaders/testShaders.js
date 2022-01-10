// THIS FILE CONTAINS SHADERS THAT ARE DEVELOPED DURING LEARNING AND TESTING PHASES
// IT'S KIND OF SKETCHBOOK

// PER FRAGMENT SHADER

export const _VS = `

uniform vec4 LightPosition;

out vec2 vUv;
out vec3 fN;
out vec3 fV;
out vec3 fL;

void main() {
    vUv = uv * 8.0;
    
    fN = (normalMatrix*normal).xyz;
    fV = -(modelViewMatrix*vec4(position, 1.0)).xyz;
    fL = LightPosition.xyz;
    
    if( LightPosition.w != 0.0) {
        fL = LightPosition.xyz - (modelViewMatrix*vec4(position, 1.0)).xyz;
    }
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); 
}
`;


export const _FS = `
uniform sampler2D tex;
uniform vec4 Ambient, Diffuse, Specular;
uniform float shininess;

in vec3 fN;
in vec3 fL;
in vec3 fV;
in vec2 vUv;

out vec4 outColor;

void main() {
    vec4 textured = texture2D(tex, vUv);
    
    vec3 N = normalize(fN);
    vec3 V = normalize(fV);
    vec3 L = normalize(fL);
    vec3 H = normalize( L + V );
    vec4 ambient = Ambient;
    
    float Kd = max(dot(L, N), 0.0);
    vec4 diffuse = Kd * Diffuse;
    
    float Ks = pow(max(dot(N, H), 0.0), shininess);
    vec4 specular = Ks * Specular;

    if( dot(L, N) < 0.0 )
    specular = vec4(0.0, 0.0, 0.0, 1.0);

    outColor = ambient + diffuse + specular;
    outColor.a = 1.0;
    outColor *= textured;
}
`;


// PER VERTEX SHADER

export const _VS2 = `
uniform vec4 Ambient, Diffuse, Specular, LightPosition;
uniform float shininess;

out vec2 vUv;
out vec4 v_color;

void main() {

    vUv = uv;
    vUv.x *= 4.;
    vUv.y *= 8.;
    
    vec3 pos = (modelViewMatrix * vec4(position, 1.00)).xyz;
    vec3 L = normalize(LightPosition.xyz - pos);
    vec3 V = normalize(-pos);
    vec3 H = normalize(L + V);
    vec3 N = normalize(normalMatrix * normal).xyz;

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


export const _FS2 = `
uniform sampler2D tex;

in vec4 v_color;
in vec2 vUv;

out vec4 outColor;

void main() {
    vec4 textured = texture2D(tex, vUv);
    outColor = textured * v_color;
}
`;


// (SUPPOSE TO BE COOL?) SHADER

export const _VSB = `
out vec2 vUv;

void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;


export const _FSB = `
uniform float time;
in vec2 vUv;
out vec4 c;

void main() {


    float colorR = 0.7;
    float colorG = 0.5;
    float colorB = 0.5;

    float bsMin = 0.05;
    float bsMax = 0.10;
    float bbMin = 0.90;
    float bbMax = 0.95;

    bool onLeft = vUv.x < bsMax && vUv.x > bsMin && vUv.y < bbMax && vUv.y > bsMin; //
    bool onRight = vUv.x > bbMin && vUv.x < bbMax && vUv.y < bbMax && vUv.y > bsMax;
    bool onBottom = vUv.y < bsMax && vUv.y > bsMin && vUv.x < bbMax && vUv.x > bsMin; //
    bool onTop = vUv.y > bbMin && vUv.y < bbMax && vUv.x < bbMax && vUv.x > bsMax;


    bool inBound = onLeft || onRight || onTop || onBottom;

    if(onLeft){
        colorR += vUv.y - time;
    }

    else if(onRight){
        colorG += time - vUv.y;
    }

    else if(onTop){
        colorB += vUv.x - time;
    }

    else if(onBottom){
        colorR += time - vUv.x;
    }

    else {
        colorR = 0.0;
        colorG = 0.0;
        colorB = 0.0;
    }

    c = vec4(colorR, colorG, colorB, 1.0);
}
`


// OLD TOON SHADER

export const VST = `

uniform vec4 LightPosition;

out vec2 v_uv;
out vec3 v_normal, v_lightDir;

void main() {

    v_uv = uv;
    
    v_lightDir = normalize(LightPosition.xyz);
    v_normal = normalize((normalMatrix * normal).xyz);
    
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    
}

`;

export const FST = `
uniform sampler2D tex;
uniform vec4 inputColor;

in vec2 v_uv;
in vec3 v_normal, v_lightDir;

out vec4 outColor;

void main() {
    vec4 textured = texture2D(tex, v_uv);
    
    float intensity;
    vec4 color;
    
    vec3 n = normalize(v_normal);
    intensity = max(dot(v_lightDir, n), 0.0);
    
    if (intensity > 0.98)
        color = vec4(0.6, 0.6, 0.6, 1.0) + (inputColor * 2.);
    else if (intensity > 0.5)
        color = vec4(0.4, 0.4, 0.4, 1.0) + (inputColor * 4.);
    else if (intensity > 0.25)
        color = vec4(0.2, 0.2, 0.2, 1.0) + (inputColor * 2.);
    else
        color = vec4(0.1, 0.1, 0.1, 1.0) + inputColor;
    
    outColor = textured * color;
}
`;

