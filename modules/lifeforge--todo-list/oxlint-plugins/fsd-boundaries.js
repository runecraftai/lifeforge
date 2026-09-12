const layerOrder = ['app', 'pages', 'features', 'entities', 'shared']

export const rules = {
  'fsd-import-boundary': {
    meta: { type: 'problem' },
    create(context) {
      return {
        ImportDeclaration(node) {
          const source = node.source.value
          if (!source.startsWith('@/')) return
          const current = layerOrder.find(layer => context.filename.includes(`/src/${layer}/`))
          const imported = layerOrder.find(layer => source.startsWith(`@/${layer}/`))
          if (current && imported && layerOrder.indexOf(imported) < layerOrder.indexOf(current)) {
            context.report({ node, message: `Invalid FSD import: ${current} cannot import ${imported}.` })
          }
        }
      }
    }
  }
}

export default { rules }
