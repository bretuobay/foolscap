// jsdom shims for browser APIs not implemented in jsdom

// Shim HTMLDialogElement.showModal / close / open
if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {
      this.setAttribute('open', '')
      this.open = true
    }
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {
      this.removeAttribute('open')
      this.open = false
      this.dispatchEvent(new Event('close'))
    }
  }
}

// Shim requestAnimationFrame synchronously for test predictability
if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number
  }
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id)
}

// Shim HTMLElement.showPopover / hidePopover (Popover API)
const htmlProto = HTMLElement.prototype as unknown as Record<string, unknown>
if (!htmlProto['showPopover']) {
  htmlProto['showPopover'] = function (this: HTMLElement) {
    this.removeAttribute('hidden')
  }
}
if (!htmlProto['hidePopover']) {
  htmlProto['hidePopover'] = function (this: HTMLElement) {
    this.setAttribute('hidden', '')
  }
}
