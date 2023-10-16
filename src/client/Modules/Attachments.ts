import * as THREE from "three";
import SceneInit from "../SceneInit";
import { Wrapper, V3 } from "../Utils/types";

class Attachments {
  private main: SceneInit;
  private intersects: THREE.Intersection[];
  private linkCount: number;

  constructor(main: SceneInit) {
    this.main = main;
    this.intersects = [];
    this.linkCount = 0;
    this.execute = this.execute.bind(this);
    this.onMouseDoubleClick = this.onMouseDoubleClick.bind(this);
  }

  private onMouseDoubleClick(event: MouseEvent) {
    this.linkCount++;
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
      const n = new THREE.Vector3();
      n.copy((this.intersects[0].face as THREE.Face).normal);
      // n.transformDirection(this.intersects[0].object.matrixWorld)

      const attachment = new THREE.Mesh(
        new THREE.BoxGeometry(),
        new THREE.MeshBasicMaterial({ color: 0x0ff0f0 })
      );

      attachment.lookAt(n);
      attachment.rotateX(Math.PI / 2);
      attachment.position.copy(this.intersects[0].point);
      attachment.position.addScaledVector(n, 0.1); // so it submerges inside to the surface
      this.main.wrappers.forEach((wrapper: Wrapper) => {
        if (wrapper.name === this.intersects[0].object.name) {
          const actualPos = new THREE.Vector3().subVectors(
            attachment.position,
            wrapper.position
          );
          attachment.position.copy(actualPos);
          console.log('act ',actualPos)
          wrapper.add(attachment);
        }
      });
    }
  }
  public execute() {
    this.main.renderer.domElement.addEventListener(
      "dblclick",
      this.onMouseDoubleClick,
      false
    );
  }
}
export default Attachments;
