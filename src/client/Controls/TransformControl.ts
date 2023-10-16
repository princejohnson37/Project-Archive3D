import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import SceneInit from "../SceneInit";
import { Mesh, Mode, Wrapper } from '../Utils/types';

const TransformControl = (client: SceneInit, attachment: (Wrapper | Mesh), otherControls?: (OrbitControls | TransformControls)[], defaultMode?: Mode, restrictModes ?: Array<Mode>): TransformControls => {
  
  const control = new TransformControls(client.camera, client.renderer.domElement);
  const restrict= {
    [Mode.Translate]: false,
    [Mode.Rotate]: false,
    [Mode.Scale]: false
  };
  if(restrictModes?.length) {
    restrictModes.forEach(mode => restrict[mode] = true) 
  }
  if ( restrictModes && defaultMode && restrictModes.includes(defaultMode)) {
    throw new Error(`The mode ${defaultMode} is restricted.`);
} else {
    control.setMode(defaultMode || Mode.Translate); // find it here
}

client.scene.add(control);
  control.attach(attachment);

  control.addEventListener("dragging-changed", function (event) {
    client.controller.enabled = !event.value;
    if (otherControls)
      otherControls.forEach(controller => {
        controller.enabled = !event.value;
      });
  });
  
  window.addEventListener("keydown", function (event) {
    switch (event.key) {
      case "g":
        !restrict[Mode.Translate] && control.setMode(Mode.Translate);
        break;
      case "r":
        !restrict[Mode.Rotate] && control.setMode(Mode.Rotate);
        break;
      case "s":  
      !restrict[Mode.Scale] && control.setMode(Mode.Scale);
        break;
    }
  });
  return control;
};
export default TransformControl; 