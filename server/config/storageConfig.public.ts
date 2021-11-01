export default {
  redis: {
    host: process.env.NODE_ENV === 'development' ?
      '127.0.0.1':
      'strum-redis-001.pmyxl2.0001.usw1.cache.amazonaws.com',
    port: 6379,
  },
  s3: {
    bucket: 'filetalk-user-files',
    region: 'ap-northeast-2',
    trashBucket: '',
    endpoint: 'https://files.strum.us/',
    // endpoint: 'https://filetalk-user-files.s3.ap-northeast-2.amazonaws.com/',
    cacheEndPoint: 'https://files.strum.us/',
  },
  s3_us1: {
    bucket: 'strum-user-files-uswest1',
    region: 'us-west-1',
    endpoint: 'https://strum-user-files-uswest1.s3-us-west-1.amazonaws.com/',
    cacheEndPoint: 'https://strum-user-files-uswest1.s3-us-west-1.amazonaws.com/',
    trashBucket: '',
  },
}