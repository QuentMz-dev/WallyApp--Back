export const isString = (data) => typeof data === "string";
export const stringIsFilled = (data) =>
  isString(data) && data.trim().length > 0;

export const stringAreFilled = (arr) => arr.every((el) => stringIsFilled(el));
