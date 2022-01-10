export const FST = `

uniform sampler2D tex;
uniform bool shade;
uniform bool showOutline;
uniform vec4 inputColor;

in vec2 v_uv;
in vec3 v_normal, v_lightDir, v_eye;

out vec4 outColor;

void main() {
    vec4 textured = texture2D(tex, v_uv);
    
    float intensity;
    vec4 color = vec4(0.1, 0.1, 0.1, 1.0);
    vec3 n, l, e;
    
    n = normalize(v_normal);
    l = normalize(v_lightDir);
    e = normalize(v_eye);
   
    intensity = max(dot(l, n), 0.0  );
    
    bool isBorder = v_uv.x < 0.01 || v_uv.x > 0.99 || v_uv.y < 0.00333 || v_uv.y > 0.99666;
    
    
    if(shade){
        if (intensity > 0.98)
            color = color + inputColor * 8.;
        else if (intensity > 0.5)
            color = color + inputColor * 5.;
        else if (intensity > 0.25)
            color = color + inputColor * 3.;
        else
            color = color + inputColor * 1.;
        if (dot(e,n) < 0.15)
           color = vec4(0., 0., 0., 0.); 
        if (degrees(acos(dot(l,n))) < 5.0)
           color = vec4(0.8, 0.8, 0.8, 0.8);
        if (degrees(acos(dot(l,n))) < 3.0)
           color = vec4(1., 1., 1., 1.);
    }
    
    else
        color = inputColor * 4.0;
    
    if(isBorder && showOutline)
        outColor = vec4(1., 1., 1., 1.);
    
    else
        outColor = mix(color, textured, 0.3);
     
}
`;
