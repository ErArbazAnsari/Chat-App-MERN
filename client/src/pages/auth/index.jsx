import Victory from "../../assets/victory.svg";
import Background from "../../assets/login2.png";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import { LOGIN_ROUTE, SIGNUP_ROUTE } from "@/utils/constants";
import { useNavigate } from "react-router-dom";
import { useAppStore } from "@/store";

const Auth = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();
    const { setUserInfo } = useAppStore();

    const validateSignup = () => {
        if (email === "" || password === "" || confirmPassword === "") {
            toast.error("Please fill all fields");
            return false;
        }
        if (password !== confirmPassword) {
            toast.error("Passwords do not match");
            return false;
        }
        return true;
    };

    const validateLogin = () => {
        if (email === "" || password === "") {
            toast.error("Please fill all fields");
            return false;
        }
        return true;
    };

    const handleLogin = async () => {
        try {
            if (validateLogin()) {
                const response = await apiClient.post(
                    LOGIN_ROUTE,
                    {
                        email,
                        password,
                    },
                    { withCredentials: true }
                );
                // console.log({ response });
                toast.success("Login successful");
                setEmail("");
                setPassword("");
                if (response.data.user.id) {
                    setUserInfo(response.data.user);
                    if (response.data.user.profileSetup) {
                        navigate("/chat");
                    } else {
                        navigate("/profile");
                    }
                }
            }
        } catch (error) {
            console.log({ error });
            toast.error("Invalid credentials");
        }
    };
    const handleSignup = async () => {
        try {
            if (validateSignup()) {
                const response = await apiClient.post(
                    SIGNUP_ROUTE,
                    {
                        email,
                        password,
                    },
                    { withCredentials: true }
                );
                console.log({ response });
                toast.success("Signup successful");
                setEmail("");
                setPassword("");
                setConfirmPassword("");

                if (response.status === 201) {
                    setUserInfo(response.data.user);
                    navigate("/profile");
                }
            }
        } catch (error) {
            console.log({ error });
            toast.error("Signup failed");
        }
    };

    return (
        <div className="h-[100vh] flex justify-center items-center">
            <div className="bg-white border shadow-lg w-full max-w-4xl rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
                {/* Left Section */}
                <div className="flex flex-col gap-10 p-8 justify-center items-center lg:p-16 bg-gray-50">
                    <div className="flex items-center justify-center flex-col">
                        <h1 className="text-3xl font-bold md:text-4xl lg:text-5xl text-center">
                            Welcome
                        </h1>
                        <img
                            src={Victory}
                            alt="Victory Emoji"
                            className="h-16 md:h-20 lg:h-24 mt-4"
                        />
                        <p className="text-center text-gray-600 mt-4">
                            We are happy to see you here. Please login to
                            continue.
                        </p>
                    </div>

                    {/* Tabs for Login/Signup */}
                    <Tabs className="w-full" defaultValue="login">
                        <TabsList className="w-full flex justify-center border-b border-gray-200">
                            <TabsTrigger
                                value="login"
                                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                            >
                                Login
                            </TabsTrigger>
                            <TabsTrigger
                                value="signup"
                                className="data-[state=active]:bg-transparent text-black text-opacity-90 border-b-2 rounded-none w-full data-[state=active]:text-black data-[state=active]:font-semibold data-[state=active]:border-b-purple-500 p-3 transition-all duration-300"
                            >
                                Signup
                            </TabsTrigger>
                        </TabsList>

                        {/* Login Form */}
                        <TabsContent className="mt-10 space-y-5" value="login">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <Button
                                className="w-full p-4 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
                                onClick={handleLogin}
                            >
                                Login
                            </Button>
                        </TabsContent>

                        {/* Signup Form */}
                        <TabsContent className="mt-10 space-y-5" value="signup">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <input
                                type="password"
                                placeholder="Confirm Password"
                                className="w-full p-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                            />
                            <Button
                                className="w-full p-4 rounded-full bg-purple-500 text-white font-semibold hover:bg-purple-600 transition"
                                onClick={handleSignup}
                            >
                                Signup
                            </Button>
                        </TabsContent>
                    </Tabs>
                </div>

                {/* Right Section (Background Image) */}
                <div className="hidden lg:flex items-center justify-center">
                    <img
                        src={Background}
                        alt="Background"
                        className="w-full h-full object-cover"
                    />
                </div>
            </div>
        </div>
    );
};

export default Auth;
