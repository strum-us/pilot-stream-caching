import { Op, SyncOptions } from 'sequelize'

import Admin from './Admin'
import Annotation from './annotation'
import FeedbackActionRecord from './feedbackActionRecord'
import FeedbackCommnent from './feedbackComment'
import FeedbackIssue from './feedbackIssue'
import FeedbackNote from './feedbackNote'
import FeedbackSnapshot from './feedbackSnapshot'
import FeedbackSource from './feedbackSource'
import File from './file'
import NoteAccess from './noteAccess'
import NoteActivity from './noteActivity'
import Project from './project'
import { Sequelize } from 'sequelize-typescript'
import User from './user'
import UserLog from './userLog'
import config from '../../config/storageConfig'

// import testStorageConfig from '../../config/testStorage'

let dbConnectConfig
if (process.env.NODE_ENV === 'test') {
  dbConnectConfig = config.testDB
  // dbConnectConfig = config.developmentDB
} else if (process.env.NODE_ENV === 'production') {
  dbConnectConfig = config.productDB
} else {
  dbConnectConfig = config.developmentDB
}

const sequelize = new Sequelize({
  repositoryMode: true,
  dialect: 'mysql',
  host: dbConnectConfig.host,
  username: dbConnectConfig.username,
  password: dbConnectConfig.password,
  database: dbConnectConfig.schema,
  models: [
    User, Project, UserLog, Admin,
    FeedbackIssue, FeedbackNote, FeedbackSource, FeedbackCommnent, Annotation, File,
    FeedbackSnapshot, FeedbackActionRecord,
    NoteActivity, NoteAccess,
  ],
  operatorsAliases: {
    $and: Op.and,
    $or: Op.or,
    $eq: Op.eq,
    $gt: Op.gt,
    $gte: Op.gte,
    $lt: Op.lt,
    $lte: Op.lte,
    $like: Op.like,
    $ne: Op.ne,
    $notIn: Op.notIn,
    $in: Op.in,
    $not: Op.not,
  },
  define: {
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
  },
  logging: false,
})

export async function initDatabase(options?: SyncOptions) {
  try {
    await sequelize.authenticate()
    await sequelize.sync({ alter: true, force: false, ...options })
  } catch (err) {
    if (err) throw err
  }
}

export default sequelize
