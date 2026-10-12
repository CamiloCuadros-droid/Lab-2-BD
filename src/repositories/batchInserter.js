export async function insertInBatches(connection, insertStatement, rows, batchSize) {
  for (let startIndex = 0; startIndex < rows.length; startIndex += batchSize) {
    const batch = rows.slice(startIndex, startIndex + batchSize);
    await connection.query(insertStatement, [batch]);
  }
}
