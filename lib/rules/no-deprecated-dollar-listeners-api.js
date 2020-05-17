/**
 * @author Yosuke Ota
 * See LICENSE file in root directory for full license.
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

const utils = require('../utils')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      description: 'disallow using deprecated `$listeners` (in Vue.js 3.0.0+)',
      categories: ['vue3-essential'],
      url: 'https://eslint.vuejs.org/rules/no-deprecated-dollar-listeners-api.html'
    },
    fixable: null,
    schema: [],
    messages: {
      deprecated: 'The `$listeners` is deprecated.'
    }
  },

  create (context) {
    return utils.defineTemplateBodyVisitor(
      context,
      {
        'VExpressionContainer' (node) {
          for (const reference of node.references) {
            if (reference.variable != null) {
              // Not vm reference
              continue
            }
            if (reference.id.name === '$listeners') {
              context.report({
                node: reference.id,
                messageId: 'deprecated'
              })
            }
          }
        }
      },
      utils.defineVueVisitor(context,
        {
          'MemberExpression > ThisExpression' (node) {
            if (node.parent.property.name !== '$listeners') return

            context.report({
              node: node.parent.property,
              messageId: 'deprecated'
            })
          }
        }
      )
    )
  }
}