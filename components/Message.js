import moment from "moment/moment";
import { useAuthState } from "react-firebase-hooks/auth";
import styled from "styled-components";
import { auth } from "../firebase";

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth);
  const TypeOfMessage = user === userLoggedIn.email ? Sender : Receiver;
  return (
    <Container>
      <TypeOfMessage>
        {message.message}
        <Timestamp>
          {message.timestamp ? moment(message.timestamp).format("LT") : "..."}
        </Timestamp>
      </TypeOfMessage>
    </Container>
  );
}

export default Message;

const Container = styled.div``;

const MessageElement = styled.p`
  width: fit-content;
  padding: 15px;
  border-radius: 8px;
  margin: 10px;
  padding-right: 60px;
  min-width: 68px;
  padding-bottom: 26px;
  position: relative;
  text-align: right;
  color: white;
`;

const Sender = styled(MessageElement)`
  margin-left: auto;
  background-color: #009bca;
  padding-bottom: 15px;
`;

const Receiver = styled(MessageElement)`
  background-color: #673bb7;
  text-align: left;
  padding-bottom: 15px;
`;

const Timestamp = styled.span`
  color: lightgrey;
  padding: 10px;
  font-size: 9px;
  position: absolute;
  bottom: 0;
  text-align: right;
  right: 0;
`;
