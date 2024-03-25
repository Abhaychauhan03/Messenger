import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import getRecipientEmail from "../utils/getRecipientEmail";
import Image from "next/image";

function Chat({ id, users }) {
  const router = useRouter();
  const [user] = useAuthState(auth);

  const [recipientSnapshot] = useCollection(
    db.collection("users").where("email", "==", getRecipientEmail(users, user))
  );

  const enterChat = () => {
    router.push(`/chat/${id}`);
  };

  const recipient = recipientSnapshot?.docs?.[0]?.data();

  const recipientEmail = getRecipientEmail(users, user);

  return (
    <div
      className="flex hover:bg-slate-100 gap-x-4 ml-2 items-center cursor-pointer p-4 break-words"
      onClick={enterChat}
    >
      {recipient ? (
        <Image
          height={40}
          width={40}
          className="rounded-full"
          src={recipient?.photoURL}
        />
      ) : (
        <div className="w-10 h-10 leading-none flex items-center justify-center rounded-full bg-stone-500 uppercase text-white text-2xl font-semibold">
          <p>{recipientEmail[0]}</p>
        </div>
      )}

      <p>{recipientEmail}</p>
    </div>
  );
}

export default Chat;
