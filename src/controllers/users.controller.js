import { usersService } from "../services/index.js"
import UserDTO from "../dto/User.dto.js";
import { generateMockUsers } from "../utils/mocking.js";
import errorDictionary from "../middlewares/errors/errorDictionary.js";

const getAllUsers = async(req,res)=>{
    try {
        const users = await usersService.getAll();

        !users && res.status(404).send({status:"error",error:"Users not found"})
        res.send({status:"success",payload:users})
        
    } catch (error) {
        console.log("error al obtener los usuarios", error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
    }
}

const getUser = async(req,res)=> {
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        
        if(!user) return res.status(404).send({status:"error",error:errorDictionary.USER_NOT_FOUND.message})
        res.send({status:"success",payload:user})
        
    } catch (error) {
        console.log("error al obtener el usuario", error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
    }
}

const updateUser =async(req,res)=>{
    try {
        const updateBody = req.body;
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);

        if(!user) return res.status(404).send({status:"error",error:errorDictionary.USER_NOT_FOUND.message})
        await usersService.update(userId,updateBody);
        res.send({status:"success",message:"User updated"})
        
    } catch (error) {
        console.log("error al actualizar el usuario", error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
        
    }
}

const deleteUser = async(req,res) =>{
    try {
        const userId = req.params.uid;
        const user = await usersService.getUserById(userId);
        if(!user) return res.status(404).send({status:"error",error:errorDictionary.USER_NOT_FOUND.message})
        await usersService.delete(userId);
        res.send({status:"success",message:"User deleted"})
        
    } catch (error) {
        console.log("error al eliminar el usuario", error);
        res.status(500).send({status:"error",error:errorDictionary.SERVER_ERROR.message})
    }
}

const create = async(quantity)=>{
    const users = []
    try {
        const data = generateMockUsers(quantity);
        data.forEach(user => {
            users.push(new UserDTO(user))
        })
        const result = users.forEach(async(user)=>{
            return await usersService.create(user)
        });
        return result
        
    } catch (error) {
        console.log("error al crear el usuario", error);
    }
}

const userController= {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    create
}

export default userController