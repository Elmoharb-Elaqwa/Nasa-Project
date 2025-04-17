const launches = new Map();
const launchesModel = require('./launches.mongo');
const planet = require('./plantes.mongo');
const axios = require('axios')
let defaultFlightNumber=100;
async function getAllLaunches(skip,limit){
    try {
        return await launchesModel.find({},{'_id':0,'__v':0}).sort({flightNumber:1}).skip(skip).limit(limit)
    } catch (error) { 
        console.log(error)
    }
}
const saveLaunch = async (launch)=>{
    try {
        return await launchesModel.findOneAndUpdate({flightNumber:launch.flightNumber},launch,{upsert:true})
     } catch (error) {
         console.log(error)
     }
}
async function addNewLaunch(launch){
    try {
       return await launchesModel.updateOne({flightNumber:getLatestFlightNumber()},launch,{upsert:true})
    } catch (error) {
        console.log(error)
    }
}
async function findLaunch(filter){
    await launchesModel.findOne(filter)
}
async function existLaunchId(id){
    return await findLaunch({
        flightNumber:id
    });
}

async function getLatestFlightNumber(){
    const latestLaunch = await launchesModel.findOne().sort('-flightNumber');
    if(!latestLaunch){
        return defaultFlightNumber
    }
    return latestLaunch.flightNumber
}

async function scheduleNewLaunch(launch){
    const existPlanet = planet.findOne({keplerName:launch.target});
    if(!existPlanet){
        throw new Error('No matching planet')
    }
    const latestFlightNumber = await getLatestFlightNumber()+1;
    const newLaunch = Object.assign(launch,{
        success:true,
        upcoming:true,
        customers:['SR community','NF community'],
        flightNumber:latestFlightNumber,
    });
    saveLaunch(newLaunch);
}

async function abortLaunchById(id){
    let aborted = await launchesModel.updateOne({
        flightNumber:id},{
            upcoming:false,
            sucess:true
        });
    
    return aborted.ok===1&&aborted.nModified===1
}
async function populateLaunches(){
    const response= await axios.post(SPACEX_API_URL,{
        query:{},
        options:{
            pagination:false,
            populate:[
                {
                    path:'rocket',
                    select:{
                        'name':1
                    }
                },
                {
                    path:'payloads',
                    select:{
                        'customers':1
                    }
                }
            ]
        }
    });
    if(response.status!==200){
        console.log('faild to download');
        throw new Error('faild download launches data')
    }
const launchDocs = response.data.docs;
for(let launchDoc of launchDocs){
    const payloads = launchDoc['payloads'];
    const customers = payloads.flatMap((payload)=>{
        return payload['customers'] // it iterate for all payloads exactely in customers array in each payload and collect all customers array in one single array
    })
    const launch = {
        flightNumber:launchDoc['flight_number'],
        mission:launchDoc['name'],
        rocket:launchDoc['rocket']['name'],
        launchDate:launchDoc['date_local'],
        upcoming:launchDoc['upcoming'],
        success:launchDoc['success'],
        customers,
    }
    // console.log(`${launch.flightNumber} ${launch.mission}`);
    await saveLaunch(launch)
}
}
const SPACEX_API_URL = "https://api.spacexdata.com/v4/launches/query"
async function loadLaunchesData(){
    const firstLaunch =await findLaunch({
        flightNumber:1,
        rocket:'Falcon 1',
        mission:'FalconSat'
    });
    if(firstLaunch){
        console.log('Launch data already exist');
        return;
    }else{
        await populateLaunches()
    }
   
}


module.exports = {
    getAllLaunches,
    addNewLaunch,
    existLaunchId,
    abortLaunchById,
    scheduleNewLaunch,
    loadLaunchesData
}