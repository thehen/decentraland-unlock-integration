import * as ui from '@dcl/ui-scene-utils'
import { getPrice, getSymbol, purchaseMembership } from './purchaseMembership'

export const showUnlockUI = async (lockAddress: string, logoUrl: string, bodyText: string, onComplete: (success: boolean) => void) => {

  let success = false;

  let prompt = new ui.CustomPrompt(ui.PromptStyles.LIGHT)

  let price = await getPrice(lockAddress);
  let symbol = await getSymbol(lockAddress);

  prompt.addIcon(logoUrl, 0, 120, 200, 43);
  prompt.addText(bodyText, 0, 30, new Color4(0.5, 0.5, 0.5, 1), 13)
  prompt.addText('Price: ' + price + ' ' + symbol, 0, -20, new Color4(0.75, 0.75, 0.75, 1), 18)
  prompt.addText('Powered by Unlock', 0, -120, new Color4(0.5, 0.5, 0.5, 1), 10)

  let button1 = prompt.addButton(
    'Purchase',
    0,
    -90,
    async () => {
      button1.hide()
      prompt.addText('Loading...', 0, -75, new Color4(0.75, 0.75, 0.75, 1), 12)
      success = await purchaseMembership(lockAddress)
      prompt.hide()
      onComplete(success)
    },
    ui.ButtonStyles.E
  )


}