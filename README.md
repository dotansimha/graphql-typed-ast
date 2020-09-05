# graphql-typed-ast

Experimental TypeScript type-based parser for GraphQL.

This repo is for experimental TypeScript type-system based parser for GraphQL, for creating a real time resolvers-signature based on GraphQL SDL.

It uses a custom alpha version of TypeScript from [this PR](https://github.com/microsoft/TypeScript/pull/40336).

## Goals

- [x] GraphQL Lexer 
- [ ] GraphQL Document Parser


## Example

The goal of this experiment is to allow this:

```ts
const ast = `
       type Query { user(id: ID!( User! }
       type User { id: ID!, name: String! }
    `;

const resolvers: ResolverFor<
   typeof ast,
    { User: UserModel },
    ContextType
  > = {
  Query: {
    user(parent, { id }, context) => {
       // parent is null, id is string | number, context is ContextType, expected return type is `UserModel` 
    } 
  },
  User: {
    name: (parent, args, context) => {
      // parent is UserModel, args is {}, context is ContextType, expected return type is `string`
    }
  }
};
```
