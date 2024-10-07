import { useAppStore } from "@/store";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { colors, getColor } from "@/lib/utils";
import { FaPlus, FaTrash } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { apiClient } from "@/lib/api-client";
import {
    ADD_PROFILE_IMAGE_ROUTE,
    DELETE_PROFILE_IMAGE_ROUTE,
    HOST,
    UPDATE_PROFILE_ROUTE,
} from "@/utils/constants";
import { useEffect } from "react";
import { useRef } from "react";

const Profile = () => {
    const navigate = useNavigate();
    const { userInfo, setUserInfo } = useAppStore();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [image, setImage] = useState(null);
    const [hovered, setHovered] = useState(false);
    const [selectedColor, setSelectedColor] = useState(0);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (userInfo.profileSetup) {
            setFirstName(userInfo.firstName);
            setLastName(userInfo.lastName);
            setSelectedColor(userInfo.color);
        }
        if (userInfo.image) {
            setImage(`${HOST}/${userInfo.image}`);
        }
    }, [userInfo]);

    const validateProfile = () => {
        if (!firstName && !lastName) {
            toast.error("Please fill all fields");
            return false;
        }
        return true;
    };

    const saveChanges = async () => {
        if (validateProfile()) {
            try {
                const response = await apiClient.post(
                    UPDATE_PROFILE_ROUTE,
                    {
                        firstName,
                        lastName,
                        color: selectedColor,
                    },
                    { withCredentials: true }
                );
                if (response.status === 200 && response.data) {
                    setUserInfo({ ...response.data });
                    toast.success("Profile updated successfully");
                    navigate("/chat");
                }
            } catch (error) {
                console.log({ error });
            }
        }
    };

    const handleNavigate = () => {
        if (userInfo.profileSetup) {
            navigate("/chat");
        } else {
            toast.error("Please setup your profile first");
        }
    };

    const handleFileInputClick = () => {
        fileInputRef.current.click();
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        // console.log({ file });
        if (file) {
            const formData = new FormData();
            formData.append("profile-image", file);
            const response = await apiClient.post(
                ADD_PROFILE_IMAGE_ROUTE,
                formData,
                { withCredentials: true }
            );
            if (response.status === 200 && response.data.image) {
                setUserInfo({ ...userInfo, image: response.data.image });
                toast.success("Image uploaded successfully");
            }
        }
    };

    const handleDeleteImage = async () => {
        try {
            const response = await apiClient.delete(
                DELETE_PROFILE_IMAGE_ROUTE,
                {
                    withCredentials: true,
                }
            );
            if (response.status === 200) {
                setUserInfo({ ...userInfo, image: null });
                toast.success("Image deleted successfully");
                setImage(null);
            }
        } catch (error) {
            console.log({ error });
        }
    };
    return (
        <div className="bg-[#1b1c24] flex justify-center items-center h-[100vh]">
            <div className="flex items-center justify-center rounded-2xl shadow-lg">
                <div className="flex flex-col gap-10 w-[80vw] md:w-max">
                    <div>
                        <IoArrowBack
                            className="text-4xl lg:text-6xl text-white/90 cursor-pointer"
                            onClick={handleNavigate}
                        />
                    </div>
                    <div className="grid lg:grid-cols-2 md:grid-cols-2">
                        <div
                            className="h-full w-32 md:w-48 md:h-48 relative flex justify-center items-center"
                            onMouseEnter={() => setHovered(true)}
                            onMouseLeave={() => setHovered(false)}
                        >
                            <Avatar className=" h-32 w-32 md:w-48 md:h-48 rounded-full overflow-hidden">
                                {image ? (
                                    <AvatarImage
                                        className="object-cover w-full h-full bg-black"
                                        src={image}
                                        alt="profile pic"
                                    />
                                ) : (
                                    <div
                                        className={`uppercase h-32 w-32 md:w-48 md:h-48 text-5xl border-[2px] flex items-center justify-center rounded-full ${getColor(
                                            selectedColor
                                        )}`}
                                    >
                                        {firstName
                                            ? firstName.split("").shift()
                                            : userInfo.email.split("").shift()}
                                    </div>
                                )}
                            </Avatar>
                            {hovered && (
                                <div
                                    className="absolute inset-0 flex items-center justify-center bg-black/50 ring-fuchsia-50 rounded-full"
                                    onClick={
                                        image
                                            ? handleDeleteImage
                                            : handleFileInputClick
                                    }
                                >
                                    {image ? (
                                        <FaTrash className="text-white text-3xl cursor-pointer" />
                                    ) : (
                                        <FaPlus className="text-white text-3xl cursor-pointer" />
                                    )}
                                </div>
                            )}
                            {
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImageChange}
                                    name="profile-image"
                                    accept=".png, .jpg, .jpeg, .svg, .webp"
                                />
                            }
                        </div>
                        <div className="flex min-w-32 md:min-w-64 flex-col gap-5 text-white items-center justify-center ">
                            <div className="w-full ">
                                <Input
                                    placeholder="Email"
                                    type="email"
                                    disabled
                                    value={userInfo.email}
                                    className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                />
                            </div>
                            <div className="w-full ">
                                <Input
                                    placeholder="First Name"
                                    type="text"
                                    value={firstName}
                                    onChange={(e) =>
                                        setFirstName(e.target.value)
                                    }
                                    className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                />
                            </div>
                            <div className="w-full ">
                                <Input
                                    placeholder="Last Name"
                                    type="text"
                                    value={lastName}
                                    onChange={(e) =>
                                        setLastName(e.target.value)
                                    }
                                    className="rounded-lg p-6 bg-[#2c2e3b] border-none"
                                />
                            </div>
                            <div className="flex w-full gap-5">
                                {colors.map((color, index) => (
                                    <div
                                        className={`${color} h-8 w-8 rounded-full cursor-pointer transition-all duration-300 ${
                                            selectedColor === index
                                                ? "outline outline-white/60 outline-3"
                                                : ""
                                        }`}
                                        key={index}
                                        onClick={() => setSelectedColor(index)}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                        <Button
                            className="h-16 w-full bg-purple-700 hover:bg-purple-900 transition-all duration-300"
                            onClick={saveChanges}
                        >
                            Save Changes
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
