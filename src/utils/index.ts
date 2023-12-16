export const StringToNum = (str: String) => {
  const num = Number(str);
  if (!num) {
    throw new Error("Cannot be converted to number");
  }
  return num;
};
