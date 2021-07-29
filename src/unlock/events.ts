import { Lock } from './unlock'

// Initialise event manager
export const eventManager = new EventManager()

@EventConstructor()
export class LockInitialised {
    lock: Lock
    hasValidKey: Boolean
    constructor(public _lock: Lock, public _hasValidKey: Boolean) {
        this.lock = _lock
        this.hasValidKey = _hasValidKey
    }
}

@EventConstructor()
export class PurchaseSuccess {
    lock: Lock
    constructor(public _lock: Lock) {
        this.lock = _lock
    }
}

@EventConstructor()
export class PurchaseFail {
    lock: Lock
    constructor(public _lock: Lock) {
        this.lock = _lock
    }
}

@EventConstructor()
export class TransactionSuccess {
    lock: Lock
    constructor(public _lock: Lock) {
        this.lock = _lock
    }
}

@EventConstructor()
export class TransactionFail {
    lock: Lock
    constructor(public _lock: Lock) {
        this.lock = _lock
    }
}

@EventConstructor()
export class ApprovalSuccess {
    lock: Lock
    constructor(public _lock: Lock) {
        this.lock = _lock
    }
}

@EventConstructor()
export class ApprovalFail {
    lock: Lock
    constructor(public _lock: Lock) {
        this.lock = _lock
    }
}