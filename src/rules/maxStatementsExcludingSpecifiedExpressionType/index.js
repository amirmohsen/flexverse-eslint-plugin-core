const lodash = require("lodash");
const astUtils = require("eslint/lib/rules/utils/ast-utils");

module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description:
        "enforce a maximum number of statements allowed in function blocks excluding specified expression type",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://eslint.org/docs/rules/max-statements",
    },

    schema: [
      {
        oneOf: [
          {
            type: "integer",
            minimum: 0,
          },
          {
            type: "object",
            properties: {
              maximum: {
                type: "integer",
                minimum: 0,
              },
              max: {
                type: "integer",
                minimum: 0,
              },
            },
            additionalProperties: false,
          },
        ],
      },
      {
        type: "object",
        properties: {
          ignoreTopLevelFunctions: {
            type: "boolean",
          },
        },
        additionalProperties: false,
      },
      {
        type: "object",
        properties: {
          ignoreExpressionType: {
            type: "string",
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      exceedDefault:
        "{{name}} has too many statements ({{count}}). Maximum allowed is {{max}}.",
      exceedWithexcluded:
        '{{name}} has too many "non-{{excludedExpression}}" statements ({{count}}). Maximum allowed is {{max}}.',
    },
  },

  create(context) {
    //--------------------------------------------------------------------------
    // Helpers
    //--------------------------------------------------------------------------

    const functionStack = [],
      ExcludeExpressionStack = [],
      option = context.options[0],
      ignoreTopLevelFunctions =
        (context.options[1] && context.options[1].ignoreTopLevelFunctions) ||
        false,
      topLevelFunctions = [],
      ignoreExpressionType =
        (context.options[1] && context.options[1].ignoreExpressionType) || "";
    let maxStatements = 10;

    if (
      typeof option === "object" &&
      (Object.prototype.hasOwnProperty.call(option, "maximum") ||
        Object.prototype.hasOwnProperty.call(option, "max"))
    ) {
      maxStatements = option.maximum || option.max;
    } else if (typeof option === "number") {
      maxStatements = option;
    }

    /**
     * Reports a node if it has too many statements
     * @param {ASTNode} node node to evaluate
     * @param {int} count Number of statements in node
     * @param {int} max Maximum number of statements allowed
     * @returns {void}
     * @private
     */
    function reportIfTooManyStatements(node, count, max, ignoreExpressionType) {
      console.log(ignoreExpressionType);
      const counter = ignoreExpressionType
        ? count - ExcludeExpressionStack.length
        : count;
      if (counter > max) {
        const name = "";

        const messageId = ignoreExpressionType
          ? "exceedWithexcluded"
          : "exceedDefault";

        context.report({
          node,
          messageId,
          data: {
            name,
            count: counter,
            max,
            excludedExpression: ignoreExpressionType,
          },
        });
      }
    }

    /**
     * When parsing a new function, store it in our function stack
     * @returns {void}
     * @private
     */
    function startFunction() {
      functionStack.push(0);
    }

    /**
     * Evaluate the node at the end of function
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function endFunction(node) {
      const count = functionStack.pop();

      if (ignoreTopLevelFunctions && functionStack.length === 0) {
        topLevelFunctions.push({ node, count });
      } else {
        reportIfTooManyStatements(
          node,
          count,
          maxStatements,
          ignoreExpressionType
        );
      }
    }

    /**
     * Increment the count of the functions
     * @param {ASTNode} node node to evaluate
     * @returns {void}
     * @private
     */
    function countStatements(node) {
      functionStack[functionStack.length - 1] += node.body.length;
    }

    function countExcluded(node) {
      if (
        ignoreExpressionType &&
        node.callee.object.name === ignoreExpressionType
      ) {
        ExcludeExpressionStack.push(0);
      }
    }

    //--------------------------------------------------------------------------
    // Public API
    //--------------------------------------------------------------------------

    return {
      FunctionDeclaration: startFunction,
      FunctionExpression: startFunction,
      ArrowFunctionExpression: startFunction,

      BlockStatement: countStatements,
      CallExpression: countExcluded,

      "FunctionDeclaration:exit": endFunction,
      "FunctionExpression:exit": endFunction,
      "ArrowFunctionExpression:exit": endFunction,

      "Program:exit"() {
        if (topLevelFunctions.length === 1) {
          return;
        }

        topLevelFunctions.forEach((element) => {
          const count = element.count;
          const node = element.node;

          reportIfTooManyStatements(
            node,
            count,
            maxStatements,
            ignoreExpressionType
          );
        });
      },
    };
  },
};
