const express = require('express');
const { httpGetAllPlantes } = require('./plantes.controller');
// const { getAllPlantes } = require('../../models/plantes.model');

const plantesRouter = express.Router();

plantesRouter.get('/',httpGetAllPlantes)

module.exports = plantesRouter;