import * as THREE from "three";
import * as _ from 'lodash';
import SceneInit from "../SceneInit";
import { Arrow, getLocalY, negativeVector } from "../Utils/HelperFunctions";
import { Wrapper, Mesh, V3, Mode } from "../Utils/types";
import { OccColorMap } from "../Utils/constants";
import { getState, setState } from "../State/MaterialState";
import TransformControl from "../Controls/TransformControl";

// dist >= 0.7	: no contact -> white
// 0.7 > dist >= 0.2: no contact -> green
// 0.2 > dist >= 0.0 : contact -> blue
// 0.0 > dist >= -0.2 : inside -> pink
// -0.2 > dist > -0.7: inside -> red

class CollisionMapping {
  main: SceneInit;
  meshes: Mesh[];
  wrappers: Wrapper[];
  gui: dat.GUI;
  constructor(main: SceneInit) {
    this.main = main;
    this.meshes = main.meshes;
    this.wrappers = main.wrappers;
    this.gui = main.gui;
  }

  private logic(boxMesh: Mesh, mesh: Mesh, targetVector: V3) {
    boxMesh.updateMatrixWorld(true);
    const geometry = mesh.geometry;
    if (geometry.isBufferGeometry) {
      const positionAttribute = geometry.attributes.position;
      const normalAttribute = geometry.attributes.normal;
      const indexArray = geometry.index?.array || [];

      if (positionAttribute && normalAttribute && indexArray) {
        const positionArray: ArrayLike<number> = positionAttribute.array;
        const vertexNormalArray: ArrayLike<number> = normalAttribute.array;
        const vertices: Array<THREE.Vector3> = [];
        const vertexNormals: Array<THREE.Vector3> = [];
        for (let i = 0; i < positionArray.length; i += 3) {
          vertices.push(
            new THREE.Vector3(
              positionArray[i],
              positionArray[i + 1],
              positionArray[i + 2]
            )
          );
          vertexNormals.push(
            new THREE.Vector3(
              vertexNormalArray[i],
              vertexNormalArray[i + 1],
              vertexNormalArray[i + 2]
            )
          );
        }

        const raycaster = new THREE.Raycaster();
        const neg_raycaster = new THREE.Raycaster();

        const colorArray = new Float32Array(
          positionAttribute.array.length
        ).fill(1);
        vertexNormals.forEach((normal, i) => {
          const yComponent = normal.y;
          const newYVector = new THREE.Vector3().set(0, yComponent, 0);
          const dotProduct = normal.dot(targetVector.normalize());
          if (dotProduct > 0.4) {
            raycaster.set(vertices[i], normal.normalize());
            neg_raycaster.set(vertices[i], negativeVector(normal.normalize()));
           
            const intersects: THREE.Intersection[] | undefined =
              raycaster.intersectObject(boxMesh, false);
            const neg_intersects: THREE.Intersection[] | undefined =
              neg_raycaster.intersectObject(boxMesh, false);

              if (neg_intersects.length) {
                const neg_dist: number = neg_intersects[0].distance;
                if (1 > neg_dist && neg_dist > 0){
                  colorArray.set(OccColorMap.red, i * 3);
                } else if (neg_dist >= 1) {
                  colorArray.set(OccColorMap.pink, i * 3);
                }
              }
            else if (intersects.length) {
              const dist: number = intersects[0].distance;
              
              if (6 > dist && dist >= 3) {
                colorArray.set(OccColorMap.green, i * 3);
              } 
              
              else if (3 > dist && dist >= 0) {
                colorArray.set(OccColorMap.blue, i * 3);
              }
            }
          }
          
        });

        const colorAttribute = new THREE.Float32BufferAttribute(
          colorArray,
          3
        );
        mesh.geometry.setAttribute("color", colorAttribute);
        mesh.geometry.attributes.color.needsUpdate = true;
      }
    }
  }
  public execute() {
    for(let i=1; i<=14;i++){

      const mesh = this.meshes[i];
      const wrapper = this.wrappers[i];
      const curr_state = getState(mesh.name);
      const new_state = _.merge(curr_state, { material: { vertexColors: true, side: THREE.DoubleSide } });
      setState(mesh.name, new_state);
      mesh.material = new THREE.MeshLambertMaterial(getState(mesh.name).material);
      const boxGeometry = new THREE.SphereGeometry(3); // Width and height of the box
  
      const boxMaterial = new THREE.MeshBasicMaterial({
        color: 0x928670,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide
      });
  
      const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
      boxMesh.name = "plainMesh";
      this.main.scene.add(boxMesh);
      boxMesh.position.set(wrapper.position.x, wrapper.position.y+8, wrapper.position.z)
      boxMesh.visible = true;
      boxMesh.updateMatrixWorld(true);
  
      const targetVector = getLocalY(wrapper); // Target vector to check parallelism
      this.logic(boxMesh, mesh, targetVector);
      const controls = {
        [mesh.name]: boxMesh.position.y,
      };
      this.gui
        .add(controls, mesh.name, 0, 12)
        .onChange((val) => {
          boxMesh.position.setY(val);
        })
        .onFinishChange(() => {
          this.logic(boxMesh, mesh, targetVector);
        });
    }
  }
}

export default CollisionMapping;
