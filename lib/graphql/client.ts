import { GraphQLClient } from 'graphql-request';

export const graphqlClient = new GraphQLClient('https://www.dnd5eapi.co/graphql', {
  headers: {
    'Content-Type': 'application/json',
  },
});
