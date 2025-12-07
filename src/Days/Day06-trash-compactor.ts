import { getDataLines, doOperation, Operator } from "../utils";

/**
 * Represents a column of values and an operator to apply.
 *
 * @interface
 * @property {number[]} values - The numeric values in the column.
 * @property {Operator} operator - The operator to apply to the values.
 */
interface Column {
  values: number[];
  operator: Operator;
}

const lines = getDataLines();

const operators: Operator[] = lines[lines.length - 1]
  .trim()
  .split(/\s+/) as Operator[];

/**
 * Creates template columns based on the operators.
 * Each column values starts empty with its corresponding operator.
 *
 * @see {@link Column} The Column interface definition
 * @returns {Column[]} Array of Column objects with empty values and
 * corresponding operators.
 */
const createTemplateColumns = (): Column[] => {
  return Array.from({ length: operators.length }, (_, i) => ({
    values: [],
    operator: operators[i] || "+",
  }));
};

/**
 * Each {@link Column} (values + operator) is processed from top to bottom,
 * applying the operator to the values in that `Column`. A new `Column` starts
 * when we have a full empty column (i.e., when we encounter a column with only
 * whitespaces).
 * The last line contains the operators for each `Column`.
 *
 * When each `Column` is processed, we sum the result of each `Column`.
 *
 * @return {number} The final result after processing all Columns.
 */
const trashCompactorPart1 = (): number => {
  const columns: Column[] = createTemplateColumns();

  lines.forEach((line, lineIndex) => {
    line
      .trim()
      .split(/\s+/)
      .forEach((val, i) => {
        if (lineIndex === lines.length - 1) {
          columns[i].operator = val as Operator;
        } else {
          columns[i].values.push(Number.parseInt(val, 10));
        }
      });
  });

  return columns.reduce((acc, col) => {
    return acc + doOperation(col.values, col.operator);
  }, 0);
};

/**
 * The {@link Column} objects (values + operator) are now processed from right
 * to left (still top to bottom within each `Column`).
 * A new `Column` starts when we have a full empty column (i.e., when we
 * encounter a column with only whitespaces).
 * The last line contains the operators for each `Column`.
 *
 * When each `Column` is processed, we sum the result of each `Column`.
 *
 * @returns {number} The final result after processing all columns in Part 2 fashion.
 */
const trashCompactorPart2 = (): number => {
  const columns = createTemplateColumns();
  let operatorsIndex = operators.length - 1;

  for (let j = lines[0].length - 1; j >= 0 && operatorsIndex >= 0; j--) {
    let str = "";
    for (let i = 0; i < lines.length - 1; i++) {
      str += lines[i][j];
    }

    if (!str.trim()) {
      operatorsIndex--;
      continue;
    }

    columns[operatorsIndex].values.push(Number.parseInt(str, 10));
  }

  return columns.reduce(
    (acc, col) => acc + doOperation(col.values, col.operator),
    0
  );
};

console.log("Part 1:", trashCompactorPart1());
console.log("Part 2:", trashCompactorPart2());
