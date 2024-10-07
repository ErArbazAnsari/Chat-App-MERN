import React from "react";

const ContactsContainer = () => {
    return (
        <div className="relative md:w-[35vw] lg:w-[30vw] xl:w-[20vw] bg-black border-r-2 border-[#2f30b] w-full">
            <div className="pt-3 text-3xl lg:text-5xl text-center">
                <span className="text-purple-500">Synchronus</span>Chat
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Direct Messages" />
                </div>
            </div>
            <div className="my-5">
                <div className="flex items-center justify-between pr-10">
                    <Title text="Channels" />
                </div>
            </div>
        </div>
    );
};

export default ContactsContainer;

const Title = ({ text }) => {
    return (
        <h6 className="uppercase tracking-widest text-neutral-400 pl-10 font-light text-opacity-90 text-sm">
            {text}
        </h6>
    );
};
