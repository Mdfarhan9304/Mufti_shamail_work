import express, { Router } from "express";
import { updateUserProfile } from "../controllers/userController";

const router: Router = express.Router();

// Protected routes
router.put("/profile/:userId", updateUserProfile);

export default router;
