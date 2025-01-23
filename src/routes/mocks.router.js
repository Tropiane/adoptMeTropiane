import { Router } from "express";

import userController from "../controllers/users.controller.js";
import petsController from "../controllers/pets.controller.js";

const router = Router();

router.get("/mockingpets", async (req, res) => {
        return await petsController.getAllPets(req,res);
});

router.get("/mockinguser", async (req, res)=>{
    return await userController.getAllUsers(req,res);
})

router.post("/generatedata", async (req, res)=>{
    const {pets,users} = req.query;
    const usersCreated = await userController.create(users);
    const petsCreated = await petsController.createPet(pets);

    res.send({status:"success",payload:petsCreated && usersCreated})
})

const mocksRouter = router;

export default mocksRouter;