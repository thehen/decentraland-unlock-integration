import { PadLock } from './padlock'

export let sceneMessageBus = new MessageBus()

const lock = new PadLock(
  '0xBcb88eA834C300418c503ECE5dC5c9dd2dd6B978',
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