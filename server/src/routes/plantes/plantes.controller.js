const {getAllPlanets} = require('../../models/plantes.model')
const httpGetAllPlantes = async (req,res)=>{
    return res.status(200).json(await getAllPlanets())
}


module.exports = {httpGetAllPlantes}