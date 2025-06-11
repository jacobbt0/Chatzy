import { useState } from "react"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { GoogleOAuthProvider, GoogleLogin } from '@react-oauth/google'
import { useAuthStore } from "../stores/useAuthStore"


const Login = () => {

    const [formData, setFormData] = useState({
        phone: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const { login, loginWithGoogle, loading } = useAuthStore()

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            login(formData)
            setFormData({ phone: "", password: "", });
        } catch (err) {
          
            toast.error("Login failed. Please try again")
        }
    };

    const handleLoginSuccess = (response) => {
        const token = response.credential;
        loginWithGoogle(token);
    };

    const handleLoginFailure = (error) => {
        console.log('Login Failed:', error);
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-200 text-black">

            <div className="w-full max-w-md p-8 space-y-4 rounded-xl shadow-xl bg-gray-200">

                <h2 className="text-2xl font-bold text-center">Login</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
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
                            className="input input-bordered w-full bg-gray-50"
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
                                className="input input-bordered w-full pr-10 bg-gray-50"
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

                    <button type="submit" className="btn bg-blue-600 textarea-lg text-amber-100 w-full">
                        {loading ? (
                            <>
                                <Loader2 className="h-5 w-5 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Login"
                        )}
                    </button>

                    <div className='mt-5 text-center border-2 rounded-sm'>

                        <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>

                            <GoogleLogin onSuccess={handleLoginSuccess} onError={handleLoginFailure} useOneTap />
                        </GoogleOAuthProvider>
                    </div>

                    <p className="text-sm text-center">
                        Create an account? <a className="link text-blue-600" href="/signup">Sign Up</a>
                    </p>

                </form>
            </div>
        </div>
    );
}

export default Login