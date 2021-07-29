import * as utils from '@dcl/ecs-scene-utils'

/**
 * Creates a ms delay in async functions
 * @param ms delay in ms
 * @returns 
 */
export default function delay(ms: number): Promise<undefined> {
    return new Promise((resolve, reject) => {
        const ent = new Entity()
        engine.addEntity(ent)
        ent.addComponent(
            new utils.Delay(ms, () => {
                resolve()
                engine.removeEntity(ent)
            })
        )
    })
}