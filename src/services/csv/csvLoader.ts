import Papa from "papaparse";

export async function loadCSV<T>(
  path: string,
  headers?: string[]
): Promise<T[]> {
  const response = await fetch(path);

  const csvText = await response.text();

  return new Promise((resolve, reject) => {
    Papa.parse<string[]>(csvText, {
      header: false,
      skipEmptyLines: true,
      dynamicTyping: true,

      complete(results) {
        const rows = results.data.slice(
            headers ? 1 : 0
            );

        const mapped = rows.map((row) => {
          const item: Record<string, unknown> = {};

          if (headers) {
            headers.forEach((header, index) => {
              item[header] = row[index];
            });
          } else {
            row.forEach((value, index) => {
              item[`column_${index}`] = value;
            });
          }

          return item;
        });

        resolve(mapped as T[]);
      },

        error(error: Error) {
        reject(error);
        },
    });
  });
}