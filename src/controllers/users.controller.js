import { usersService } from "../services/index.js"
import UserDTO from "../dto/User.dto.js";
import { generateMockUsers } from "../utils/mocking.js";
import errorDictionary from "../middlewares/errors/errorDictionary.js";
import __dirname from "../utils.js";

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

const create = async (req, res) => {
    const quantity = req.query.quantity;
    const data = req.body;
    const document = req.file ? `${__dirname}/../public/docs/${req.file.filename}` : null;
    console.log(req.body);
    

    if (quantity) {
        const users = generateMockUsers(quantity);
        await usersService.create(users);
        return res.send({ status: "success", message: "Users created" });
    }


    if (!data.first_name || !data.last_name || !data.email || !data.password) {
        return res.status(400).send({ status: "error", error: errorDictionary.ALL_FIELDS_REQUIRED.message });
    }

    const newUser = new UserDTO(data);
    req.file ? newUser.documents = [{ name: req.file.originalname, reference: document }] : null;
    await usersService.create(newUser);
    
    return res.send({ status: "success", message: "User created" });
};


const userController= {
    deleteUser,
    getAllUsers,
    getUser,
    updateUser,
    create
}

export default userController