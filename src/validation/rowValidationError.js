export class RowValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RowValidationError';
  }
}
