import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import CustomError from '../services/errors/customError.js';
import EErrors from '../services/errors/enums.js';
import { generateUserErrorInfo } from '../services/errors/info.js';


const router = Router();

router.get('/', async (req, res)=> {
    await usersController.getAllUsers(req,res);
});

router.get('/:uid',async (req, res)=>{
    const id = req.params;
    res.send({status:"success",payload:await usersController.getUser(id)})
});

router.post("/", async (req, res) => {
    const {first_name, last_name, age, email, password} = req.body;

    if(!first_name || !last_name || !email){
        CustomError.createError({
            name:"user Creation Error",
            cause:generateUserErrorInfo({first_name, last_name, age, email}),
            message:"Error creating user",
            code:EErrors.INVALID_TYPES_ERROR
        })
    }

    const users = []
    const user = {
        first_name,
        last_name,
        age,
        email,
        password
    }
    if(users.length===0){
        user.id = 1;
    }else{
        user.id = users[users.length-1].id+1
    }
    users.push(user)
    res.send({status:"success",payload:users})
})
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);


export default router;