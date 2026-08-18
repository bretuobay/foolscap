import '@angular/compiler'
import '@analogjs/vitest-angular/setup-zone'
import '@testing-library/jest-dom/vitest'
import { getTestBed } from '@angular/core/testing'
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing'
import { afterEach } from 'vitest'

getTestBed().initTestEnvironment(BrowserDynamicTestingModule, platformBrowserDynamicTesting())

afterEach(() => {
  document.body.innerHTML = ''
})

if (typeof HTMLDialogElement !== 'undefined') {
  if (!HTMLDialogElement.prototype.show) {
    HTMLDialogElement.prototype.show = function () {
      this.setAttribute('open', '')
      this.open = true
    }
  }
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

if (typeof globalThis.requestAnimationFrame === 'undefined') {
  globalThis.requestAnimationFrame = (cb: FrameRequestCallback) => {
    return setTimeout(() => cb(Date.now()), 0) as unknown as number
  }
  globalThis.cancelAnimationFrame = (id: number) => clearTimeout(id)
}
