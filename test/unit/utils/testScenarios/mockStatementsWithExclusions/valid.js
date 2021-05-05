import getStatementTestOptions from "../../getStatementTestOptions";

export const validWithExclusionsStatements = [
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');`,
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');
    logger.log('6');`,
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    logger.log('5');
    console.log('6');
    logger.log('7');`,
  `logger.log('1');
    logger.log('2');
    logger.log('3');
    logger.log('4');
    logger.log('5');
    logger.log('6');
    logger.log('7');
    logger.log('8');`,
];
export const validWithoutExclusionsStatements = [
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');`,
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    console.log('5');`,
  `console.log('1');
    console.log('2');
    console.log('3');
    console.log('4');
    logger.log('5');`,
  `logger.log('1');
    logger.log('2');
    logger.log('3');
    logger.log('4');
    logger.log('5');`,
];

export const validWithExclusions = getStatementTestOptions(
  validWithExclusionsStatements
);

export const validWithoutExclusions = getStatementTestOptions(
  validWithoutExclusionsStatements
);
