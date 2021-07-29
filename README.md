
<div align="center">
  <img src="https://github.com/thehen/decentraland-unlock-integration/blob/readme/docs/img/logo.png?raw=true"><br><br>
  <h1>
    Unlock Protocol Decentraland Integration
  </h1>

<p align="center">
  <a href="https://badge.fury.io/js/%40thehen%2Fdecentraland-unlock-integration"><img src="https://badge.fury.io/js/%40thehen%2Fdecentraland-unlock-integration.svg" alt="npm version" height="18"></a>
  <a href="https://badge.fury.io/js/%40thehen%2Fdecentraland-unlock-integration"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License Apache 2.0" height="18"></a>
</p>

  <p>Add paid memberships and content access to your Decentraland scenes.</p>
</div>

<p align="center">
  <a href="#overview">Overview</a> •
  <a href="#live-demo">Live demo</a> •
  <a href="#features">Features</a> •
  <a href="#create-locks">Create Locks</a> •
  <a href="#adding-the-unlock-library">Adding the Unlock Library</a> •
  <a href="#adding-ui">Adding UI</a> •
  <a href="#listening-for-events">Listening for events</a> •
  <a href="#complete-example">Complete example</a> •
  <a href="#support">Support</a>
</p>

![demo](https://github.com/thehen/decentraland-unlock-integration/blob/readme/docs/img/demo.gif?raw=true)

## Overview

Create locks and place them anywhere you’d like to lock content. Users can purchase memberships as NFT keys that grant access to content inside Decentraland.

## Live demo

<a href="https://play.decentraland.org/?position=39,-64"><img src="https://github.com/thehen/decentraland-unlock-integration/blob/readme/docs/img/playdemo.png?raw=true" alt="Play demo"></a>

In the live demo, there's a members-only saloon with a cowboy outside who won't grant access unless you have a membership. Upon buying a membership with 0.1 MANA, you are allowed to enter the saloon.

## Features 
- Accept payment in MANA or any other ERC20 token
- Set a limited or unlimited number of keys 
- Set duration for how long the keys last for
- Native UI utilising the Decentraland UI library

## Create Locks

You can easily create and manage locks through the Unlock Dashboard. For more information, refer to the [official Unlock Protocol documentation](https://docs.unlock-protocol.com/creators/deploying-lock).


## Adding the Unlock Library

1. Install the Unlock Integration as an npm package. Run this command in your scene's project folder:

```typescript
npm i @thehen/decentraland-unlock-integration @dcl/ecs-scene-utils @dcl/crypto-scene-utils @dcl/ui-scene-utils eth-connect -B
```

> Note: This command also installs the latest version of the @dcl/ecs-scene-utils, @dcl/crypto-scene-utils, @dcl/ui-scene-utils and eth-connect libraries, that are dependencies of this library

2. Run `dcl start` or `dcl build` so the dependencies are correctly installed.

> Note: After running `dcl start` you must have Metamask or Dapper open and you must add the following string to the end of the URL: `&ENABLE_WEB3`

3. Import the library into the scene's script. Add this line at the start of your `game.ts` file, or any other TypeScript files that require it:

```typescript
import * as unlock from '@thehen/decentraland-unlock-integration'
```

## Adding Locks to Scenes

Instantiate a new `Lock` object as follows:

```typescript
const decentralandLock = new unlock.Lock('0xF0cF2b4f9AfA8701Ca8d87502E14be5C855eA70e')
```

Next we add a listener to the Unlock event manager which listens for the `LockInitialised` event:

```typescript
unlock.eventManager.addListener(unlock.LockInitialised, "unlockInit", ({ lock, hasValidKey }) => {
    /// Lock initialised!
})
```
To test whether purchasing a lock works, we can call the `purchaseMembership` function after the lock is initialised:
```typescript
unlock.eventManager.addListener(unlock.LockInitialised, "unlockInit", ({ lock, hasValidKey }) => {
    /// Lock initialised!
    decentralandLock.purchaseMembership()
})
```
Congratulations! You've added your first lock to Decentraland! Now let's add some UI.

## Adding UI

![ui](https://github.com/thehen/decentraland-unlock-integration/blob/readme/docs/img/ui.jpg?raw=true)

To show a popup UI, you first need to create an `UnlockPurchaseUI` object with the following properties:

- `lock`: The lock object instance
- `logoUrl`: The image url for the logo image
- `bodyText`: The body text to display on the popup

```typescript
unlockPurchaseUI = new unlock.UnlockPurchaseUI(
  decentralandLock,
  'https://raw.githubusercontent.com/thehen/decentraland-unlock-integration/master/images/unlock-logo-black.png',
  'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.'
)
```
To show and hide the UI, you can call the `show` and `hide` functions on the `UnlockPurchaseUI` object:

```typescript
unlockPurchaseUI.show()
```

```typescript
unlockPurchaseUI.hide()
```

## Listening for events

After a purchase has begun, you can listen for [custom events](https://docs.decentraland.org/development-guide/custom-events/) and have your scene respond accordingly. These are the events available:

- `LockInitialised`: lock is initialised 
- `PurchaseSuccess`: purchase was completed successfully
- `PurchaseFail`: purchase failed
- `TransactionSuccess`: transaction was successful
- `TransactionFail`: transaction failed

```typescript
// Events

unlock.eventManager.addListener(unlock.LockInitialised, "init", ({ lock, hasValidKey }) => {
    if (hasValidKey) {
        // already owns key
    } else {
        // doesn't own key
    }
})

unlock.eventManager.addListener(unlock.PurchaseSuccess, "purchase success", ({ lock }) => {
    // purchase successful
})

unlock.eventManager.addListener(unlock.PurchaseFail, "purchase fail", ({ lock }) => {
    // purchase fail
})

unlock.eventManager.addListener(unlock.TransactionSuccess, "transaction success", ({ lock }) => {
    // transaction success
})

unlock.eventManager.addListener(unlock.TransactionFail, "transaction fail", ({ lock }) => {
    // transaction fail
})
```

## Complete example

```typescript
import * as unlock from '@thehen/decentraland-unlock-integration'

// --- Unlock ---

// Add a lock
const decentralandLock = new unlock.Lock('0x9625Bc447d23117e22105B77FAC015F6B970f0C0')

// Lock initialised
unlock.eventManager.addListener(unlock.LockInitialised, "unlockInit", ({ lock, hasValidKey }) => {

  if (hasValidKey) {
    // already owns key 
  } else {
    // doesn't own key

    // Instantiate Unlock UI object
    const unlockPurchaseUI = new unlock.UnlockPurchaseUI(
      decentralandLock,
      'https://raw.githubusercontent.com/thehen/decentraland-unlock-integration/master/images/unlock-logo-black.png',
      'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.'
    )

    // Show UI 
    unlockPurchaseUI.show()

  }
})

// --- Events ---

unlock.eventManager.addListener(unlock.PurchaseSuccess, "purchase success", ({ lock }) => {
  log("Purchase success")
})

unlock.eventManager.addListener(unlock.PurchaseFail, "purchase fail", ({ lock }) => {
  log("Purchase failed")
})

unlock.eventManager.addListener(unlock.TransactionSuccess, "transaction success", ({ lock }) => {
  log("Transaction success")
})

unlock.eventManager.addListener(unlock.TransactionFail, "transaction fail", ({ lock }) => {
  log("Transaction failed")
})

```

## Support

If you have any questions, feel free to join the [Unlock Discord Server](https://docs.unlock-protocol.com/creators/plugins-and-integrations/discord) and I'll be happy to help.