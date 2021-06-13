import * as ui from '@dcl/ui-scene-utils'
import * as unlock from './unlock'
import { Lock } from './unlock'

export class UnlockPurchaseUI {

    public lock: unlock.Lock
    public logoUrl: string
    public bodyText: string

    onPurchaseSuccess: () => void
    onPurchaseFail: () => void
    onTransactionSuccess: () => void
    onTransactionFail: () => void

    private purchasePrompt: ui.CustomPrompt

    constructor(
        lock: unlock.Lock,
        logoUrl: string,
        bodyText: string,

        onPurchaseSuccess: () => void,
        onPurchaseFail: () => void,
        onTransactionSuccess: () => void,
        onTransactionFail: () => void
    ) {
        this.logoUrl = logoUrl
        this.bodyText = bodyText
        this.lock = lock

        this.onPurchaseSuccess = onPurchaseSuccess
        this.onPurchaseFail = onPurchaseFail
        this.onTransactionSuccess = onTransactionSuccess
        this.onTransactionFail = onTransactionFail

        this.purchasePrompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT, undefined, undefined, true)

        this.init()
    }

    private init = async () => {
        await this.lock.init()
        await this.populatePrompt()
    }

    private populatePrompt = async () => {
        this.purchasePrompt.addIcon(this.logoUrl, 0, 120, 200, 43);
        this.purchasePrompt.addText(this.bodyText, 0, 30, new Color4(0.5, 0.5, 0.5, 1), 13)
        this.purchasePrompt.addText('Powered by Unlock', 0, -120, new Color4(0.5, 0.5, 0.5, 1), 10)

        let loadingText = this.purchasePrompt.addText('Loading...', 0, -75, new Color4(0.75, 0.75, 0.75, 1), 12)
        loadingText.hide()

        let button1 = this.purchasePrompt.addButton(
            'Purchase',
            0,
            -90,
            async () => {
                button1.hide()
                loadingText.show()
                let hash = null
                hash = await this.lock.purchaseMembership()
                this.onPurchaseSuccess()
                button1.show()
                loadingText.hide()
                this.purchasePrompt.hide()

                if (hash !== null) {
                    const reciept = await this.lock.waitForTransactionConfirmation(hash)
                    if (reciept?.status == '0x1') {
                        this.onTransactionSuccess()
                    } else {
                        this.onTransactionFail()
                    }
                } else {
                    this.onPurchaseFail()
                }
            },
            ui.ButtonStyles.E
        )

        let price = await this.lock.getPrice();
        let symbol = await this.lock.getSymbol();
        this.purchasePrompt.addText('Price: ' + price + ' ' + symbol, 0, -20, new Color4(0.75, 0.75, 0.75, 1), 18)
    }

    public show = async () => {
        this.purchasePrompt.show()
    }

    public hide = async () => {
        this.purchasePrompt.hide()
    }
}

