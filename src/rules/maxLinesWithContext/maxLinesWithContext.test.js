const { RuleTester } = require("eslint");
const rule = require("./index");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

const valid = [
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
class Test {}
console.log('6');
console.log('7');
console.log('8');
console.log('9');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
class Test1 {}
console.log('6');
console.log('7');
console.log('8');
class Test2 {}
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
const Test = class {}
console.log('6');
console.log('7');
console.log('8');
console.log('9');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
const Test = class TestDisplayName {}
console.log('6');
console.log('7');
console.log('8');
console.log('9');
`,
];

const invalid = [
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
console.log('6');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
class Test {}
console.log('6');
console.log('7');
console.log('8');
console.log('9');
console.log('10');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
class Test1 {}
console.log('6');
console.log('7');
console.log('8');
class Test2 {}
console.log('9');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
const Test = class {}
console.log('6');
console.log('7');
console.log('8');
console.log('9');
console.log('10');
`,
  `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
const Test = class TestDisplayName {}
console.log('6');
console.log('7');
console.log('8');
console.log('9');
console.log('10');
`,
];

const option = { max: 5, maxContext: { class: 10 } };

ruleTester.run("max-lines-with-context", rule, {
  valid: valid.map((code) => ({
    code,
    options: [option],
  })),

  invalid: invalid.map((code) => {
    const hasClass = code.includes("class");
    const max = hasClass ? option.maxContext.class : option.max;
    return {
      code,
      options: [option],
      errors: [
        {
          message: `${hasClass ? "Class file" : "File"} has too many lines (${
            max + 1
          }). Maximum allowed is ${max}.`,
        },
      ],
    };
  }),
});
