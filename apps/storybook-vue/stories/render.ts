import type { VNode } from 'vue'

/** Storybook Vue 3 render wrapper for `defineComponent` + `h()` trees. */
export function renderStory(fn: () => VNode) {
  return () => ({
    setup() {
      return fn
    },
  })
}
