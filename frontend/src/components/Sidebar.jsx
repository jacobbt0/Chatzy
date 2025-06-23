import { useEffect, useState } from "react";
import { useChatStore } from "../stores/useChatStore";
import { useAuthStore } from "../stores/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Plus } from "lucide-react";


const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    selectedGroup,
    setSelectedUser,
    setSelectedGroup,
    isUsersLoading,
    setCreateGroup,
    groups,
    groupId,
    getGroups
  } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
    getGroups()
  }, [getUsers, getGroups, selectedGroup, groupId]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-20 md:w-52 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-gray-300 w-full p-5">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-3 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm bg-gray-50"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length > 0 ? onlineUsers.length - 1 : 0} online)</span>
        </div>

        <div className="mt-3 flex items-center gap-2">

          <button
            onClick={() => setCreateGroup(true)}
            className="hidden md:flex btn btn-primary w-full text-white shadow-md transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg gap-2"
          >
            <Plus />
            Create / Join Group
          </button>

          <button
            onClick={() => setCreateGroup(true)}
            className="flex md:hidden btn btn-primary text-white shadow-md p-2 transition duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
          >
            <Plus />
          </button>
        </div>

      </div>

      <div className="overflow-y-auto w-full py-3">
        {filteredUsers.map((user) => (
          <button
            key={user._id}
            onClick={() => {
              setSelectedUser(user)
              setCreateGroup(false)
              setSelectedGroup(false)
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedUser?._id === user._id ? "bg-gray-300 ring-1 ring-base-300" : ""}
            `}
          >

            <div className="relative mx-auto lg:mx-0">
              <img
                src={user.profilePic || "/avatar.png"}
                alt={user.name}
                className="size-12 object-cover rounded-full"
              />
              {onlineUsers.includes(user._id) && (
                <span
                  className="absolute bottom-0 right-0 size-3 bg-green-500 
                  rounded-full ring-2 ring-zinc-900"
                />
              )}
            </div>


            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{user.name}</div>
              <div className="text-sm text-zinc-400">
                {onlineUsers.includes(user._id) ? "Online" : "Offline"}
              </div>
            </div>
          </button>
        ))}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No online users</div>
        )}

        {groups.map((group) => (
          <button
            key={group._id}
            onClick={() => {
              setSelectedGroup(group)
              setSelectedUser(null)
              setCreateGroup(false)
            }}
            className={`
              w-full p-3 flex items-center gap-3
              hover:bg-base-300 transition-colors
              ${selectedGroup?._id === group._id ? "bg-base-300 ring-1 ring-base-300" : ""}
            `}
          >

            <div className="relative mx-auto lg:mx-0">
              <img
                src={"/avatar.png"}
                alt={group.groupName}
                className="size-12 object-cover rounded-full"
              />

            </div>

            <div className="hidden lg:block text-left min-w-0">
              <div className="font-medium truncate">{group.groupName}</div>
            </div>
          </button>
        ))}
      </div>


      <div className="w-full ">

      </div>
    </aside>
  );
};
export default Sidebar;