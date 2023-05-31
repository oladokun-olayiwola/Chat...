// import { IUserDocument } from "@user/interfaces/user.interface";

export function firstLetterToUpperCase(value: string) {
  const valueLower = value.toLowerCase();
  return valueLower
    .split(" ")
    .map(
      (value: string) =>
        `${value.charAt(0).toUpperCase().slice(1).toLowerCase()}`
    )
    .join();
}
export function toLowerCase(value: string) {
  return value.toLowerCase();
}


export function generateRandomIntegers(integerLength: number): number {
    const characters = '0123456789';
    let result = ' ';
    const charactersLength = characters.length;
    for (let i = 0; i < integerLength; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return parseInt(result, 10);
  }

export const jsonParse = (prop: string) => {
  try {
    const parsed = JSON.parse(prop)
    return parsed
  } catch (error) {
    return prop;
  }
}

export const jsonParser = (prop: any) => {
  let firstElement;
  for (const key in prop) {
    const element = prop[key];
    firstElement = element;
  }

  try {
    JSON.parse(firstElement);
  } catch (error) {
    return firstElement
  }
};
