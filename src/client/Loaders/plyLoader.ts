import * as THREE from "three";
import { PLYLoader } from "three/examples/jsm/loaders/PLYLoader";
import { rt, Mesh, Wrapper } from "../Utils/types";
import { setState } from "../State/MaterialState";

const plyLoader2 = (files: Array<string>): Promise<THREE.BufferGeometry[]> => {
  const plyModels: Promise<THREE.BufferGeometry>[] = [];
  const loader = new PLYLoader();
  for (let i = 0; i < files.length; i++) {
    plyModels.push(loader.loadAsync(`models/${files[i]}`));
  }
  return Promise.all(plyModels);
};

const plyLoader = (
  files: Array<string>,
  meshes: Array<Mesh>,
  meshWrappers: Array<Wrapper>,
  [material, gumMaterial]: Object[]
): Promise<rt> => {
  return new Promise<rt>((resolve) => {
    plyLoader2(files).then((geometries) => {
      let max = { size: 0, id: 0 };
      for (let i = 0; i < geometries.length; i++) {
        geometries[i].computeVertexNormals();
        const mesh = new THREE.Mesh(geometries[i], new THREE.MeshLambertMaterial(material));
        const meshWrapper = new THREE.Group();
        mesh.name = files[i];
        meshWrapper.name = files[i];
        setState(mesh.name, {
          material: material
        });
        meshWrapper.add(mesh);

        const boundingBox = new THREE.Box3().setFromObject(mesh);

        const width = boundingBox.max.x - boundingBox.min.x;
        const height = boundingBox.max.y - boundingBox.min.y;
        const depth = boundingBox.max.z - boundingBox.min.z;
        const volume = width * height * depth;

        max = max.size < volume ? { size: volume, id: i } : max;

        const center = boundingBox.getCenter(new THREE.Vector3());

        meshWrapper.position.set(center.x, center.y, center.z);
        mesh.position.set(-center.x, -center.y, -center.z);

        meshes.push(mesh);
        meshWrappers.push(meshWrapper);
      }

      meshes[max.id].material = new THREE.MeshLambertMaterial(gumMaterial);
      setState(meshes[max.id].name, {
        material: gumMaterial
      })
      const result: rt = {
        meshes: meshes,
        wrappers: meshWrappers,
      };

      resolve(result);
    });
  });
};

export default plyLoader;

