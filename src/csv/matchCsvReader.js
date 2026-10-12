import { readFileSync } from 'node:fs';
import { parse } from 'csv-parse/sync';

function readFileContent(csvPath) {
  try {
    return readFileSync(csvPath, 'utf8');
  } catch (error) {
    throw new Error(`No se pudo leer el archivo CSV en ${csvPath}: ${error.message}`);
  }
}

export function readMatchRecords(csvPath) {
  const parsedRows = parse(readFileContent(csvPath), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
    info: true,
  });
  return parsedRows.map(({ record, info }) => ({ lineNumber: info.lines, record }));
}
