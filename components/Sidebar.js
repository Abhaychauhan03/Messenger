import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import SearchIcon from "./icons/SearchIcon";
import AddCircle from "./icons/AddCircle";
import Image from "next/image";

function Sidebar() {
  const [user] = useAuthState(auth);
  const userChatRef = db
    .collection("chats")
    .where("users", "array-contains", user.email);

  const [chatsSnapshot] = useCollection(userChatRef);

  const createChat = () => {
    const input = prompt(
      "Please enter email address of the user you wish to chat with"
    );

    if (!input) {
      return null;
    }

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection("chats").add({
        users: [user.email, input],
      });
    }
  };

  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find((chat) =>
      chat.data().users.find((user) => user === recipientEmail)
    );
  return (
    <div className="no-scrollbar text-slate-700 font-medium min-w-80 max-w-96 overflow-y-scroll flex-[0.45] border-r border-solid border-slate-300 h-[100vh]">
      <div className="p-4 h-20 border-b border-solid border-slate-300 flex sticky top-0 bg-white z-10 justify-between items-center">
        <img className="w-32" src="/hlogo.png" />
        <Image
          height={40}
          width={40}
          className="rounded-full"
          src={user?.photoURL}
          onClick={() => auth.signOut()}
        />
      </div>
      <div className="flex items-center p-3 m-1 rounded-md border-stone-300 border">
        <SearchIcon />
        <input
          className="outline-0 border-none flex-[1] ml-2"
          placeholder="Search for people and groups"
        />
      </div>

      <button
        className="w-full text-slate-700  flex items-center font-bold justify-center py-3 bg-blue-200 border-t border-solid border-slate-300"
        onClick={createChat}
      >
        <AddCircle />
        New Conversation
      </button>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </div>
  );
}

export default Sidebar;
