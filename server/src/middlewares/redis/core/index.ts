// import { safeParse, safeStringify } from '@middlewares/strings/safeUtil'

import { safeParse, safeStringify } from 'src/middlewares/strings'

import { InternalError } from 'src/middlewares/errors'
import Redis from 'ioredis'
import publicConfig from 'config/storageConfig.public'

// Do not expose redis object to outer file.
// by @isaac

const options = {
  host: publicConfig.redis.host,
  port: publicConfig.redis.port,
  retryStrategy: (times: number) => {
    // reconnect after
    return Math.min(times * 50, 2000)
  },
}

const {
  redisFlushAll,
  safeWriteJson,
  safeReadJson,
  safeDeleteJson,
} = (function() {
  const redis = new Redis(options)
  console.log('redis connected')

  const redisFlushAll = () => {
    return redis.flushall()
  }

  const safeWriteJson = async <Type>(key: Redis.KeyType, value: Type) => {
    try {
      const text = safeStringify(value)

      if (!text) throw new Error(InternalError.internalRedisSetError)
      return await redis.set(key, text)
    } catch (err) {
      throw err
    }
  }

  const safeReadJson = async <Type>(key: Redis.KeyType): Promise<Type | null> => {
    const result = await redis.get(key)
    if (!result) return null

    const parsed = safeParse<Type>(result)
    return parsed
  }

  const safeDeleteJson = async (key: Redis.KeyType) => {
    const result = await redis.get(key)
    if (!result) return null

    await redis.del(key)
    return true
  }

  return {
    redisFlushAll,
    safeWriteJson,
    safeReadJson,
    safeDeleteJson,
  }
})()

export {
  redisFlushAll,
  safeWriteJson,
  safeReadJson,
  safeDeleteJson,
}
