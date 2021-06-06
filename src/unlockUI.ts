import * as ui from '@dcl/ui-scene-utils'
import * as unlock from './unlock'

export class UnlockPurchaseUI {

    public lock: unlock.Lock
    public logoUrl: string
    public bodyText: string

    private purchasePrompt: ui.CustomPrompt

    private unlockFailedUI: UnlockFailedUI

    constructor(
        lock: unlock.Lock,
        logoUrl: string,
        bodyText: string
    ) {
        this.lock = lock
        this.logoUrl = logoUrl
        this.bodyText = bodyText
        this.purchasePrompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT, undefined, undefined, true)

        this.unlockFailedUI = new UnlockFailedUI("Purchase Failed", "The purchase failed. Please try again.")
        this.populatePrompt()
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
                const hash = await this.lock.purchaseMembership()
                button1.show()
                loadingText.hide()
                this.purchasePrompt.hide()
                if (hash !== null) {
                    // success
                    const success = await this.lock.waitForTransactionConfirmation(hash)
                    if (success) {
                        log("transaction success!")
                    }
                } else {
                    // fail
                    this.unlockFailedUI.show()
                }

                //onComplete(success)
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

export class UnlockFailedUI {

    public titleText: string
    public bodyText: string

    private prompt: ui.CustomPrompt

    constructor(
        titleText: string,
        bodyText: string
    ) {
        this.titleText = titleText
        this.bodyText = bodyText
        this.prompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT, 350, 180, true)
        this.populatePrompt()
    }

    private populatePrompt = async () => {
        this.prompt.addText(this.titleText, 0, 60, new Color4(0.25, 0.25, 0.25, 1), 16)
        this.prompt.addText(this.bodyText, 0, 30, new Color4(0.5, 0.5, 0.5, 1), 13)

        let button1 = this.prompt.addButton(
            'Ok',
            0,
            -40,
            async () => {
                this.prompt.hide()
            },
            ui.ButtonStyles.E
        )

    }

    public show = async () => {
        this.prompt.show()
    }

    public hide = async () => {
        this.prompt.hide()
    }
}