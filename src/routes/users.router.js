import { Router } from 'express';
import usersController from '../controllers/users.controller.js';
import uploader from '../utils/uploader.js';


const router = Router();

router.get('/', async (req, res)=> {
    await usersController.getAllUsers(req,res);
});

router.get('/:uid',async (req, res)=>{
    const id = req.params;
    res.send({status:"success",payload:await usersController.getUser(id)})
});
router.post("/", uploader.single('image'),usersController.create);
router.put('/:uid',usersController.updateUser);
router.delete('/:uid',usersController.deleteUser);
export default router;