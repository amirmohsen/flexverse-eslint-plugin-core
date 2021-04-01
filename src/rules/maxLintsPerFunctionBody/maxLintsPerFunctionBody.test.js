const { RuleTester } = require("eslint");
const rule = require("./index");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

const validCode = `
function Test() {
  console.log('1');
  console.log('2');
  console.log('3');
  console.log('4');
  console.log('5');
}

class Hello {
  world() {
    console.log('1');
  }

  one() { console.log('this is another one'); }

  zero() {}
}

const test = () => {
  console.log('1');
  console.log('2');
  console.log('3');
}

const my = function() {
  console.log('1');
  console.log('2');
  console.log('3');
  console.log('4');
  console.log('5');
}

const obj = {
  shorthand() {
    console.log('1');
    console.log('2');
    console.log('3');
  },
  arrow: () => {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
  },
}
`;

const invalidCode = `
function Test() {
  console.log('1');
  console.log('2');
  console.log('3');
  console.log('4');
  console.log('5');
  console.log('6');
  console.log('7');
  console.log('8');
  console.log('9');
  console.log('10');
  console.log('11');
}
`;

ruleTester.run("max-lines-per-function-body", rule, {
  valid: [
    {
      code: validCode,
      options: [{ max: 10 }],
    },
  ],

  invalid: [
    {
      code: invalidCode,
      options: [{ max: 10 }],
      errors: [
        {
          message:
            "Function 'Test' has too many lines (11). Maximum allowed is 10.",
        },
      ],
    },
  ],
});
