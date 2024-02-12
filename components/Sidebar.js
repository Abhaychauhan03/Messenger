import styled from "styled-components";
import { Avatar, Button, createTheme, ThemeProvider } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import * as EmailValidator from "email-validator";
import { auth, db } from "../firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useCollection } from "react-firebase-hooks/firestore";
import Chat from "./Chat";
import { AddCircleRounded } from "@material-ui/icons";

const theme = createTheme({
  palette: {
    primary: {
      main: "#009BCA",
    },
    secondary: {
      main: "#673BB7",
    },
  },
});

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
    <Container>
      <Header>
        <Logo src="/hlogo.png" />
        <UserAvatar src={user?.photoURL} onClick={() => auth.signOut()} />
      </Header>

      <Search>
        <SearchIcon />
        <SearchInput placeholder="Search for people and groups" />
      </Search>

      <ThemeProvider theme={theme}>
        <SidebarButton
          onClick={createChat}
          style={{ color: "#455a64", fontWeight: "600" }}
        >
          <Addicon>
            <AddCircleRounded fontSize="large" color="primary" />
          </Addicon>
          New Conversation
        </SidebarButton>
      </ThemeProvider>

      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </Container>
  );
}

export default Sidebar;

const Container = styled.div`
  flex: 0.45;
  border-right: 1px solid whitesmoke;
  height: 100vh;
  min-width: 300px;
  max-width: 350px;
  overflow-y: scroll;
  color: #455a64;
  font-weight: 500;

  ::-webkit-scrollbar {
    display: none;
  }

  -ms-overflow-style: none;
  scrollbar-width: none;
`;

const Header = styled.div`
  display: flex;
  position: sticky;
  top: 0;
  background-color: white;
  z-index: 1;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  height: 80px;
  border-bottom: 1px solid whitesmoke;
`;

const Logo = styled.img`
  width: 125px;
`;

const UserAvatar = styled(Avatar)``;

const Search = styled.div`
  display: flex;
  align-items: center;
  padding: 20px;
  border-radius: 2px;
`;

const SearchInput = styled.input`
  outline-width: 0;
  border: none;
  flex: 1;
  margin-left: 10px;
`;

const Addicon = styled.div`
  display: flex;
  align-items: center;
  margin-right: 10px;
`;

const SidebarButton = styled(Button)`
  width: 100%;

  &&& {
    background-color: aliceblue;
    border-top: 1px solid whitesmoke;
    border-bottom: 1px solid whitesmoke;
  }
`;
