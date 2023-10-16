import * as THREE from "three";
import SceneInit from "../SceneInit";
import { Mesh } from "../Utils/types";
import { getState, setState } from "../State/MaterialState";
import * as _ from 'lodash';

const iterate = (meshes: Mesh[], val: number) => {
  meshes.forEach((mesh) => {
    const curr_state = getState(mesh.name);
    const new_state  = _.merge(curr_state, {material: { opacity: 1-val }})
    const material = new THREE.MeshLambertMaterial(new_state.material);
    setState(mesh.name, new_state);
    mesh.material = material;
  });
};
const Transparency = (main: SceneInit) => {
  const gui = main.gui;
  const params = {
    transparency: 0,
  };
  const controller = gui
    .add(params, "transparency", 0, 1, 0.05)
    .name('transparency')
    .onChange((val) => {
      iterate(main.meshes, val);
    });
  controller.onFinishChange((val) => {
    iterate(main.meshes, val);
  });
};

export default Transparency;
