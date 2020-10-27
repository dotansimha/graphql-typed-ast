import { TokenKind } from "graphql";

export type Tokens = typeof TokenKind;
export type ValidToken = keyof Tokens;

export type LineBreak = "\r" | "\n";
export type Whitespace = " " | "\t" | LineBreak;
export type EndOfIdentifier = Whitespace | "," | ":" | "!";
export type LowerAlphabet = "a" | "b" | "c" | "d" | "e" | "f" | "g" | "h" | "i" | "j" | "k" | "l" | "m" | "n" | "o" | "p" | "q" | "r" | "s" | "t" | "u" | "v" | "w" | "x" | "y" | "z"
export type UpperAlphabet = "A" | "B" | "C" | "D" | "E" | "F" | "G" | "H" | "I" | "J" | "K" | "L" | "M" | "N" | "O" | "P" | "Q" | "R" | "S" | "T" | "U" | "V" | "W" | "X" | "Y" | "Z"
export type Alphabet = LowerAlphabet | UpperAlphabet
export type Digit = "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9" | "0"
export type Letter = Alphabet | Digit | '_';
export type StringLine = "\"";
export type StringBlock = "\"\"\"";
export type CommentToken = "#";
export type Merge<T> = { [K in keyof T]: T[K] }

export type Keywords = {
  TYPE: "type",
  INTERFACE: "interface",
  UNION: "union",
  ENUM: "enum",
  SCALAR: "scalar"
}

type ReplaceAll<Search extends string, Replace extends string, Subject extends string> =
  "" extends Subject ? Subject :
  Subject extends "" ? "" :
  Subject extends `${infer L}${Search}${infer R}` ? ReplaceAll<Search, Replace, `${L}${Replace}${R}`> :
  Subject

export type TrimLeft<T extends string> =
    T extends `${' ' | '\n'}${infer R}`
    ? TrimLeft<R>
    : T

export type TrimRight<T extends string> =
T extends `${infer R}${' ' | '\n'}`
? TrimRight<R>
: T

export type Trim<T extends string> =
TrimLeft<T> extends `${infer R}`
? TrimRight<R>
: T