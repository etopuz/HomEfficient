import {materials} from "../../globals.js";
import * as THREE from "../../modules/three.module.js";

export function highlight(obj3D){
    let original = obj3D.material.clone();
    obj3D.material = materials.highlight;
    return original;
}
