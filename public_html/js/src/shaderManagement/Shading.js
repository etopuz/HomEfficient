export class Shading{

    constructor(material, texture) {
        this.material = material.clone();
        this.texture = texture;
        let uniforms = JSON.parse(JSON.stringify(material.uniforms))
        uniforms.tex.value = texture;
        this.material.uniforms = uniforms;
    }

}
