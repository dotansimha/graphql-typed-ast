import { GraphQLResolveInfo } from 'graphql';
import { Whitespace, Keywords, Merge } from "./utils";

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type Resolvers<
  ASTString extends string,
  ContextType = {},
> = 
  string extends ASTString ? {} :
  ASTString extends '' ? {} :
  ASTString extends `${Whitespace}${infer Next}` ? Resolvers<Next> : 
  ASTString extends `${Keywords["TYPE"]} ${infer TypeName} {${infer Fields}}${infer Next}` ? Merge<{[K in any as TypeName]: Merge<Resolvers<Fields>>} & Resolvers<Next>> : 
  ASTString extends `${infer FieldName}: ${infer FieldType}${Whitespace}${infer NextField}` ? { [K in any as FieldName]: ResolverFn<any, any, ContextType, any> } & Resolvers<NextField> :
{};

export type MyResolvers = Resolvers</* GraphQL */`
  type Query {
    user: User!
  }

  type User {
    id: ID!
    name: String
  }
`>;

const resolvers: MyResolvers = {
  Query: {
    user: (root, args, context) => {

    }
  }
};
