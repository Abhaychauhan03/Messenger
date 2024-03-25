import moment from "moment/moment";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  return (
    <div>
      {user === userLoggedIn.email ? (
        <p className="ml-auto pb-4 bg-teal-500 text-right text-white pr-14 min-w-16  relative m-3 w-fit p-4 rounded-lg">
          {message.message}
          <span className="bottom-0 text-right right-0 text-gray-300 p-3 text-[9px] absolute ">
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </span>
        </p>
      ) : (
        <p className="bg-violet-500 text-left pb-4  text-white pr-14 min-w-16  relative m-3 w-fit p-4 rounded-lg">
          {message.message}
          <span className="bottom-0 text-right right-0 text-gray-300 p-3 text-[9px] absolute ">
            {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
          </span>
        </p>
      )}
    </div>
  );
}

export default Message;
