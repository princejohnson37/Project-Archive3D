import * as THREE from "three";
import SceneInit from "../SceneInit";
import TransformControl from "../Controls/TransformControl";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { getState } from "../State/MaterialState";

class MouseEvents {
  private main: SceneInit;
  private intersects: THREE.Intersection[];
  private intersectObject: THREE.Object3D | null;
  constructor(main: SceneInit) {
    this.main = main;
    this.intersects = [];
    this.intersectObject = null;
    this.highLight = this.highLight.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }
  // private alterOGMaterial() {
  //   console.log('ogMat',this.main.meshes[7]);
  //   const opacity = this.main.gui.__controllers[0].getValue();
  //   this.ogMaterial = this.main.meshes.map((mesh) => {
  //     return new THREE.MeshLambertMaterial({
  //       color: mesh.name === "_gum.ply" ? 0xff8080 : 0xffffff,
  //       transparent: true,
  //       opacity: 1 - opacity,
  //     });
  //   });
  // }
  private onMouseMove(event: MouseEvent): void {
    this.main.mouse.set(
      (event.clientX / this.main.renderer.domElement.clientWidth) * 2 - 1,
      -(event.clientY / this.main.renderer.domElement.clientHeight) * 2 + 1
    );
    this.main.raycaster.setFromCamera(this.main.mouse, this.main.camera);
    this.intersects = this.main.raycaster.intersectObjects(
      this.main.meshes,
      false
    );
    if (this.intersects.length > 0) {
      this.intersectObject = this.intersects[0].object;
    } else {
      this.intersectObject = null;
    }
    this.main.meshes.forEach((mesh: THREE.Mesh, i: number) => {
      if (this.intersectObject && this.intersectObject.name === mesh.name) {
        mesh.material = new THREE.MeshBasicMaterial({ wireframe: true });
      } else {
        // this.alterOGMaterial();
        mesh.material = new THREE.MeshLambertMaterial(getState(mesh.name).material); // Expensive
      }
    });
  }

  public highLight(): void {
    this.main.renderer.domElement.addEventListener(
      "mousemove",
      this.onMouseMove,
      false
    );
  }
}

export default MouseEvents;
