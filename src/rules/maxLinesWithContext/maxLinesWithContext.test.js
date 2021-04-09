const { RuleTester } = require("eslint");
const rule = require("./index");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

const validCode = `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
class Test {}
console.log('6');
console.log('7');
console.log('8');
`;

const invalidCode = `console.log('1');
console.log('2');
console.log('3');
console.log('4');
console.log('5');
console.log('6');
`;

ruleTester.run("max-lines-with-context", rule, {
  valid: [
    {
      code: validCode,
      options: [{ max: 5, maxContext: { class: 10 } }],
    },
  ],

  invalid: [
    {
      code: invalidCode,
      options: [{ max: 5 }],
      errors: [
        {
          message: "File has too many lines (6). Maximum allowed is 5.",
        },
      ],
    },
  ],
});
