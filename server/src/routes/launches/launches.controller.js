const {getAllLaunches, addNewLaunch, existLaunchId, abortLaunchById,scheduleNewLaunch} = require('../../models/launches.model');
const {getPagination}  = require('../../services/query')
async function httpGetAllLaunches(req,res){
    const {skip,limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip,limit)
    res.status(200).json(launches)
}

const httpAddNewLaunch = async (req,res)=>{
    const launch = req.body;
    if(!launch.mission || !launch.rocket || !launch.target || !launch.launchDate){
        return res.status(400).json({
            error:'Missing required launch property'
        })
    }
    launch.launchDate = new Date(launch.launchDate)
    if(isNaN(launch.launchDate)){
        return res.status(400).json({
            error:"Invaild date"
        })
    }
    await scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch)
}

const httpAbortLaunch=async (req,res)=>{
   const existLaunch = await existLaunchId(Number(req.params.id))
   if(!existLaunch){
    return res.status(404).json({
        error:'Launch not found'
    })
   }
   const aborted = await abortLaunchById(Number(req.params.id));
   console.log(aborted);
   if(!aborted){
    return res.status(400).json({
        error:'Launch not aborted'
    })
   }
   return res.status(200).json({
    ok:true
   })
}
module.exports ={
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch
}