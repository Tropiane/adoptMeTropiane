import PetDTO from "../dto/Pet.dto.js";
import { petsService } from "../services/index.js"
import __dirname from "../utils.js";
import { generateMockPets } from "../utils/mocking.js";
import errorDictionary from "../middlewares/errors/errorDictionary.js";

const getAllPets = async(req,res)=>{
    try {
        const pets = await petsService.getAll();

        !pets && res.status(404).send({status:"error",error:"Pets not found"})
        res.send({status:"success",payload:pets})
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
    }
}

const createPet = async(req, res)=> {
    const {name,specie,birthDate} = req.body;
    const quantity = req.query.quantity || 1;
    const pets = [];

    try {
        if(quantity>1){

            const data = generateMockPets(quantity);
            data.forEach(pet => {
                pets.push(new PetDTO(pet))
            });

            const result = pets.forEach(async(pet)=>{
                await petsService.create(pet)
            });
            return result
        }

    const pet = new PetDTO({
        name,
        specie,
        birthDate
    });
    const result = await petsService.create(pet);
    
    res.send({status:"success",payload:result})
    
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
    }
}

const updatePet = async(req,res) =>{
    const petUpdateBody = req.body;
    const petId = req.params.pid;

    try {
        await petsService.update(petId,petUpdateBody);
        res.send({status:"success",message:"pet updated"})
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})  
    }
}

const deletePet = async(req,res)=> {
    const petId = req.params.pid;

    try {
        await petsService.delete(petId);
        res.send({status:"success",message:"pet deleted"});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
    }
}

const createPetWithImage = async(req,res) =>{
    const file = req.file;
    const {name,specie,birthDate} = req.body;
    if(!name||!specie||!birthDate) return res.status(400).send({status:"error",error:errorDictionary.ALL_FIELDS_REQUIRED.message})

    console.log(file);
    try {
        const pet = PetDTO.getPetInputFrom({
            name,
            specie,
            birthDate,
            image:`${__dirname}/../public/img/${file.filename}`
        });
        console.log(pet);
    
        const result = await petsService.create(pet);
        res.send({status:"success",payload:result})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
        
    }
}
export default {
    getAllPets,
    createPet,
    updatePet,
    deletePet,
    createPetWithImage
}