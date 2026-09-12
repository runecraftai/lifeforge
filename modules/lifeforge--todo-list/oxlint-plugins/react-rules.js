/** Custom rules consumed by the module lint configuration. */
export const rules = {
  'no-arrow-component': {
    meta: { type: 'suggestion' },
    create(context) {
      return {
        VariableDeclarator(node) {
          if (node.id?.name?.[0] === node.id.name?.[0]?.toUpperCase() &&
              (node.init?.type === 'ArrowFunctionExpression' || node.init?.type === 'FunctionExpression')) {
            context.report({ node, message: 'Components must use a function declaration.' })
          }
        }
      }
    }
  }
}

export default { rules }
