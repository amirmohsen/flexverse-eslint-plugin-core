const { RuleTester } = require("eslint");
const rule = require("./index");

const ruleTester = new RuleTester({ parserOptions: { ecmaVersion: 2020 } });

import {
  validWithExclusions,
  invalidWithExclusions,
  validWithoutExclusions,
  invalidWithoutExclusions,
} from "../../../test/unit/utils/testScenarios/mockStatementsWithExclusions";

const optionsWithExclusions = [
  { max: 5 },
  {
    exclusionCallback: require.resolve(
      "../../../test/unit/utils/mocks/mockCallbackStatementExclusions"
    ),
  },
];

ruleTester.run("max-statements-with-exclusions", rule, {
  valid: validWithExclusions.map(({ message, code }) => ({
    code,
    options: optionsWithExclusions,
  })),

  invalid: invalidWithExclusions.map(({ message, code }) => {
    const max = optionsWithExclusions[0].max;
    return {
      code,
      options: optionsWithExclusions,
      errors: [
        {
          message: `${message} has too many statements that haven't been excluded (${
            max + 1
          }). Maximum allowed is ${max}.`,
        },
      ],
    };
  }),
});

const optionsWithoutExclusion = [
  {
    max: 5,
  },
];

ruleTester.run(
  "max-statements-excluding-specified-expression-type without exclusion",
  rule,
  {
    valid: validWithoutExclusions.map(({ message, code }) => ({
      code,
      options: optionsWithoutExclusion,
    })),

    invalid: invalidWithoutExclusions.map(({ message, code }) => {
      const max = optionsWithoutExclusion[0].max;
      return {
        code,
        options: optionsWithoutExclusion,
        errors: [
          {
            message: `${message} has too many statements (${
              max + 1
            }). Maximum allowed is ${max}.`,
          },
        ],
      };
    }),
  }
);
