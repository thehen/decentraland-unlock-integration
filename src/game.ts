import { getProvider } from '@decentraland/web3-provider'
import { getUserAccount } from '@decentraland/EthereumController'
import { RequestManager, ContractFactory } from "eth-connect"
import UnlockABI from './abis/Unlock'

executeTask(async () => {
  try {
    const provider = await getProvider()
    const requestManager = new RequestManager(provider)
    const factory = new ContractFactory(requestManager, UnlockABI)
    const contract = (await factory.at(
      "0x07291E2861dC4e9856f021Ee3561040da9c5d04C"
    )) as any
    //const address = await getUserAccount()
    //log(address)

    // Perform a function from the contract
    //const res = await contract.getHasValidKey(address)

    var address = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"
    var actualAmount = 1
    var referrer = "0xA008D4c1E22A760FF47218659A0ddD934Aa543FD"
    var data = new Array<number>();

    const purchaseForOptions = { 
      value: actualAmount,
      from: referrer,
      gasLimit: 500000
    };

    const transactionPromise = contract.purchase(actualAmount, address, referrer, data, purchaseForOptions);
    
    
    
    // Log response
    // log(transactionPromise)
  } catch (error) {
    log(error.toString())
  }
})


/*
const url = 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2'

const query = `
query {
  pairs {
    id
  }
}
`

executeTask(async () => {
  try {
    let response = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify(query),
    })
    let json = await response.json()
    log(json)
  } catch {
    log("failed to reach URL")
  }
})
*/

/// --- Set up a system ---

class RotatorSystem {
  // this group will contain every entity that has a Transform component
  group = engine.getComponentGroup(Transform)

  update(dt: number) {
    // iterate over the entities of the group
    for (let entity of this.group.entities) {
      // get the Transform component of the entity
      const transform = entity.getComponent(Transform)

      // mutate the rotation
      transform.rotate(Vector3.Up(), dt * 10)
    }
  }
}

// Add a new instance of the system to the engine
engine.addSystem(new RotatorSystem())

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
  new OnClick(() => {
    cube.getComponent(Transform).scale.z *= 1.1
    cube.getComponent(Transform).scale.x *= 0.9

    spawnCube(Math.random() * 8 + 1, Math.random() * 8, Math.random() * 8 + 1)
  })
)
