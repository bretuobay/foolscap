import { defineComponent, h } from 'vue'
import { render } from '@testing-library/vue'

export function renderComposable<T>(composable: () => T) {
  let latest!: T

  const Comp = defineComponent({
    name: 'RenderComposable',
    setup() {
      latest = composable()
      return () => h('div')
    },
  })

  const view = render(Comp)

  return {
    get result() {
      return latest
    },
    unmount: view.unmount,
  }
}
