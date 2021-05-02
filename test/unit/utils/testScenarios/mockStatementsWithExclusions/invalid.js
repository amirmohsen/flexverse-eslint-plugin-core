import getStatementTestOptions from "../../getStatementTestOptions";

export const invalidWithExclusionsStatements = [
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');`,
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');
    logger.log('7');`,
];

export const invalidWithoutExclusionsStatements = [
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    console.log('6');`,
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    logger.log('6');`,
];

export const invalidWithExclusions = getStatementTestOptions(
  invalidWithExclusionsStatements
);

export const invalidWithoutExclusions = getStatementTestOptions(
  invalidWithoutExclusionsStatements
);
