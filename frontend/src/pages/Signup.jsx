import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { toast } from "react-hot-toast";

import { useAuthStore } from "../stores/useAuthStore"

const Signup = () => {

    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        confirmPassword: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
   
    const { loginWithGoogle, signup, loading} = useAuthStore()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return toast.error("Password do not match")
        }
        if (formData.password.length < 6) {
            return toast.error("Password must be at least 6 characters long");
          }
          if( formData.phone.length < 10 || formData.phone.length > 10 ){
            return toast.error("Enter a valid Phone Number");
          }

        try {
            signup(formData)
            setFormData({ name: "", phone: "", password: "", confirmPassword: "" });
            
        } catch (err) {
           console.log("ERROR IN SIGNUP",err)
           toast.error("Signup failed. Please try again")
        }
    };

    const handleLoginSuccess = (response) => {
        const token = response.credential
        loginWithGoogle(token)
        
    };

    const handleLoginFailure = (error) => {
        console.log('Login Failed:', error)
        
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-4 bg-base-100 rounded-xl shadow-xl">
                <h2 className="text-2xl font-bold text-center">Sign Up</h2>

                

                <form onSubmit={handleSubmit} className="space-y-4">
                 
                    <div>
                        <label className="label">Username</label>
                        <input
                            type="text"
                            name="name"
                            className="input input-bordered w-full"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">
                            <span className="label-text">Phone Number</span>
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={(e) => {
                                const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                                setFormData({ ...formData, phone: onlyNums });
                              }}
                            className="input input-bordered w-full"
                            maxLength={10}
                            required
                        />
                    </div>

                    <div>
                        <label className="label">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                className="input input-bordered w-full pr-10"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="label">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirmPassword"
                                className="input input-bordered w-full pr-10"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                            <span
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </span>
                        </div>
                    </div>

                    <button type="submit" className="btn bg-blue-600 textarea-lg text-amber-100 w-full">
                    {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Sign Up"
                        )}
                    </button>

                    <div className='mt-5 text-center border-2 rounded-sm'>

                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

                            <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} useOneTap />
                        </GoogleOAuthProvider>
                    </div>

                    <p className="text-sm text-center">
                        Already have an account? <a className="link text-blue-600" href="/login">Login</a>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Signup