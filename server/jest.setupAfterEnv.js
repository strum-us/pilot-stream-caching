const sequelize = require('./src/database/database').default

jest.mock('./src/modules/emailSender/emailSender')

afterAll(async () => {
  try {
    await sequelize.close()
  } catch (err) {
    throw err
  }
})
