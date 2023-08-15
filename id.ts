import { sample, times } from "lodash";

const alpha = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const digit = "0123456789";

const alphanumeric = `${alpha}${digit}`;

const pick = (count: number, dictionary: string) =>
  times(count, () => sample(dictionary)).join("");

export function id(prefix: string) {
  return `${prefix}${pick(2, alphanumeric)}-${pick(4, digit)}`;
}
