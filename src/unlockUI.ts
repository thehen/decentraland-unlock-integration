import * as ui from '@dcl/ui-scene-utils'
import * as unlock from './unlock'

export class UnlockPurchaseUI {

    public lock: unlock.Lock
    public logoUrl: string
    public bodyText: string

    private prompt: ui.CustomPrompt

    constructor(
        lock: unlock.Lock,
        logoUrl: string,
        bodyText: string
    ) {
        this.lock = lock
        this.logoUrl = logoUrl
        this.bodyText = bodyText
        this.prompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT)
        this.populatePrompt()
        this.prompt.hide()
    }

    private populatePrompt = async () => {
        this.prompt.addIcon(this.logoUrl, 0, 120, 200, 43);
        this.prompt.addText(this.bodyText, 0, 30, new Color4(0.5, 0.5, 0.5, 1), 13)
        this.prompt.addText('Powered by Unlock', 0, -120, new Color4(0.5, 0.5, 0.5, 1), 10)

        let button1 = this.prompt.addButton(
            'Purchase',
            0,
            -90,
            async () => {
                button1.hide()
                this.prompt.addText('Loading...', 0, -75, new Color4(0.75, 0.75, 0.75, 1), 12)
                let success = await this.lock.purchaseMembership()
                this.prompt.hide()
                //onComplete(success)
            },
            ui.ButtonStyles.E
        )

        //let price = await this.lock.getPrice();
        //let symbol = await this.lock.getSymbol();
        //this.prompt.addText('Price: ' + price + ' ' + symbol, 0, -20, new Color4(0.75, 0.75, 0.75, 1), 18)
    }

    public show = async () => {
        this.prompt.show()
    }

    public hide = async () => {
        this.prompt.hide()
    }
}