import { functionTypeConfig } from "./functionMappingConfig";

const reduceTemplateFunctions = ({
  templateFns,
  statementList,
  message,
  type,
}) =>
  statementList.reduce((acc, statement) => {
    acc.push(
      ...templateFns.map((fn) => ({
        message,
        type,
        code: fn(statement),
      }))
    );
    return acc;
  }, []);

const getStatementTestOptions = (statementList) =>
  functionTypeConfig.reduce((acc, details) => {
    acc.push(...reduceTemplateFunctions({ ...details, statementList }));
    return acc;
  }, []);

export default getStatementTestOptions;
