import { useState } from "react";
import { Plus, Copy } from "lucide-react";
import { useChatStore } from "../stores/useChatStore";
const CreateGroup = () => {
    const [groupName, setGroupName] = useState('');
    const [joinGroupId, setJoinGroupId] = useState('')

    const [copied, setCopied] = useState(false);
    const { createNewGroup, groupId, joinGroup, getGroups, setSelectedUser, setCreateGroup, selectedGroup} = useChatStore()
   
    const handleCopy = () => {
        navigator.clipboard.writeText(groupId?.id);
        if (groupId) setCopied(true);


        setTimeout(() => setCopied(false), 2000); // Reset copy message
    };

    return (
        <div className="flex-1  flex-col overflow-auto items-center justify-center">
            <div className="flex-1 overflow-y-auto p-4 space-y-4 justify-center items-center">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Create a Group Chat</h2>
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text text-black p-1">Group Name</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Group Name"
                        className="input input-bordered w-full text-black text-lg bg-gray-50 "
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </div>

                <div className="flex items-center justify-center  w-fit max-w-md bg-base-200 rounded-xl p-2 ">
                    <input
                        type="text"
                        value={groupId?.id}
                        readOnly
                        className="input input-bordered w-full bg-gray-50 focus:outline-none focus:ring-0 focus:border-transparent text-lg"
                    />
                    <button onClick={handleCopy} className="btn btn-primary ml-2">
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                    </button>
                </div>
                {copied && (
                    <span className="mt-2 text-success font-medium transition-opacity duration-300">
                        Copied to clipboard!
                    </span>
                )}

                <div className="mt-3  flex items-center justify-center gap-2">
                    <button

                        className="btn btn-primary  text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg gap-2"
                        onClick={() => {
                            createNewGroup(groupName)
                            getGroups()
                        }}
                    >
                        <Plus />
                        Create Group
                    </button>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join a Group Chat</h2>
                <div className="form-control mb-6">
                    <label className="label">
                        <span className="label-text text-black p-1">Group ID</span>
                    </label>
                    <input
                        type="text"
                        placeholder="Enter Group ID"
                        className="input input-bordered w-full text-black text-lg"
                        value={joinGroupId}
                        onChange={(e) => setJoinGroupId(e.target.value)}
                    />
                </div>


                <div className="mt-3  flex items-center justify-center gap-2">
                    <button
                        className="btn btn-primary  text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg gap-2"
                        onClick={() => {
                            joinGroup(joinGroupId)
                            setSelectedUser(null)
                            setCreateGroup(false)

                        }}
                    >
                        Join Group
                    </button>
                    {console.log(selectedGroup)}
                </div>

            </div>
        </div >


    )
}

export default CreateGroup