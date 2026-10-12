# football-sql-lab

Carga del dataset de partidos de fútbol (`data/football_matches.csv`) en un esquema normalizado de MySQL. Proyecto del laboratorio de Modelado y Análisis de Datos con SQL.

## Requisitos

- Node.js 18 o superior
- MySQL 8.0.16 o superior (las restricciones CHECK se aplican desde esa versión)

## Uso

1. Crear el esquema: `mysql -u <usuario> -p < sql/schema.sql`
2. Instalar dependencias: `npm install`
3. Copiar `.env.example` a `.env` y completar las credenciales
4. Ejecutar la carga: `npm run load`

La carga solo se ejecuta sobre tablas vacías. Para repetirla, elimine la base con `DROP DATABASE football_lab;` y vuelva a ejecutar `sql/schema.sql`.

## Estructura

```
sql/schema.sql                 script DDL del esquema normalizado
sql/queries/basic/             consultas básicas
sql/queries/analysis/          consultas de análisis
data/football_matches.csv      dataset de origen
src/index.js                   punto de entrada y orquestación
src/config/                    lectura de variables de entorno
src/csv/                       lectura del archivo CSV
src/validation/                validación y conversión de cada fila
src/database/                  conexión y transacciones
src/repositories/              acceso a datos, una responsabilidad por archivo
src/services/                  lógica de la carga
src/verification/              comprobación de conteos y goles tras la carga
src/errors/                    mensajes para errores de MySQL conocidos
```

## Convenciones

- Identificadores de JavaScript en inglés y en camelCase.
- Nombres de tablas y columnas de MySQL en inglés y en snake_case.
- Los mensajes dirigidos al usuario están en español.

## Comportamiento ante errores

- Si alguna fila del CSV no supera la validación, el programa lista las filas rechazadas con su número de línea y termina sin cargar nada.
- La carga completa se ejecuta en una transacción: si falla una inserción, se revierte todo.
- El programa termina con código de salida distinto de cero ante cualquier error o si la verificación posterior no coincide.

## Resultado esperado

```
registros en season: esperado 11, cargado 11 [OK]
registros en team: esperado 37, cargado 37 [OK]
registros en football_match: esperado 4070, cargado 4070 [OK]
registros en team_match_stats: esperado 8140, cargado 8140 [OK]
goles totales: esperado 11137, cargado 11137 [OK]
Verificación aprobada
```
