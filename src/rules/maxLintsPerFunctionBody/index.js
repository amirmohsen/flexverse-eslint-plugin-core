"use strict";

const astUtils = require("eslint/lib/rules/utils/ast-utils");

const lodash = require("lodash");

const OPTIONS_SCHEMA = {
  type: "object",
  properties: {
    max: {
      type: "integer",
      minimum: 0,
    },
    skipComments: {
      type: "boolean",
    },
    skipBlankLines: {
      type: "boolean",
    },
    IIFEs: {
      type: "boolean",
    },
  },
  additionalProperties: false,
};

const OPTIONS_OR_INTEGER_SCHEMA = {
  oneOf: [
    OPTIONS_SCHEMA,
    {
      type: "integer",
      minimum: 1,
    },
  ],
};

function getCommentLineNumbers(comments) {
  const map = new Map();

  comments.forEach((comment) => {
    for (let i = comment.loc.start.line; i <= comment.loc.end.line; i++) {
      map.set(i, comment);
    }
  });
  return map;
}

module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "enforce a maximum number of lines of code in a function",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://eslint.org/docs/rules/max-lines-per-function",
    },

    schema: [OPTIONS_OR_INTEGER_SCHEMA],
    messages: {
      exceed:
        "{{name}} has too many lines ({{lineCount}}). Maximum allowed is {{maxLines}}.",
    },
  },

  create(context) {
    const sourceCode = context.getSourceCode();
    const lines = sourceCode.lines;

    const option = context.options[0];
    let maxLines = 50;
    let skipComments = false;
    let skipBlankLines = false;
    let IIFEs = false;

    if (typeof option === "object") {
      maxLines = typeof option.max === "number" ? option.max : 50;
      skipComments = !!option.skipComments;
      skipBlankLines = !!option.skipBlankLines;
      IIFEs = !!option.IIFEs;
    } else if (typeof option === "number") {
      maxLines = option;
    }

    const commentLineNumbers = getCommentLineNumbers(
      sourceCode.getAllComments()
    );

    function isFullLineComment(line, lineNumber, comment) {
      const start = comment.loc.start,
        end = comment.loc.end,
        isFirstTokenOnLine =
          start.line === lineNumber && !line.slice(0, start.column).trim(),
        isLastTokenOnLine =
          end.line === lineNumber && !line.slice(end.column).trim();

      return (
        comment &&
        (start.line < lineNumber || isFirstTokenOnLine) &&
        (end.line > lineNumber || isLastTokenOnLine)
      );
    }

    function isIIFE(node) {
      return (
        (node.type === "FunctionExpression" ||
          node.type === "ArrowFunctionExpression") &&
        node.parent &&
        node.parent.type === "CallExpression" &&
        node.parent.callee === node
      );
    }

    function isEmbedded(node) {
      if (!node.parent) {
        return false;
      }
      if (node !== node.parent.value) {
        return false;
      }
      if (node.parent.type === "MethodDefinition") {
        return true;
      }
      if (node.parent.type === "Property") {
        return (
          node.parent.method === true ||
          node.parent.kind === "get" ||
          node.parent.kind === "set"
        );
      }
      return false;
    }

    function getFunctionBodyLines(node) {
      let body;

      if (["MethodDefinition", "Property"].includes(node.type)) {
        body = node.value.body.body;
      } else if (node.body.body) {
        body = node.body.body;
      } else {
        body = [node.body];
      }

      if (!body.length) {
        return {
          startLine: 1,
          endLine: 0,
        };
      }

      return {
        startLine: body[0].loc.start.line,
        endLine: body[body.length - 1].loc.end.line,
      };
    }

    function processFunction(funcNode) {
      const node = isEmbedded(funcNode) ? funcNode.parent : funcNode;
      const { startLine, endLine } = getFunctionBodyLines(node);

      if (!IIFEs && isIIFE(node)) {
        return;
      }

      let lineCount = 0;

      for (let i = startLine - 1; i < endLine; ++i) {
        const line = lines[i];

        if (skipComments) {
          if (
            commentLineNumbers.has(i + 1) &&
            isFullLineComment(line, i + 1, commentLineNumbers.get(i + 1))
          ) {
            continue;
          }
        }

        if (skipBlankLines) {
          if (line.match(/^\s*$/u)) {
            continue;
          }
        }

        lineCount++;
      }

      if (lineCount > maxLines) {
        const name = lodash.upperFirst(
          astUtils.getFunctionNameWithKind(funcNode)
        );

        context.report({
          node,
          messageId: "exceed",
          data: { name, lineCount, maxLines },
        });
      }
    }

    return {
      FunctionDeclaration: processFunction,
      FunctionExpression: processFunction,
      ArrowFunctionExpression: processFunction,
    };
  },
};
