import { adoptionsService, petsService, usersService } from "../services/index.js"
import errorDictionary from "../middlewares/errors/errorDictionary.js";

const getAllAdoptions = async(req,res)=>{
    try {
        const result = await adoptionsService.getAll();
        
        !result && res.status(404).send({status:"error",error:"Adoptions not found"})
        res.send({status:"success",payload:result})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.INTERNAL_SERVER_ERROR})
    }
}

const getAdoption = async(req,res)=>{
    try {
        const adoptionId = req.params.aid;
        const adoption = await adoptionsService.getBy({_id:adoptionId})

        if(!adoption) return res.status(404).send({status:"error",error:"Adoption not found"})
        res.send({status:"success",payload:adoption}) 
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.INTERNAL_SERVER_ERROR})
        
    }
}

const createAdoption = async(req,res)=>{
    try {
        const {uid,pid} = req.params;
        const user = await usersService.getUserById(uid);

        if(!user) return res.status(404).send({status:"error", error:errorDictionary.USER_NOT_FOUND});
        const pet = await petsService.getBy({_id:pid});
        if(!pet) return res.status(404).send({status:"error",error:"Pet not found"});
        if(pet.adopted) return res.status(400).send({status:"error",error:"Pet is already adopted"});
        user.pets.push(pet._id);
        
        await usersService.update(user._id,{pets:user.pets})
        await petsService.update(pet._id,{adopted:true,owner:user._id})
        await adoptionsService.create({owner:user._id,pet:pet._id})
        res.send({status:"success",message:"Pet adopted"})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.INTERNAL_SERVER_ERROR})
        
    }
}

export default {
    createAdoption,
    getAllAdoptions,
    getAdoption
}