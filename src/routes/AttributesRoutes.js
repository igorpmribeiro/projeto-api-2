import express from "express";
import { AttributesController } from "../controllers/AttributesController.js";

const attributesRouter = express.Router();

const attributesController = new AttributesController();

attributesRouter.post("/insert", attributesController.create);