import { usersService } from "../services/index.js"
import UserDTO from "../dto/User.dto.js";
import { generateMockUsers } from "../utils/mocking.js";

const getAllUsers = async(req,res)=>{
    const users = await usersService.getAll();
    res.send({status:"success",payload:users})
}

const getUser = async(req,res)=> {
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error",error:"User not found"})
    res.send({status:"success",payload:user})
}

const updateUser =async(req,res)=>{
    const updateBody = req.body;
    const userId = req.params.uid;
    const user = await usersService.getUserById(userId);
    if(!user) return res.status(404).send({status:"error", error:"User not found"})
    const result = await usersService.update(userId,updateBody);
    res.send({status:"success",message:"User updated"})
}

const deleteUser = async(req,res) =>{
    const userId = req.params.uid;
    const result = await usersService.getUserById(userId);
    res.send({status:"success",message:"User deleted"})
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
        console.log(error);
        
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