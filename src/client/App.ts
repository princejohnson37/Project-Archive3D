import * as THREE from 'three';
import SceneInit from "./SceneInit";
import MouseEvents from './Utils/MouseEvents';
import TeethMovements from "./Modules/TeethMovements";
import CollisionMapping from './Modules/CollisionMapping';

import Transparency from './Modules/Transparency';
import Attachments from './Modules/Attachments';
const App = (main: SceneInit) => {
  Transparency(main);
  const mouseEvents = new MouseEvents(main);
  // mouseEvents.highLight();
  const tm = new TeethMovements(main);
  tm.execute();
  const attachments = new Attachments(main);
  attachments.execute();
  const colMap = new CollisionMapping(main);
  colMap.execute();
}
 
export default App;