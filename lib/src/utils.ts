import Zod from "zod";

export function generateRandomId(length: number): string {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function getColumnWithFewestRows(data: { [key: string]: number[] }): string {
  let minRows = Infinity;
  let minColumn = "";

  for (const column in data) {
    if (data[column].length < minRows) {
      minRows = data[column].length;
      minColumn = column;
    }
  }

  return minColumn;
}

export function adjustArraySize(arr: any[], size: number): any[] {
  if (arr.length > size) {
    return arr.slice(0, size);
  } else if (arr.length < size) {
    return [...arr, ...new Array(size - arr.length).fill(null)];
  } else {
    return arr;
  }
}

export const logObject = (obj: any, message?: string) => {
  if (message) {
    console.log(message, JSON.stringify(obj, null, 2));
    return;
  }
  console.log(JSON.stringify(obj, null, 2));
};

export const safeParse = <T>(
  ObjectSchema: Zod.Schema<T>,
  stringifiedObject: string
): T => {
  const parsedObject: T = JSON.parse(stringifiedObject);
  try {
    return ObjectSchema.parse(parsedObject);
  } catch (e) {
    console.error(e);
    return parsedObject;
  }
};
