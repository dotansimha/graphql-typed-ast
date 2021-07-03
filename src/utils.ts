import { GraphQLResolveInfo, KindEnum } from "graphql";

export type TypedResolverFn<
  Parent = unknown,
  Args extends Record<string, any> = {},
  Context = unknown,
  Info extends GraphQLResolveInfo = GraphQLResolveInfo,
  Result = unknown
> = (
  parent: Parent,
  args: Args,
  context: Context,
  info: Info
) => Result | Promise<Result>;

declare global {
  interface ScalarsOutput {
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    ID: string | number;
  }

  interface ScalarsInputs {
    String: string;
    Boolean: boolean;
    Int: number;
    Float: number;
    ID: string | number;
  }

  interface TypeMapping {}
}

export type ParserError<T extends string> = { error: true } & T;

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends ""
  ? []
  : S extends `${infer T}${D}${infer U}`
  ? [T, ...Split<U, D>]
  : [S];

export type TakeLast<V> = V extends []
  ? never
  : V extends [string]
  ? V[0]
  : V extends [string, ...infer R]
  ? TakeLast<R>
  : never;

export type TrimLeft<V extends string> = V extends ` ${infer R}`
  ? TrimLeft<R>
  : V;

export type TrimRight<V extends string> = V extends `${infer R} `
  ? TrimRight<R>
  : V;

export type EatWhitespace<State extends string> = string extends State
  ? ParserError<"EatWhitespace got generic string type">
  : State extends ` ${infer State}` | `\n${infer State}`
  ? EatWhitespace<State>
  : State;

export type Trim<V extends string> = TrimLeft<TrimRight<V>>;

export type IsEmptyArray<V> = V extends [] ? true : false;
export type IsArray<V> = V extends [] ? true : false;
export type IsObject<V> = V extends {} ? true : false;
export type IsString<V> = V extends string ? true : false;

export type Join<T extends unknown[], D extends string = ""> = T extends []
  ? ""
  : T extends [string]
  ? `${T[0]}`
  : T extends [string, ...infer U]
  ? `${T[0]}${D}${Join<U, D>}`
  : string;

type NonNullable<T> = Exclude<T, null | undefined | void>;

type MapOutputType<Name extends keyof ScalarsOutput | string> =
  Name extends keyof TypeMapping
    ? TypeMapping[Name]
    : Name extends keyof ScalarsOutput
    ? ScalarsOutput[Name]
    : unknown;

type MapInputType<Name extends keyof ScalarsInputs | string> =
  Name extends keyof TypeMapping
    ? TypeMapping[Name]
    : Name extends keyof ScalarsOutput
    ? ScalarsOutput[Name]
    : unknown;

type BaseType<T extends string> = T extends `${infer U}!`
  ? BaseType<U>
  : T extends `[${infer U}]`
  ? BaseType<U>
  : T;

type ApplyModifiers<T extends string, OutputType> = T extends `${infer U}!`
  ? NonNullable<ApplyModifiers<U, OutputType>>
  : T extends `[${infer U}]`
  ? Array<ApplyModifiers<U, OutputType>>
  : OutputType | null | undefined | void;

type ParseTypeInfo<T extends string> = {
  raw: T;
  outputType: ApplyModifiers<T, MapOutputType<BaseType<T>>>;
};

type ParseFieldArguments<FieldDefSDL extends string | string[]> =
  FieldDefSDL extends string[]
    ? []
    : FieldDefSDL extends `${infer FieldName}(${infer FieldArgs})`
    ? ParseFieldArguments<Split<FieldArgs, ",">>
    : {};

export type FieldResolver<FieldSDL extends string> = EatWhitespace<
  Trim<FieldSDL>
> extends `${infer FieldDef}: ${infer FieldResult}`
  ? TypedResolverFn<
      never,
      ParseFieldArguments<FieldSDL>,
      {},
      GraphQLResolveInfo,
      ParseTypeInfo<FieldResult>["outputType"]
    >
  : Error<"Failed to parse field resolver", EatWhitespace<Trim<FieldSDL>>>;

type Error<Message extends string, Raw> = {
  error: Message;
  raw: Raw;
};
