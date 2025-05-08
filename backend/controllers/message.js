import User from "../models/auth.js";
import Message from "../models/message.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io, groupName } from "../lib/socket.js"
import Group from "../models/group.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select('-password')
        res.status(200).json(filteredUsers)
    } catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("Error in getMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getGroupMessages = async (req, res) => {
    try {
        const { id: groupId } = req.params;
        const myId = req.user._id;

        const groupMessages = await Message.find({
            receiverId: groupId
        }).populate('senderId');

        res.status(200).json(groupMessages);

    } catch (error) {
        console.log("Error in getGroupMessages controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getReceiverSocketId(receiverId);

        if (receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const sendGroupMessage = async (req, res) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl;
        if (image) {
            // Upload base64 image to cloudinary
            const uploadResponse = await cloudinary.uploader.upload(image);
            imageUrl = uploadResponse.secure_url;
        }

        const newMessage = new Message({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();

            io.to(groupName).emit("newGroupMessage", newMessage);
        console.log(groupName,"groupName")
        res.status(201).json(newMessage);
    } catch (error) {
        console.log("Error in sendGroupMessage controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const createGroup = async (req, res) => {
    try {
        const { groupName } = req.body
        const admin = req.user._id
        const group = await Group.create({ groupName, admin })
        res.status(201).json({ id: group._id })

    } catch (error) {
        console.log("Error in createGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const joinGroup = async (req, res) => {
    try {

        const { id: groupId } = req.body
        const member = req.user._id

        const group = await Group.findByIdAndUpdate(groupId,
            { $addToSet: { members: member } },
            { new: true })
        
        res.status(201).json( group )
    } catch (error) {
        console.log("Error in joinGroup controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const getGroups = async (req, res) => {
    try {
        const loggedInUserId = req.user._id
        const filteredGroups = await Group.find({
            $or: [
                { admin: loggedInUserId },
                { members: loggedInUserId },

            ]
        })
        res.status(200).json(filteredGroups)
    } catch (error) {
        console.log("Error in getGroups controller: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}