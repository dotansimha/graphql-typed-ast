// https://github.com/microsoft/TypeScript/issues/31422
// https://dev.to/phenomnominal/i-need-to-learn-about-typescript-template-literal-types-51po
// https://github.com/phenomnomnominal/tsquery

import { FieldResolver } from "./utils";

export const field = <T extends string>(
  sdl: T,
  resolverFn: FieldResolver<T>
): {
  typeDefs: any;
  resolvers: any;
  _test: FieldResolver<T>;
} => {
  // const parameterValues = [];
  // let raw = "";
  // let index = 0;

  // for (const part of parts) {
  //   const token = values[index++];
  //   raw += part;

  //   if (index >= parts.length) {
  //     continue;
  //   }

  //   console.log(`bound func ${token} to field ${part}`);
  // }

  // console.log(raw);

  return {
    resolvers: {},
    typeDefs: "",
    _test: {} as any,
  };
};

const resolver = field(
  `foo(id: String!): String!`,
  (root, args, context, info) => {
    return args.id + "test";
  }
);
