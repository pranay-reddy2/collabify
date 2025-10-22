import express from "express";
import { login, register } from "../controllers/auth.controller.js";

const AuthRouter = express();

AuthRouter.post("/register", register);
AuthRouter.post("/login", login);

export default AuthRouter;
