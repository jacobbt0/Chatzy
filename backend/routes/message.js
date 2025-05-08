import express from "express";
import { protectRoute } from "../middleware/middleware.js";
import { getMessages, getUsersForSidebar, sendMessage, sendGroupMessage, createGroup, joinGroup, getGroups, getGroupMessages } from "../controllers/message.js";

const router = express.Router();

router.get("/users", protectRoute, getUsersForSidebar);
router.post("/create", protectRoute, createGroup)
router.post("/join", protectRoute, joinGroup)
router.get("/group", protectRoute, getGroups)
router.get("/group/:id", protectRoute, getGroupMessages)
router.post("/send/:id", protectRoute, sendMessage);
router.post("/send-group/:id", protectRoute, sendGroupMessage)
router.get("/receive/:id", protectRoute, getMessages);

export default router;
