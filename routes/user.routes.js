import { Router } from "express";
import {createUser,updateUser,fetchUsers,showUser,deleteUser} from '../controllers/user.controller.js';

const router = Router();

router.post("/create",createUser);
router.put("/update/:id",updateUser);
router.get("/get",fetchUsers);
router.get("/get/:id",showUser);
router.delete("/delete/:id",deleteUser);

export default router;