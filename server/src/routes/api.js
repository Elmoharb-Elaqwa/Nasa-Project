const express = require('express')
const plantesRouter = require('./plantes/plantes.router')
const launchesRotuer = require('./launches/launches.router')

const api = express.Router()

api.use('/plantes',plantesRouter);
api.use('/launches',launchesRotuer)


module.exports={
    api
}