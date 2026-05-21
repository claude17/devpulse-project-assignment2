import { Router } from "express";

const router = Router();

router.post("/signup");

// router.post("/login", authController.loginUser);

export const authRoute = router;
