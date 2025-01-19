import axios from "axios";
import { ChangeEvent, FormEvent, useState } from "react";

const SignInPage = () => {
  const [showPassword, setShowPassword] = useState(false);

  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [errorMessage, setErrorMessage] = useState<string>("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!userName || !email || !password) {
      const missingFields = [];
      if (!userName) missingFields.push("Username");
      if (!email) missingFields.push("Email");
      if (!password) missingFields.push("Password");
      setErrorMessage(`${missingFields.join(", ")} can't be empty.`);
      return;
    }

    try {
      const dto = {
        UserName: userName,
        Email: email,
        Password: password,
      };
      const response = await axios.post(
        `http://localhost:5001/auth/signin`,
        dto,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data === "not found") {
        setErrorMessage("User Not Found");
        return;
      }

      const mp3TokenObj = {
        Token: response.data.token,
        UserId: response.data.userId,
        Date: new Date(response.data.expiration),
        UserName: userName,
        Email: email,
        LikeLimit: 10,
      };

      localStorage.setItem("mp3TokenObj", JSON.stringify(mp3TokenObj));
      document.location.href = "/";
    } catch (error) {
      console.error("Error during check", error);
      setErrorMessage("An unexpected error occurred. Please try again later.");
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{
        backgroundColor: "#121212",
        color: "white",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <div
        className="card p-4"
        style={{
          width: "360px",
          borderRadius: "12px",
          background: "#181818",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          color: "white",
        }}
      >
        <h3
          className="text-center mb-3"
          style={{ fontWeight: "bold", color: "#1db954" }}
        >
          Sign In
        </h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="userName"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Username
            </label>
            <input
              name="userName"
              id="userName"
              placeholder="Enter your username"
              type="text"
              className="form-control"
              required
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setUserName(e.target.value);
              }}
            />
          </div>

          <div className="mb-3">
            <label
              htmlFor="Email"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Email
            </label>
            <input
              name="Email"
              id="Email"
              placeholder="Enter your email"
              type="email"
              className="form-control"
              required
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setEmail(e.target.value);
              }}
            />
          </div>

          <div className="mb-3 position-relative">
            <label
              htmlFor="password"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Password
            </label>
            <input
              name="password"
              id="password"
              placeholder="Enter your password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              required
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="btn position-absolute"
              style={{
                top: "70%",
                right: "12px",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                fontSize: "1rem",
                color: "#1db954",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {errorMessage && (
            <p style={{ color: "#e74c3c" }} className="text-center">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className="btn w-100"
            style={{
              backgroundColor: "#1db954",
              color: "white",
              fontWeight: "bold",
              borderRadius: "8px",
              padding: "10px",
              border: "none",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>

        <div className="mt-3 text-center">
          <small style={{ color: "#b3b3b3" }}>
            Don't have an account?{" "}
            <a
              href="/signup"
              style={{ color: "#1db954", textDecoration: "none" }}
            >
              Sign up
            </a>
          </small>
        </div>
      </div>
    </div>
  );
};

export default SignInPage;
