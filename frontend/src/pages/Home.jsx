import { useChatStore } from "../stores/useChatStore";

import Sidebar from "../components/Sidebar";
import NoChatSelected from "../components/NoChatSelected";
import ChatContainer from "../components/ChatContainer";
import CreateGroup from "../components/CreateGroup";

const Home = () => {
    const { selectedUser, createGroup, selectedGroup, } = useChatStore();


    return (
        <div className="h-screen bg-gray-200 text-black">
            <div className="flex items-center justify-center pt-20 px-4 bg-gray-200">
                <div className="bg-gray-100 rounded-lg shadow-cl w-full max-w-6xl h-[calc(100vh-8rem)]">
                    <div className="flex h-full rounded-lg overflow-hidden">
                       
                        <Sidebar />
                        
                        {createGroup ?
                            <CreateGroup /> :
                            (!selectedUser && !selectedGroup) ?
                                <NoChatSelected /> : <ChatContainer />}

                    </div>
                </div>
            </div>
        </div>

    );
};

export default Home
