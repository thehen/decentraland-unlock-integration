import { Lock } from './unlock'
import { UnlockPurchaseUI } from './unlockUI'

executeTask(async () => {

  const lock = new Lock('0x07291E2861dC4e9856f021Ee3561040da9c5d04C')
  await lock.init()

  const hasValidKey = await lock.getHasValidKey()

  if (hasValidKey) {

  } else {

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
