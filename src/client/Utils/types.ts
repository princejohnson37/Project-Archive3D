export type Wrapper = THREE.Group;
export type Mesh = THREE.Mesh;
export type V3 = THREE.Vector3;
export type rt = {
  meshes: Array<Mesh>;
  wrappers: Array<Wrapper>;
};
export type Mouse = THREE.Vector2 & {
  x: number;
  y: number;
};

export type WrapperLocalAxes = {
  prev: V3,
  next: V3
};

type propVal = {
  prop: string,
  val: any
}

export type MaterailProps = Array<propVal>;

export type state = {
  material: Object
}
export type stateArray ={
  [key: string]: state
};

export enum Mode {
  Translate = 'translate',
  Rotate = 'rotate',
  Scale = 'scale'
}