import { functionTypeConfig } from "./functionMappingConfig";

const reduceTemplateFunctions = ({
  templateFns,
  statementList,
  message,
  type,
}) =>
  statementList.reduce((acc, statement) => {
    acc.push(
      ...templateFns.map((fn, i) => ({
        message,
        type,
        code: fn(statement),
      }))
    );
    return acc;
  }, []);

const getStatementTestOptions = (statementList) =>
  functionTypeConfig.reduce((acc, { message, templateFns, type }) => {
    acc.push(
      ...reduceTemplateFunctions({ templateFns, statementList, message, type })
    );
    return acc;
  }, []);

export default getStatementTestOptions;
