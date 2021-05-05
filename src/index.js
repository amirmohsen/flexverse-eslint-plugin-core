module.exports = {
  rules: {
    "max-lines-with-context": require("./rules/maxLinesWithContext"),
    "max-lines-per-function-body": require("./rules/maxLintsPerFunctionBody"),
    "max-statements-with-exclusions": require("./rules/maxStatementsWithExclusions"),
  },
};
