import {
  Whitespace,
  ValidToken,
  CommentToken,
  Letter,
  LineBreak,
  Tokens,
  EndOfIdentifier,
  StringBlock,
  StringLine,
} from "./utils";

export type Token<Type extends ValidToken, Value extends string | undefined = undefined> = {
  type: Type;
  value?: Value;
}

type Error<Message extends string> = { error: `Parse error: ${Message}` };

type ReadRange<S extends string, Start extends string, End extends string> = S extends `${Start}${infer Value}${End}${infer Rest}` ? { value: Value, rest: Rest } : Error<`Unable to parse content between range: ${Start}-${End} in string: ${S}`>
type ReadComment<S extends string> = ReadRange<S, CommentToken, LineBreak>;
type ReadSpread<S extends string> = ReadRange<S, Tokens["SPREAD"], EndOfIdentifier>;
type ReadStringBlock<S extends string> = ReadRange<S, StringBlock, StringBlock>;
type ReadStringLine<S extends string> = ReadRange<S, StringLine, StringLine>;

type ReadName<S extends string> = S extends `${infer L}${infer Next}` ? L extends Letter ? `${L}${ReadName<Next>}` : "" : "";
type AfterName<S extends string> = S extends `${infer L}${infer Next}` ? L extends Letter ? AfterName<Next> : Next : S;

type ReadNext<T extends string> =
  T extends `${Whitespace}${infer Next}` ? ReadNext<Next> :
  T extends `${Tokens["BANG"]}${infer Next}` ? Token<"BANG"> & { next: ReadNext<Next> } :
  T extends `${Tokens["DOLLAR"]}${infer Next}` ? Token<"DOLLAR"> & { next: ReadNext<Next> } :
  T extends `${Tokens["AMP"]}${infer Next}` ? Token<"AMP"> & { next: ReadNext<Next> } :
  T extends `${Tokens["BRACE_L"]}${infer Next}` ? Token<"BRACE_L"> & { next: ReadNext<Next> } :
  T extends `${Tokens["BRACE_R"]}${infer Next}` ? Token<"BRACE_R"> & { next: ReadNext<Next> } :
  T extends `${Tokens["COLON"]}${infer Next}` ? Token<"COLON"> & { next: ReadNext<Next> } :
  T extends `${Tokens["EQUALS"]}${infer Next}` ? Token<"EQUALS"> & { next: ReadNext<Next> } :
  T extends `${Tokens["BRACKET_L"]}${infer Next}` ? Token<"BRACKET_L"> & { next: ReadNext<Next> } :
  T extends `${Tokens["BRACKET_R"]}${infer Next}` ? Token<"BRACKET_R"> & { next: ReadNext<Next> } :
  T extends `${Tokens["BRACE_L"]}${infer Next}` ? Token<"BRACE_L"> & { next: ReadNext<Next> } :
  T extends `${Tokens["PIPE"]}${infer Next}` ? Token<"PIPE"> & { next: ReadNext<Next> } :
  T extends `${Tokens["BRACE_R"]}${infer Next}` ? Token<"BRACE_R"> & { next: ReadNext<Next> } :
  T extends `${Tokens["AT"]}${infer Next}` ? Token<"AT"> & { next: ReadNext<Next> } :
  T extends `${StringBlock}${infer Next}` ? Token<"BLOCK_STRING", ReadStringBlock<T>["value"]> & { next: ReadNext<ReadStringBlock<T>["rest"]> } :
  T extends `${StringLine}${infer Next}` ? Token<"BLOCK_STRING", ReadStringLine<T>["value"]> & { next: ReadNext<ReadStringLine<T>["rest"]> } :
  T extends `${CommentToken}${infer Next}` ? Token<"COMMENT", ReadComment<T>["value"]> & { next: ReadNext<ReadComment<T>["rest"]> } :
  T extends `${Letter}${infer Next}` ? Token<"NAME", ReadName<T>> & { next: ReadNext<AfterName<T>> } :
  T extends `${Tokens["SPREAD"]}${infer Next}` ? Token<"SPREAD", ReadSpread<T>["value"]> & { next: ReadNext<Next> } :
  T extends `` ? Token<"EOF"> & { next: undefined } : T;

export type ParseGraphQLLexer<S extends string> = Token<"SOF"> & { next: ReadNext<S> };
