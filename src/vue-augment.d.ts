import type { Emitter } from 'mitt'

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $bus: Emitter<Record<string, any>>
  }
}

export {}
