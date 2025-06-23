// Tipado para 'viz.js'
declare module "viz.js" {
  interface VizOptions {
    format?: string
    engine?: string
  }

  class Viz {
    constructor(options?: { Module?: any; render?: any })
    renderString(src: string, options?: VizOptions): Promise<string>
  }

  export default Viz
}

// Tipado para 'viz.js/full.render.js'
declare module "viz.js/full.render.js" {
  export const Module: any
  export const render: any
}

// Tipado para '@hpcc-js/wasm'
declare module "@hpcc-js/wasm" {
  export class Graphviz {
    static load(): Promise<Graphviz>
    dot(src: string): string
  }
}
