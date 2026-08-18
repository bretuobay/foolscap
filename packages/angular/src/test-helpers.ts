import { TestBed } from '@angular/core/testing'
import { render as atlRender } from '@testing-library/angular'

/** Reset TestBed so sequential renders in one test can reconfigure the module. */
export async function render(
  ...args: Parameters<typeof atlRender>
): ReturnType<typeof atlRender> {
  TestBed.resetTestingModule()
  return atlRender(...args)
}
