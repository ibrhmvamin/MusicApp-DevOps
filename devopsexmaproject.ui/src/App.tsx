import { Route, Routes } from "react-router-dom";
import "./App.css";
import SignUpPage from "./pages/SignUpPage";
import SignInPage from "./pages/SignInPage";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from "react";

function App() {
  const [checkToken, setCheckToken] = useState(false);

  useEffect(() => {
    interface Mp3Token {
      Token: string;
      UserId: string;
      Date: Date;
      UserName: string;
      Email: string;
      LikeLimit: number;
    }

    const mp3TokenObjString = localStorage.getItem("mp3TokenObj");

    if (mp3TokenObjString) {
      const mp3TokenObj = JSON.parse(mp3TokenObjString) as Mp3Token;

      mp3TokenObj.Date = new Date(mp3TokenObj.Date);

      const currentTime = new Date();
      const isTokenExpired = currentTime > mp3TokenObj.Date;

      if (isTokenExpired) {
        localStorage.removeItem("mp3TokenObj");
        setCheckToken(false);
        document.location.href = "/";
      } else {
        setCheckToken(true);
      }
    } else {
      setCheckToken(false);
    }
    console.log("Token  :  ", checkToken);
  }, []);

  return (
    <>
      {checkToken ? (
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="/" element={<SignInPage />} />
          <Route path="/SignIn" element={<SignInPage />} />
          <Route path="/SignUp" element={<SignUpPage />} />
        </Routes>
      )}
    </>
  );
}

export default App;
