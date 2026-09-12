export const rules = {
  'kebab-case-filenames': {
    meta: { type: 'suggestion' },
    create(context) {
      return {
        Program(node) {
          const filename = context.filename.split('/').pop() ?? ''
          if (filename !== filename.toLowerCase() || /[_ ]/.test(filename)) {
            context.report({ node, message: 'Source filenames must use kebab-case.' })
          }
        }
      }
    }
  }
}

export default { rules }
