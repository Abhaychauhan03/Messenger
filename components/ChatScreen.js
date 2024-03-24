import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import { auth, db } from "../firebase";
import { useState } from "react";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import Message from "./Message";
import getRecipientEmail from "../utils/getRecipientEmail";
import TimeAgo from "timeago-react";
import { useRef } from "react";
import NotificationIcon from "./icons/NotificationIcon";
import ThreeDots from "./icons/ThreeDots";
import InsertEmoji from "./icons/insertEmoji";
import AttachFile from "./icons/attachFile";
import Image from "next/image";

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const endOfMessagesRef = useRef(null);
  const [input, setInput] = useState("");

  const [messageSnapshot] = useCollection(
    db
      .collection("chats")
      .doc(router.query.id)
      .collection("messages")
      .orderBy("timestamp", "asc")
  );

  const [recipientSnapshot] = useCollection(
    db
      .collection("users")
      .where("email", "==", getRecipientEmail(chat.users, user))
  );

  const showMessages = () => {
    if (messageSnapshot) {
      return messageSnapshot.docs.map((message) => {
        return (
          <Message
            key={message.id}
            user={message.data().user}
            message={{
              ...message.data(),
              timestamp: message.data().timestamp?.toDate().getTime(),
            }}
          />
        );
      });
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={message} />
      ));
    }
  };

  const scrollToBottom = () => {
    endOfMessagesRef.current.scrollIntoView({
      behaviour: "smooth",
      block: "start",
    });
  };

  const sendMessage = (e) => {
    e.preventDefault();

    db.collection("users").doc(user.uid).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    db.collection("chats").doc(router.query.id).collection("messages").add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    });

    setInput("");
    scrollToBottom();
  };
  const recipient = recipientSnapshot?.docs?.[0]?.data();
  const recipientEmail = getRecipientEmail(chat.users, user);

  return (
    <div>
      <div className="items-center shadow-md border-b border-solid border-gray-300 sticky top-0 z-50 bg-white flex p-3 h-20">
        <div className="ml-4 flex-[1]">
          <h3 className="font-bold m-0 mb-1">{recipientEmail}</h3>
          {recipientSnapshot ? (
            <p className="text-sm text-gray-500 m-0">
              Last active:{" "}
              {recipient?.lastSeen?.toDate() ? (
                <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
              ) : (
                "Unavailable"
              )}
            </p>
          ) : (
            <p className="text-sm text-gray-500 m-0">Loading Last active</p>
          )}
        </div>
        <div className="flex items-center">
          <div className="hover:bg-slate-300 p-4 rounded-full">
            <NotificationIcon />
          </div>
          <div className="hover:bg-slate-300 p-4 rounded-full">
            <ThreeDots />
          </div>
          <div className="flex items-center rounded-full hover:bg-slate-300 p-2">
            {recipient ? (
              <Image
                height={40}
                width={40}
                className="rounded-full"
                src={recipient?.photoURL}
              />
            ) : (
              <div className="w-11 h-11 leading-none flex items-center justify-center rounded-full bg-stone-500 uppercase text-white text-3xl font-semibold">
                <p className="mr-[2px] mb-[1px]">{recipientEmail[0]}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="p-7 bg-slate-200 min-h-[90vh]">
        {showMessages()}
        <div className="mb-12" ref={endOfMessagesRef} />
      </div>

      <form className="z-50 shadow-lg flex items-center p-3 sticky bottom-0 bg-white">
        <input
          className="bg-slate-200 p-5 mr-4 flex-[1] outline-0 border-none rounded-lg"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
          }}
        />
        <button hidden disabled={!input} type="submit" onClick={sendMessage}>
          Send Message
        </button>
        <div className="flex items-center justify-around min-w-20">
          <InsertEmoji />
          <AttachFile />
        </div>
      </form>
    </div>
  );
}

export default ChatScreen;
