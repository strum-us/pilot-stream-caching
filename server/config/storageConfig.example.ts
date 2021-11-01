export default {
  productDB: {
    schema: 'strum_product',
    username: 'root',
    password: 'foo',
    host: 'localhost',
    dialect: 'mysql',
  },
  developmentDB: {
    schema: 'strum_dev',
    username: 'root',
    password: 'foo',
    host: 'localhost',
    dialect: 'mysql',
  },
  redis: {
    host: '127.0.0.1',
    port: 6379,
  },
  s3: {
    bucket: 'strum-us',
    trashBucket: 'strum-trash',
    region: 'us-west-1',
    endpoint: 'https://strum-us.s3-us-west-1.amazonaws.com',
    cacheEndPoint: 'https://d1otdho758oltq.cloudfront.net',
    // ap-northeast-2 - korea
  },
  dynamo: {
    endpoint: 'https://dynamodb.us-west-1.amazonaws.com',
    region: 'us-west-1',
    tableName: 'strum-actions',
  },
}
