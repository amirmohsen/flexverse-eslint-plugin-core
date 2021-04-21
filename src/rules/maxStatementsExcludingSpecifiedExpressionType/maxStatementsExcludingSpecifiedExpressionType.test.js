const { RuleTester } = require("eslint");
const rule = require("./index");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

const valid = [
  `function Test() {
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
  }
`,
  ` function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');
    console.log('7');
    console.log('8');
    console.log('9');
    logger.log('10');
    console.log('11');
  }
`,
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    logger.log('5');
    console.log('6');
    console.log('7');
    console.log('8');
    console.log('9');
    logger.log('10');
  }
`,
  `function Test() {
  logger.log('1');
  logger.log('2');
  logger.log('3');
  logger.log('4');
  logger.log('5');
  logger.log('6');
  logger.log('7');
  logger.log('8');
  logger.log('9');
  logger.log('10');
  logger.log('11');
  logger.log('12');
}
`,
];
const validWithoutExclusion = [
  `function Test() {
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
  }
`,
  ` function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');
    console.log('7');
    console.log('8');
    console.log('9');
    logger.log('10');
  }
`,
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    logger.log('5');
    console.log('6');
    console.log('7');
    console.log('8');
    console.log('9');
    logger.log('10');
  }
`,
  `function Test() {
  logger.log('1');
  logger.log('2');
  logger.log('3');
  logger.log('4');
  logger.log('5');
  logger.log('6');
  logger.log('7');
  logger.log('8');
  logger.log('9');
  logger.log('10');
}
`,
];

const invalid = [
  `function Test() {
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
`,
  `function Test() {
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
  logger.log('11');
}
`,
];

const option = { max: 10 };

ruleTester.run("max-statements-excluding-specified-expression-type", rule, {
  valid: validWithoutExclusion.map((code) => ({
    code,
    options: [option],
  })),

  invalid: invalid.map((code) => {
    const max = option.max;
    return {
      code,
      options: [option],
      errors: [
        {
          message: ` has too many statements (${
            max + 1
          }). Maximum allowed is ${max}.`,
        },
      ],
    };
  }),
});

const optionWithExclusion = [
  {
    max: 10,
  },
  {
    ignoreExpressionType: "logger",
  },
];

ruleTester.run(
  "max-statements-excluding-specified-expression-type with exclusion",
  rule,
  {
    valid: valid.map((code) => ({
      code,
      options: [optionWithExclusion],
    })),

    invalid: invalid.map((code) => {
      const max = option.max;
      return {
        code,
        options: [optionWithExclusion],
        errors: [
          {
            message: ` has too many "non-logger" statements (${
              max + 1
            }). Maximum allowed is ${max}.`,
          },
        ],
      };
    }),
  }
);
