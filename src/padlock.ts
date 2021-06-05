import { UnlockPurchaseUI } from './unlockUI'
import { Lock } from './unlock'

export class PadLock extends Entity {
  public lockAddress: string
  public logoUrl: string
  public bodyText: string

  onPurchaseSuccess: () => void
  onPurchaseFail: () => void
  onTransactionSuccess: () => void
  onTransactionFail: () => void

  constructor(
    lockAddress: string,
    logoUrl: string,
    bodyText: string,
    onPurchaseSuccess: () => void,
    onPurchaseFail: () => void,
    onTransactionSuccess: () => void,
    onTransactionFail: () => void,
  ) {

    super()

    this.lockAddress = lockAddress
    this.logoUrl = logoUrl
    this.bodyText = bodyText

    this.onPurchaseSuccess = onPurchaseSuccess
    this.onPurchaseFail = onPurchaseFail
    this.onTransactionSuccess = onTransactionSuccess
    this.onTransactionFail = onTransactionFail

    // Create and add a `Transform` component to that entity
    this.addComponent(new Transform())

    // Set the fields in the component
    this.getComponent(Transform).position.set(3, 1, 3)

    // Create and apply a `BoxShape` component to give the entity a visible form
    this.addComponent(new BoxShape())

    //padlock.addComponent(paid_lever_Model)
    this.createLock()
  }

  public createLock = async () => {
    const lock = new Lock(this.lockAddress)
    await lock.init()

    const isvalid = await lock.getHasValidKey()
    log("valid key:" + isvalid)

    const symbol = await lock.getSymbol()
    log("symbol: " + symbol)

    const price = await lock.getPrice()
    log("price: " + price)

    const unlockPurchaseUI = new UnlockPurchaseUI(lock, this.logoUrl, this.bodyText)

    // Add OnClick events to the padlock
    this.addComponent(
      new OnClick(() => {
        unlockPurchaseUI.show()
      })
    )
  }
}