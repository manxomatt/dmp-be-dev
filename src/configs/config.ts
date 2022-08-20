import { Config } from './config.interface';

const config: Config = {
  nest: {
    port: 3000,
    sourceUrl: 'http://dev3.dansmultipro.co.id/api/recruitment/',
  },
  cors: {
    enabled: true,
  },
  swagger: {
    enabled: true,
    title: 'DMP',
    description: 'DMP API description',
    version: '1.0',
    path: 'api',
  },
  graphql: {
    playgroundEnabled: true,
    debug: true,
    schemaDestination: './src/schema.graphql',
    sortSchema: true,
  },
  security: {
    expiresIn: '2m',
    refreshIn: '7d',
    bcryptSaltOrRound: 10,
  },
};

export default (): Config => config;
