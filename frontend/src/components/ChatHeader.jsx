import { X } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useChatStore } from "../stores/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, selectedGroup, setSelectedGroup } = useChatStore();
  const { onlineUsers } = useAuthStore();


  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img src={selectedUser?.profilePic || "/avatar.png"} alt={selectedUser?.name} />
            </div>
          </div>

          {/* User info */}
          <div>
            <h3 className="font-medium">{selectedUser?.name || selectedGroup?.groupName}</h3>
            {selectedUser &&
              (
                <p className="text-sm text-base-content/70">
                  {onlineUsers.includes(selectedUser?._id) ? "Online" : "Offline"}
                </p>
              )}
            {
              selectedGroup && (
                <p className="text-sm text-base-content/70">
                  {selectedGroup._id}
                </p>
              )
            }
          </div>
        </div>

        <div className="flex gap-7">

          <button onClick={() => {
            setSelectedUser(null)
            setSelectedGroup(null)
          }} className="cursor-pointer">
            <X />
          </button>
        </div>
      </div>
    </div>

  );
};
export default ChatHeader;