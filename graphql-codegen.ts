import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'https://www.dnd5eapi.co/graphql',
  documents: 'lib/graphql/**/*.graphql',
  generates: {
    'lib/generated/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
    },
  },
};

export default config;
