export class _3DModel {
    static numberOfModels = 0;
    models = [];
    constructor(name, path) {
        _3DModel.numberOfModels++;
        this.name = name;
        this.path = path;
    }
}
