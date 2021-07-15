import * as ui from '@dcl/ui-scene-utils'
import * as unlock from './unlock'
import * as events from "./events"

export class UnlockPurchaseUI {

    public lock: unlock.Lock
    public logoUrl: string
    public bodyText: string

    private purchasePrompt: ui.CustomPrompt
    private purchaseButton: ui.CustomPromptButton
    private loadingText: ui.CustomPromptText


    constructor(
        lock: unlock.Lock,
        logoUrl: string,
        bodyText: string,
    ) {
        this.logoUrl = logoUrl
        this.bodyText = bodyText
        this.lock = lock

        this.purchasePrompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT, undefined, undefined, true)

        this.init()
    }

    private init = async () => {
        if (!this.lock.isInitialised) {
            throw new Error("Lock is not initialised! Ensure you subscribe to the LockInitialised event!");
        }
        await this.populatePrompt()

        events.eventManager.addListener(events.PurchaseFail, "unlockUIFail" + this.lock.lockAddress, ({ lock }) => {
            if (lock == this.lock) {
                this.resetAndHidePrompt()
            }
        })

        events.eventManager.addListener(events.PurchaseSuccess, "unlockUISuccess" + this.lock.lockAddress, ({ lock }) => {
            if (lock == this.lock) {
                this.resetAndHidePrompt()
            }
        })
    }

    private resetAndHidePrompt = async () => {
        this.purchaseButton.show()
        this.loadingText.hide()
        this.purchasePrompt.hide()
    }

    private showLoadingText = async () => {
        this.purchaseButton.hide()
        this.loadingText.show()
    }

    private populatePrompt = async () => {
        this.purchasePrompt.addIcon(this.logoUrl, 0, 120, 200, 43);
        this.purchasePrompt.addText(this.bodyText, 0, 30, new Color4(0.5, 0.5, 0.5, 1), 13)
        this.purchasePrompt.addText('Powered by Unlock', 0, -120, new Color4(0.5, 0.5, 0.5, 1), 10)

        this.loadingText = this.purchasePrompt.addText('Loading...', 0, -75, new Color4(0.75, 0.75, 0.75, 1), 12)
        this.loadingText.hide()

        this.purchaseButton = this.purchasePrompt.addButton(
            'Purchase',
            0,
            -90,
            async () => {
                this.showLoadingText()
                await this.lock.purchaseMembership()

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

