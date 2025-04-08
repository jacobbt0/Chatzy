import User from '../models/auth.js'
import jwt from 'jsonwebtoken'
import cloudinary from "../lib/cloudinary.js"; 


const generateTokens = (userId) => {
	const accessToken = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, {
		expiresIn: "15m",
	});

	const refreshToken = jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, {
		expiresIn: "7d",
	});

	return { accessToken, refreshToken }
}

const setCookies = (res, accessToken, refreshToken) => {
	res.cookie("accessToken", accessToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 15 * 60 * 1000, // 15 minutes
	})
	res.cookie("refreshToken", refreshToken, {
		httpOnly: true, // prevent XSS attacks, cross site scripting attack
		secure: process.env.NODE_ENV === "production",
		sameSite: "strict", // prevents CSRF attack, cross-site request forgery attack
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	})
}


export const signup = async (req, res) => {

	const { name, phone, password } = req.body
	try {
		const userExist = await User.findOne({ phone })

		if (userExist) {
			return res.status(400).json({ message: "User already exists" })
		}

		const user = await User.create({ name, phone, password })

		const { accessToken, refreshToken } = generateTokens(user._id)


		setCookies(res, accessToken, refreshToken)

		res.status(201).json({
			message: "User created successfully",
			_id: user._id,
			name: user.name,
			phone: user.phone,
			role: user.role
		})

	} catch (error) {
		console.log("Error in signup controller", error.message)
		res.status(500).json({ message: error.message })
	}
}

export const login = async (req, res) => {
	const { phone, password } = req.body
	try {
		const user = await User.findOne({ phone })
		if (user && (await user.comparePassword(password))) {

			const { accessToken, refreshToken } = generateTokens(user._id)

			setCookies(res, accessToken, refreshToken)

			res.status(201).json({
				_id: user._id,
				name: user.name,
				phone: user.phone,
				role: user.role
			})
		} else {
			return res.status(400).json({ message: "Invalid phone or password" })
		}

	} catch (error) {
		console.log("Error in login controller", error.message);
		res.status(500).json({ message: error.message });
	}
}

export const loginWithGoogle = async (req, res) => {

	const { token } = req.body
	const name = jwt.decode(token).name
	const email = jwt.decode(token).email
	const profilePic = jwt.decode(token).picture


	try {
		const user = await User.findOne({ email })
		if (user) {
			const { accessToken, refreshToken } = generateTokens(user._id)

			setCookies(res, accessToken, refreshToken)

			res.status(201).json({
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			})
		} else {
			const user = await User.create({ name, email, profilePic })

			const { accessToken, refreshToken } = generateTokens(user._id)

			setCookies(res, accessToken, refreshToken)

			res.status(201).json({
				message: "User created successfully",
				_id: user._id,
				name: user.name,
				email: user.email,
				role: user.role
			})

		}
	} catch (error) {
		console.log("Error in loginWithGoogle controller", error.message);
		res.status(500).json({ message: error.message });
	}
}

export const logout = async (req, res) => {
	try {
		res.clearCookie("accessToken");
		res.clearCookie("refreshToken");
		res.json({ message: "Logged out successfully" });
	} catch (error) {
		console.log("Error in logout controller", error.message);
		res.status(500).json({ message: "Server error", error: error.message });
	}
}

export const updateProfile = async (req, res) => {
	try {
		const { profilePic, name } = req.body;
		
		const userId = req.user._id;
		if(name){
			let updatedUser = await User.findByIdAndUpdate(
				userId,
				{ name: name },
				{ new: true }
			)
			res.status(200).json(updatedUser)
		}

		if (profilePic) {
			const uploadResponse = await cloudinary.uploader.upload(profilePic);
			let updatedUser = await User.findByIdAndUpdate(
				userId,
				{ profilePic: uploadResponse.secure_url, },
				{ new: true }
			);
			res.status(200).json(updatedUser);
		}

		
	} catch (error) {
		console.log("error in update profile:", error);
		res.status(500).json({ message: "Internal server error" });
	}
};

export const refreshToken = async (req, res) => {
	try {
		const refreshToken = req.cookies.refreshToken

		if (!refreshToken) {
			return res.status(401).json({ message: "No refresh token provided" })
		}

		const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET)

		const accessToken = jwt.sign({ userId: decoded.userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" })

		res.cookie("accessToken", accessToken, {
			httpOnly: true,
			secure: process.env.NODE_ENV === "production",
			sameSite: "strict",
			maxAge: 15 * 60 * 1000,
		});

		res.json({ message: "Token refreshed successfully" });
	} catch (error) {
		console.log("Error in refreshToken controller", error.message)
		res.status(500).json({ message: "Server error", error: error.message })
	}
}

export const getProfile = async (req, res) => {
	try {
		res.json(req.user)
	} catch (error) {
		res.status(500).json({ message: "Server error", error: error.message })
	}
}

export const getUser = async (req, res) => {
	const { id } = req.params
	try {
		const user = await User.findById(id)
		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		res.status(200).json(user)

	} catch (error) {
		console.error("Error fetching user:", error);
		res.status(500).json({ error: "Internal server error" });
	}
}

export const getAllUsers = async (req, res) => {
	try {
		const users = await User.find({ role: { $ne: "admin" } })
		res.json(users)
	} catch (error) {
		console.log("Error in getAllReports controllers", error.message)
		res.status(500).json({ message: "server error" })
	}
}