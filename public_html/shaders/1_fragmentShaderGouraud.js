export const FSG = `

uniform sampler2D tex;

in vec4 v_color;
in vec2 v_uv;

out vec4 outColor;

void main() {
    vec4 textured = texture2D(tex, v_uv);
    outColor = textured * v_color;
}

`;
