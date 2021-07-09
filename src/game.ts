import { Lock } from './unlock/unlock'
import { UnlockPurchaseUI } from './unlock/unlockUI'
import * as events from "./unlock/events"

const decentralandLock = new Lock('0xBcb88eA834C300418c503ECE5dC5c9dd2dd6B978')

events.eventManager.addListener(events.LockInitialised, "lockinitialised", ({ lock, hasValidKey }) => {
  if (hasValidKey) {
    log("has key")
  } else {
    log("doesn't have key")

    const unlockPurchaseUI = new UnlockPurchaseUI(
      decentralandLock,
      'images/unlock-logo-black.png',
      'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.'
    )

    unlockPurchaseUI.show()

  }
})