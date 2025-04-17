const http = require('http');
require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./app')
const {loadPlanetsData} = require('./models/plantes.model');
const { mongoConnect } = require('./services/mongo');
const { loadLaunchesData } = require('./models/launches.model');
const PORT = process.env.PORT || 7000;
const server = http.createServer(app);


async function fireServer(){
   await mongoConnect();
   await loadPlanetsData();
   await loadLaunchesData();
   server.listen(PORT,(req,res)=>{
        console.log(`Listening on PORT ${PORT}`)
    })
}

fireServer();