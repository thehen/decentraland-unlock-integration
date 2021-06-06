import { PadLock } from './padlock'

export let sceneMessageBus = new MessageBus()

const lock = new PadLock(
  '0x07291E2861dC4e9856f021Ee3561040da9c5d04C',
  'images/unlock-logo-black.png',
  'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.',
  () => {
    sceneMessageBus.emit('purchaseSuccess', {})
    log('purchase success!')
  },
  () => {
    sceneMessageBus.emit('purchaseFail', {})
    log('purchase fail!')
  }, () => {
    sceneMessageBus.emit('transactionSuccess', {})
    log('transaction success!')
  },
  () => {
    sceneMessageBus.emit('transactionFail', {})
    log('transaction fail!')
  }
)

engine.addEntity(lock)