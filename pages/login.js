import Head from "next/head";
import { auth, provider } from "../firebase";
function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert);
  };

  return (
    <div className="grid items-center justify-center h-[100vh] bg-[#f7fbfc]">
      <Head>
        <title>Login</title>
      </Head>

      <div className="p-24 flex flex-col items-center bg-white rounded shadow-lg">
        <img className="w-60 mb-12" src="/logo.png" />
        <button
          className="bg-teal-500 font-semibold py-3 px-12 text-white rounded-md"
          onClick={signIn}
        >
          <b>Sign in with Google</b>
        </button>
      </div>
    </div>
  );
}

export default Login;
