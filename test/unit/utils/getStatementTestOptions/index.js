import { functionTypeConfig } from "./functionMappingConfig";

const getStatementTestOptions = (statementList) =>
  functionTypeConfig.reduce((acc, { message, templateFn }) => {
    acc.push(
      ...statementList.map((statements) => ({
        message,
        code: templateFn(statements),
      }))
    );
    return acc;
  }, []);

export default getStatementTestOptions;
