
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
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#download">Download</a> •
  <a href="#credits">Credits</a> •
  <a href="#related">Related</a> •
  <a href="#license">License</a>
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
- Native feeling UI utilising the Decentraland UI library
- Decoupled code using Decentraland custom events

## Create Locks

You can easily create and manage locks through the Unlock Dashboard. For more information, refer to the [official Unlock Protocol documentation](https://docs.unlock-protocol.com/creators/deploying-lock).


## Adding the Unlock Library

1. Install the Unlock Integration as an npm package. Run this command in your scene's project folder:

```
npm i @thehen/decentraland-unlock-integration @dcl/ecs-scene-utils eth-connect -B
```

> Note: This command also installs the latest version of the @dcl/ecs-scene-utils and eth-connect libraries, that are dependencies of the crypto utils library

2. Run `dcl start` or `dcl build` so the dependencies are correctly installed.

3. Import the library into the scene's script. Add this line at the start of your `game.ts` file, or any other TypeScript files that require it:

```
import * as unlock from '@thehen/decentraland-unlock-integration'
```

## Adding Locks to Scenes

Create a new `Lock` instance as follows:

```
export const decentralandLock = new unlock.Lock('0xF0cF2b4f9AfA8701Ca8d87502E14be5C855eA70e')
```

Next we add a listener to the Unlock event manager which listens for `LockInitialised` event:

```
unlock.eventManager.addListener(unlock.LockInitialised, "unlockInit", ({ lock, hasValidKey }) => {
    /// Lock initialised!
})
```
To quickly test whether purchasing a lock works, we can call the `purchaseMembership` function after the lock is initialised:
```
unlock.eventManager.addListener(unlock.LockInitialised, "unlockInit", ({ lock, hasValidKey }) => {
    /// Lock initialised!
    decentralandLock.purchaseMembership()
})
```
Congratulations! You've added your first lock to Decentraland! Now let's make it look good.

## Adding UI

![ui](https://github.com/thehen/decentraland-unlock-integration/blob/readme/docs/img/ui.jpg?raw=true)

To show a popup UI, you first need to create an `UnlockPurchaseUI` object. :

- `lock`: The lock instance
- `logoUrl`: The image url for the logo image
- `bodyText`: The body text to display on the popup

```
unlockPurchaseUI = new unlock.UnlockPurchaseUI(
    decentralandLock,
    'https://raw.githubusercontent.com/thehen/decentraland-unlock-integration/master/images/unlock-logo-black.png',
    'Unlock lets you easily offer paid memberships to your \n website or application. On this website, members \n can leave comments and participate in discussion. \n It is free to try! Just click "purchase" below.'
)
```
ddfddgfdfg
```
unlockPurchaseUI.show()
```

```
unlockPurchaseUI.hide()
```

## Listening for events



<br><br><br><br><br><br><br><br>


## Unlock Protocol Decentraland Integration

A simple interactive scene with a locked door preventing access to a building. Once a membership is purchased through Unlock Protocol, you are granted access to the building.

## Try it out

**Install the CLI**

Download and install the Decentraland CLI by running the following command:

```bash
npm i -g decentraland
```

**Previewing the scene**

Download this example and navigate to its directory, then run:

```
$:  dcl start
```

Any dependencies are installed and then the CLI opens the scene in a new browser tab.

To then enable web3, append `?ENABLE_WEB3` to the url.
