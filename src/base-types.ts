
import { Whitespace, Keywords, TrimLeft } from "./utils";

export type ParseBaseType<T extends string> =
  T extends `${infer Next}!` ? ParseBaseType<Next> :
  T extends `[${infer Next}]` ? ParseBaseType<Next> :
  T;

export type ParseTypeWithModifiers<T extends string> =
  T extends `${infer Next}!` ? { nonNull: true, type: ParseTypeWithModifiers<Next> } :
  T extends `[${infer Next}]` ? { array: true, type: ParseTypeWithModifiers<Next> } : 
  T;

type EnumValues<T> = [];

// export type Parse<
//   ASTString extends string,
//   Scalars extends Record<string, any>
// > = 
//   string extends ASTString ? Scalars :
//   ASTString extends '' ? Scalars :
//   ASTString extends `${Whitespace}${infer Next}` ? Parse<Next, Scalars> : 
//   ASTString extends `${Keywords["TYPE"]} ${infer TypeName} {${infer Fields}}${infer Next}` ? Merge<{[K in any as TypeName]: Merge<Parse<Fields, Scalars>>} & Parse<Next, Scalars>> : 
//   ASTString extends `${Keywords["INTERFACE"]} ${infer InterfaceName} {${infer Fields}}${infer Next}` ? Merge<{[K in any as InterfaceName]: Merge<Parse<Fields, Scalars>>} & Parse<Next, Scalars>> : 
//   ASTString extends `${Keywords["ENUM"]} ${infer EnumName} {${infer Values}}${infer Next}` ? Merge<{[K in any as EnumName]: EnumValues<Values>} & Parse<Next, Scalars>> : 
//   ASTString extends `${infer FieldName}: ${infer FieldType}${Whitespace}${infer NextField}` ? { [K in any as FieldName]: Field<FieldType> } & Parse<NextField, Scalars> :
//   Scalars;

type ParseFields<T extends string> =    
TrimLeft<T> extends `${infer Fields}` ? (
  string extends Fields ? {} :
  Fields extends '' ? {} :
  Fields extends `${infer FieldName}: ${infer FieldType} ${infer NextField}` ? (TrimLeft<FieldType> extends `${infer Clean}` ? ({ [K in any as FieldName]: {
    raw: Clean;
    baseType: ParseBaseType<Clean>
    type: ParseTypeWithModifiers<Clean>
  } } & ParseFields<NextField>) : ParseFields<NextField>) :
  Fields extends `${infer FieldName}: ${infer FieldType}` ? (TrimLeft<FieldType> extends `${infer Clean}` ? ({ [K in any as FieldName]: {
    raw: Clean;
    baseType: ParseBaseType<Clean>
    type: ParseTypeWithModifiers<Clean>
  } }) : {}) :
  {}) :
  {}

export type Parse<
  T extends string,
  Scalars extends Record<string, any>
> = 
TrimLeft<T> extends `${infer ASTString}` ? (
  string extends ASTString ? Scalars :
  ASTString extends '' ? Scalars :
  ASTString extends `${Whitespace}${infer Next}` ? Parse<Next, Scalars> : 
  ASTString extends `${Keywords["TYPE"]} ${infer TypeName} {${infer Fields}}${infer Next}` ? {[K in any as TypeName]: ParseFields<Fields>} & Parse<Next, Scalars> : 
  ASTString extends `${Keywords["INTERFACE"]} ${infer InterfaceName} {${infer Fields}}${infer Next}` ? {[K in any as InterfaceName]: ParseFields<Fields>} & Parse<Next, Scalars> : 
  ASTString extends `${Keywords["ENUM"]} ${infer EnumName} {${infer Values}}${infer Next}` ? {[K in any as EnumName]: EnumValues<Values>} & Parse<Next, Scalars> : 
  Scalars) : Scalars

type DefaultScalars = {
  ID: string | number;
  Int: number;
  Float: number;
  String: string;
  Boolean: boolean
};

export type PrepareForParsing<T extends string> = 
  string extends T ? '' :
  T extends '' ? '' :
  T extends `${infer Before}\n${infer After}` ? PrepareForParsing<`${Before} ${After}`> :
  T extends `\n${infer Next}` ? PrepareForParsing<Next> :
  T extends `${infer Next}\n` ? PrepareForParsing<Next> :
  T;

export type BaseTypesMap<SDL extends string, Scalars extends Record<string, any> = DefaultScalars> = PrepareForParsing<SDL> extends `${infer V}` ? Parse<V, Scalars> : {};

export type MyTypes = BaseTypesMap</* GraphQL */`

type Query {
  u: User!
}

type User {
  id: ID!
  name: String! 
}
type Query {
  u: User!
}

type User {
  id: ID!
  name: String! 
}

`>;
