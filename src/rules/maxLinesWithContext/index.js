const lodash = require("lodash");
const astUtils = require("eslint/lib/rules/utils/ast-utils");

module.exports = {
  meta: {
    type: "suggestion",

    docs: {
      description: "enforce a maximum number of lines per file",
      category: "Stylistic Issues",
      recommended: false,
      url: "https://eslint.org/docs/rules/max-lines",
    },

    schema: [
      {
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
          maxContext: {
            type: "object",
            properties: {
              class: {
                type: "integer",
                minimum: 0,
              },
            },
          },
        },
        additionalProperties: false,
      },
    ],
    messages: {
      exceed:
        "File has too many lines ({{actual}}). Maximum allowed is {{max}}.",
      exceedWithClass:
        "Class file has too many lines ({{actual}}). Maximum allowed is {{max}}.",
    },
  },

  create(context) {
    const {
      max = 300,
      maxContext: { class: classMax = max } = {},
      skipComments = true,
      skipBlankLines = true,
    } = context.options[0] || {};

    const sourceCode = context.getSourceCode();

    function isCommentNodeType(token) {
      return token && (token.type === "Block" || token.type === "Line");
    }

    function getLinesWithoutCode(comment) {
      let start = comment.loc.start.line;
      let end = comment.loc.end.line;

      let token;

      token = comment;
      do {
        token = sourceCode.getTokenBefore(token, {
          includeComments: true,
        });
      } while (isCommentNodeType(token));

      if (token && astUtils.isTokenOnSameLine(token, comment)) {
        start += 1;
      }

      token = comment;
      do {
        token = sourceCode.getTokenAfter(token, {
          includeComments: true,
        });
      } while (isCommentNodeType(token));

      if (token && astUtils.isTokenOnSameLine(comment, token)) {
        end -= 1;
      }

      if (start <= end) {
        return lodash.range(start, end + 1);
      }
      return [];
    }

    let hasClass = false;

    return {
      Program() {
        hasClass = false;
      },
      ClassBody() {
        hasClass = true;
      },
      "Program:exit"() {
        const finalMax = hasClass ? classMax : max;

        let lines = sourceCode.lines.map((text, i) => ({
          lineNumber: i + 1,
          text,
        }));

        /*
         * If file ends with a linebreak, `sourceCode.lines` will have one extra empty line at the end.
         * That isn't a real line, so we shouldn't count it.
         */
        if (lines.length > 1 && lodash.last(lines).text === "") {
          lines.pop();
        }

        if (skipBlankLines) {
          lines = lines.filter((l) => l.text.trim() !== "");
        }

        if (skipComments) {
          const comments = sourceCode.getAllComments();

          const commentLines = lodash.flatten(
            comments.map((comment) => getLinesWithoutCode(comment))
          );

          lines = lines.filter((l) => !commentLines.includes(l.lineNumber));
        }

        if (lines.length > finalMax) {
          const loc = {
            start: {
              line: lines[finalMax].lineNumber,
              column: 0,
            },
            end: {
              line: sourceCode.lines.length,
              column: lodash.last(sourceCode.lines).length,
            },
          };

          context.report({
            loc,
            messageId: hasClass ? "exceedWithClass" : "exceed",
            data: {
              max: finalMax,
              actual: lines.length,
            },
          });
        }
      },
    };
  },
};
