import express, { Router } from "express";
import {
	addAddress,
	deleteAddress,
	getAddresses,
	updateAddress,
} from "../controllers/addressController";
import { protect } from "../middlewares/auth";

const router: Router = Router();

router.get("/:userId", protect, getAddresses);
router.post("/", protect, addAddress);
router.put("/:addressId", protect, updateAddress);
router.delete("/:addressId", protect, deleteAddress);

export default router;
