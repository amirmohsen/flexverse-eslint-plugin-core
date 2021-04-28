const lodash = require("lodash");

const mockCallback = (node) => {
  try {
    const test = node.body.map((n) => {
      return lodash.get(n, "expression.callee.object.name", undefined);
    });
    const filtered = test.filter((t) => t !== "logger").length;
    return filtered;
  } catch (e) {
    return node.body.length;
  }
};

module.exports = mockCallback;
