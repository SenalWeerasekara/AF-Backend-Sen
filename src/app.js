require('dotenv').config()
import express from 'express'
import compression from 'compression'
// import helmet from 'helmet'
import cors from 'cors'
import connectDB from './database'
import router from './routes/index.routes'
import { isCelebrateError } from 'celebrate'
import { makeResponse } from './utils/response'
import logger from './utils/logger'

const helmet = require('helmet');

const app = express()

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'","http://localhost:3002"],
        scriptSrc: [
          "'self'", 
          "'unsafe-inline", 
          "http://localhost:3000/", 
          "https://cdnjs.cloudflare.com", 
          "https://ajax.googleapis.com"],
        styleSrc: [
          "'self'", 
          "'unsafe-inline", 
          "https://fonts.googleapis.com"],
        imgSrc:["'self'"],
        fontSrc:["'self"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(compression())

app.use(cors({ origin: true, credentials: true }))

app.use(express.json({ limit: '1mb' }))

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => res.status(200).json({ message: 'Bashaway Server Up and Running' }))

app.use('/api', router)

app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message} | Stack: ${err.stack}`)
  if (isCelebrateError(err)) {
    for (const [key, value] of err.details.entries()) {
      return makeResponse({ res, status: 422, message: value.details[0].message })
    }
  } else if (err.expose) {
    return makeResponse({ res, status: err.status, message: err.message })
  } else
    return makeResponse({
      res,
      status: 500,
      message: "Just patching things up. This'll be over soon!",
    })
})


connectDB()

global.__basedir = __dirname

const port = process.env.PORT || 3000

app.listen(port, () => {
  console.log(`AF server successfully started at port ${port}`)
})
