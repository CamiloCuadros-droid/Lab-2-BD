const knownErrorDescriptions = {
  ECONNREFUSED: 'No se pudo conectar al servidor MySQL, verifique host y puerto',
  ER_ACCESS_DENIED_ERROR: 'Usuario o contraseña incorrectos',
  ER_BAD_DB_ERROR: 'La base de datos indicada no existe, ejecute primero sql/schema.sql',
  ER_NO_SUCH_TABLE: 'Falta alguna tabla del esquema, ejecute primero sql/schema.sql',
  ER_DUP_ENTRY: 'Violación de unicidad: se intentó insertar un registro duplicado',
  ER_NO_REFERENCED_ROW_2: 'Violación de llave foránea: se referencia un registro inexistente',
  ER_CHECK_CONSTRAINT_VIOLATED: 'Un registro incumple una restricción CHECK',
  ER_BAD_NULL_ERROR: 'Se intentó insertar NULL en una columna obligatoria',
  ER_DATA_TOO_LONG: 'Un valor de texto excede la longitud de su columna',
  ER_WARN_DATA_OUT_OF_RANGE: 'Un valor numérico está fuera del rango de su columna',
  ER_TRUNCATED_WRONG_VALUE: 'Un valor tiene un formato incompatible con el tipo de su columna',
};

export function describeLoadError(error) {
  const knownDescription = knownErrorDescriptions[error.code];
  if (knownDescription) {
    return `${knownDescription}. Detalle: ${error.message}`;
  }
  return error.message;
}
