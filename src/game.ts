import { Lock } from './unlock'
import { UnlockPurchaseUI } from './unlockUI'

executeTask(async () => {

  const lock = new Lock('0xBcb88eA834C300418c503ECE5dC5c9dd2dd6B978')
  await lock.init()

  const hasValidKey = await lock.getHasValidKey()

  if (hasValidKey) {
    log("has key")
  } else {
    log("doesn't have key")
  }

  const unlockPurchaseUI = new UnlockPurchaseUI(
    lock,
    'images/unlock-logo-black.png',
    'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.',
    () => {
      log('purchase success!')
    },
    () => {
      log('purchase fail!')
    },
    () => {
      log('transaction success!')
    },
    () => {
      log('transaction fail!')
    }
  )

  unlockPurchaseUI.show()
})
