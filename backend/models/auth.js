import mongoose from 'mongoose'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
        },
        phone: {
            type: Number,
            minlength:10,
            maxlength: 10,
            unique: true,
            sparse: true,
            trim: true,

        },
        email: {
            type: String,
            unique: true,
            sparse: true,

        },
        password: {
            type: String,

            minlength: [6, "Password must be at least 6 characters long"],
        },
        profilePic: {
            type: String,
            default: "",
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user",
        }, 
        banned: {
            type: Boolean,
            default: false, 
        }

    }, {
    timestamps: true,
}
)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next()
    try {
        const salt = await bcrypt.genSalt(10)
        this.password = await bcrypt.hash(this.password, salt)
        next()
    } catch (error) {
        next(error)
    }
})

userSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password)
}

const User = mongoose.model("User", userSchema)

export default User