const { RuleTester } = require('eslint');
const rule = require('./index');
const mockCallbackStatementExclusions = require('../../../test/unit/utils/mockCallbackStatementExclusionsStatementExclusions');

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

const validWithExclusions = [
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
  }
`,
  ` function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    logger.log('6');
  }
`,
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    logger.log('5');
    console.log('6');
    logger.log('7');
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
}
`,
];

const invalidWithExclusions = [
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');
  }
`,
  `function Test() {
  console.log('1');
  console.log('2');
  console.log('3');
  console.log('4');
  console.log('5');
  console.log('6');
  logger.log('11');
}
`,
];

const optionsWithExclusions = [
  { max: 5 },
  { exclusionCallback: require.resolve('./mockCallbackStatementExclusions') },
];

ruleTester.run('max-statements-with-exclusions', rule, {
  valid: validWithExclusions.map((code) => ({
    code,
    options: optionsWithExclusions,
  })),

  invalid: invalidWithExclusions.map((code) => {
    const max = optionsWithExclusions[0].max;
    return {
      code,
      options: optionsWithExclusions,
      errors: [
        {
          message: `Function 'Test' has too many statements that haven't been excluded (${
            max + 1
          }). Maximum allowed is ${max}.`,
        },
      ],
    };
  }),
});

const validWithoutExclusions = [
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
  }
`,
  ` function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
  }
`,
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    logger.log('5');
  }
`,
  `function Test() {
  logger.log('1');
  logger.log('2');
  logger.log('3');
  logger.log('4');
  logger.log('5');
}
`,
];

const invalidWithoutExclusions = [
  `function Test() {
    console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');
  }
`,
  `function Test() {
  console.log('1');
  console.log('2');
  console.log('3');
  console.log('4');
  console.log('5');
  logger.log('6');
}
`,
];

const optionsWithoutExclusion = [
  {
    max: 5,
  },
];

ruleTester.run(
  'max-statements-excluding-specified-expression-type without exclusion',


const optionsWithoutExclusion = [
  {
    max: 5,
  },
];

ruleTester.run(
  'max-statements-excluding-specified-expression-type without exclusion',
  rule,
  {
    valid: validWithoutExclusions.map((code) => ({
      code,
      options: optionsWithoutExclusion,
    })),

    invalid: invalidWithoutExclusions.map((code) => {
      const max = optionsWithoutExclusion[0].max;
      return {
        code,
        options: optionsWithoutExclusion,
        errors: [
          {
            message: `Function 'Test' has too many statements (${
              max + 1
            }). Maximum allowed is ${max}.`,
          },
        ],
      };
    }),
  }
);
