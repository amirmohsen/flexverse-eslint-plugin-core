import { flow } from "lodash";

export const getFunctionDeclaration = (statements) =>
  `function Test() {${statements} }`;

export const getFunctionExpression = (statements) => `const Test = function() {
    ${statements}
 }`;

export const getInstanceClassMethod = (statements) => `class Test{
    testFn(){
       ${statements}
        }
}`;

export const getArrowFunctionInsideClass = (statements) => `class Test {
    constructor() {
      this.testFn = () => {
        ${statements}
      }
    }
  }`;

export const getStaticClassMethod = (statements) => `  class Test{
    static testFn(){
        ${statements}
    }
}`;

export const getConstructorFunction = (statements) => ` class Test{
      constructor(){
      ${statements}
      }
    }`;

export const getArrowFunction = (statements) => `const Test = () => {
    ${statements}
 }`;

export const getExportedFunction = (fn) => (statements) =>
  `export ${fn(statements)}`;

export const getNestedFunctions = (types) => flow(...types);

const MESSAGE_SUFFIX_MAP = {
  arrow: "Arrow function",
  declaration: `Function 'Test'`,
  expression: "Function",
  instance: `Method 'testFn'`,
  static: `Static method 'testFn'`,
  constructor: "Constructor",
};

export const functionTypeConfig = [
  {
    type: "declaration",
    message: MESSAGE_SUFFIX_MAP.declaration,
    templateFns: [
      getFunctionDeclaration,
      getExportedFunction(getFunctionDeclaration),
      getNestedFunctions([getFunctionDeclaration, getFunctionExpression]),
      getNestedFunctions([getFunctionDeclaration, getArrowFunction]),
      getNestedFunctions([getFunctionDeclaration, getConstructorFunction]),
      getNestedFunctions([getFunctionDeclaration, getStaticClassMethod]),
      getNestedFunctions([getFunctionDeclaration, getInstanceClassMethod]),
      getNestedFunctions([getFunctionDeclaration, getFunctionDeclaration]),
    ],
  },
  {
    type: "expression",
    message: MESSAGE_SUFFIX_MAP.expression,
    templateFns: [
      getFunctionExpression,
      getExportedFunction(getFunctionExpression),
      getNestedFunctions([getFunctionExpression, getArrowFunction]),
      getNestedFunctions([getFunctionExpression, getFunctionDeclaration]),
      getNestedFunctions([getFunctionExpression, getConstructorFunction]),
      getNestedFunctions([getFunctionExpression, getStaticClassMethod]),
      getNestedFunctions([getFunctionExpression, getInstanceClassMethod]),
      getNestedFunctions([getFunctionExpression, getFunctionExpression]),
    ],
  },
  {
    type: "instance class",
    message: MESSAGE_SUFFIX_MAP.instance,
    templateFns: [
      getInstanceClassMethod,
      getExportedFunction(getInstanceClassMethod),
    ],
  },
  {
    type: "static class",
    message: MESSAGE_SUFFIX_MAP.static,
    templateFns: [
      getStaticClassMethod,
      getExportedFunction(getStaticClassMethod),
    ],
  },
  {
    type: "constructor",
    message: MESSAGE_SUFFIX_MAP.constructor,
    templateFns: [
      getConstructorFunction,
      getExportedFunction(getConstructorFunction),
    ],
  },
  {
    type: "arrow",
    message: MESSAGE_SUFFIX_MAP.arrow,
    templateFns: [
      getArrowFunction,
      getExportedFunction(getArrowFunction),
      getNestedFunctions([getArrowFunction, getFunctionExpression]),
      getNestedFunctions([getArrowFunction, getFunctionDeclaration]),
      getNestedFunctions([getArrowFunction, getConstructorFunction]),
      getNestedFunctions([getArrowFunction, getStaticClassMethod]),
      getNestedFunctions([getArrowFunction, getInstanceClassMethod]),
      getNestedFunctions([getArrowFunction, getArrowFunction]),
    ],
  },
  {
    type: "arrow function inside class",
    message: MESSAGE_SUFFIX_MAP.arrow,
    templateFns: [
      getArrowFunctionInsideClass,
      getExportedFunction(getArrowFunctionInsideClass),
    ],
  },
];
