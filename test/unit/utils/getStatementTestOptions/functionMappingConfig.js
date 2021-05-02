// function declaration
// function expression
// instance class methods
// static class methods
// constructor
// arrow function
// arrow function inside class (as a field)
// nested functions (combinations of the above)
// exported functions (variations of the above)

export const getFunctionDeclaration = (statements) => (`function Test() {${statements} }`)

export const getFunctionExpression = (statements) => (`const Test = function() {
    ${statements}
 }`)


export const getInstanceClassMethod = (statements) => (`class Test{
    testFn(){
       ${statements}
        }
}`)



export const GetArrowFunctionInsideClass = (statements) => (`class Test {
    constructor() {
      this.testFn = () => {
        ${statements}
      }
    }
  }`)

export const getStaticClassMethod = (statements) => (`  class Test{
    static testFn(){
        ${statements}
    }
}`)

export const getConstructorFunction = (statements) => (` class Test{
      constructor(){
      ${statements}
      }
    }`)

export const getArrowFunction = (statements) => (`const Test = () => {
    ${statements}
 }`)

export const functionTypeConfig = [{
    type: 'declaration',
    message: `Function 'Test'`,
    templateFn: getFunctionDeclaration
},
{
    type: 'expression',
    message: `Function`,
    templateFn: getFunctionExpression
},
{
    type: 'instance class',
    message: `Method 'testFn'`,
    templateFn: getInstanceClassMethod
},
{
    type: 'static class',
    message: `Static method 'testFn'`,
    templateFn: getStaticClassMethod
},
{
    type: 'constructor',
    message: `Constructor`,
    templateFn: getConstructorFunction
},
{
    type: 'arrow',
    message: 'Arrow function',
    templateFn: getArrowFunction
},
{
    type: 'arrow function inside class',
    message: 'Arrow function',
    templateFn: GetArrowFunctionInsideClass
},
]