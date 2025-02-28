import { usersService } from "../services/index.js";
import { createHash, passwordValidation } from "../utils.js";
import jwt from 'jsonwebtoken';
import UserDTO from '../dto/User.dto.js';
import errorDictionary from "../middlewares/errors/errorDictionary.js";

const register = async (req, res) => {
    try {
        const { first_name, last_name, email, password } = req.body;
        if (!first_name || !last_name || !email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
        const exists = await usersService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
        const hashedPassword = createHash(password);
        const user = {
            first_name,
            last_name,
            email,
            password: hashedPassword
        }
        let result = await usersService.create(user);
        console.log(result);
        res.send({ status: "success", payload: result._id });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: errorDictionary.SERVER_ERROR});
        
    }
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });

    try {
        const user = await usersService.getUserByEmail(email);
        if(!user) return res.status(404).send({status:"error",error:errorDictionary.USER_NOT_FOUND.message});
        const isValidPassword = await passwordValidation(user,password);
        if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
        
        const userDto = new UserDTO(user);
        const token = jwt.sign(userDto,process.env.JWT_SECRET,{expiresIn:"1h"});
        
        user.last_connection = Date.now();
        await user.save();
        res.cookie('coderCookie',token,{maxAge:3600000}).send({status:"success",message:"Logged in"})
        
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: "error", error: errorDictionary.SERVER_ERROR});
        
    }
}

const current = async(req,res) =>{
    const cookie = req.cookies['coderCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(!user) return res.status(401).send({status:"error",error:errorDictionary.UNAUTHORIZED.message});
    res.send({status:"success",payload:user})
}

const unprotectedLogin  = async(req,res) =>{
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).send({ status: "error", error: "Incomplete values" });
    const user = await usersService.getUserByEmail(email);
    if(!user) return res.status(404).send({status:"error",error:"User doesn't exist"});
    const isValidPassword = await passwordValidation(user,password);
    if(!isValidPassword) return res.status(400).send({status:"error",error:"Incorrect password"});
    const token = jwt.sign(user,'tokenSecretJWT',{expiresIn:"1h"});
    res.cookie('unprotectedCookie',token,{maxAge:3600000}).send({status:"success",message:"Unprotected Logged in"})
}
const unprotectedCurrent = async(req,res)=>{
    const cookie = req.cookies['unprotectedCookie']
    const user = jwt.verify(cookie,'tokenSecretJWT');
    if(user)
        return res.send({status:"success",payload:user})
}
export default {
    current,
    login,
    register,
    current,
    unprotectedLogin,
    unprotectedCurrent
}