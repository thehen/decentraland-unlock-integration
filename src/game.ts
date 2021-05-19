import { initialise } from './purchaseMembership'
import { showUnlockUI } from './unlockUI'

const LOCK = "0x07291E2861dC4e9856f021Ee3561040da9c5d04C"
const LOGO_URL = 'images/unlock-logo-black.png'
const BODY_TEXT = 'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.'

/// --- Spawner function ---

function spawnCube(x: number, y: number, z: number) {
  // create the entity
  const cube = new Entity()

  // add a transform to the entity
  cube.addComponent(new Transform({ position: new Vector3(x, y, z) }))

  // add a shape to the entity
  cube.addComponent(new BoxShape())

  // add the entity to the engine
  engine.addEntity(cube)

  return cube
}

/// --- Spawn a cube ---

const cube = spawnCube(8, 1, 8)

cube.addComponent(
  new OnClick(async () => {
    await initialise()
    const success =
      await showUnlockUI(
        LOCK,
        LOGO_URL,
        BODY_TEXT,
        closeUnlockUI
      );
  })
)

function closeUnlockUI(success: any) {
  if (success) {
    engine.removeEntity(cube)
  }
}