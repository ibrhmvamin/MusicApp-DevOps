import { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUpPage = () => {
  // State variables
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState<boolean>(false);
  const [userName, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");

  const navigate = useNavigate();

  // Toggle password visibility
  const togglePasswordVisibility = () => setShowPassword(!showPassword);
  const toggleConfirmPasswordVisibility = () =>
    setShowConfirmPassword(!showConfirmPassword);

  // Validation function
  const signUpValidateFunction = async (): Promise<boolean> => {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return false;
    }

    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!(await signUpValidateFunction())) return;

    try {
      const dto = {
        userName,
        email,
        password,
      };

      await axios.post(`http://localhost:5001/auth/signup`, dto, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      navigate("/SignIn");
    } catch (error) {
      console.error("Error during sign up", error);
      setErrorMessage("Failed to sign up. Please try again.");
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
          width: "400px",
          borderRadius: "12px",
          background: "#181818",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
          color: "white",
        }}
      >
        <h3
          className="text-center mb-4"
          style={{ fontWeight: "bold", color: "#1db954" }}
        >
          Sign Up
        </h3>
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <div className="mb-3">
            <label
              htmlFor="userName"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Username
            </label>
            <input
              id="userName"
              placeholder="Enter Username"
              type="text"
              className="form-control"
              required
              value={userName}
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setUserName(e.target.value)
              }
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="email"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Email
            </label>
            <input
              id="email"
              placeholder="Enter Email"
              type="email"
              className="form-control"
              required
              value={email}
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
            />
          </div>

          {/* Password */}
          <div className="mb-3 position-relative">
            <label
              htmlFor="password"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Password
            </label>
            <input
              id="password"
              placeholder="Enter Password"
              type={showPassword ? "text" : "password"}
              className="form-control"
              required
              value={password}
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setPassword(e.target.value)
              }
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="btn position-absolute top-50 end-0 translate-middle-y"
              style={{
                border: "none",
                background: "transparent",
                fontSize: "16px",
                color: "#1db954",
                cursor: "pointer",
              }}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Confirm Password */}
          <div className="mb-3 position-relative">
            <label
              htmlFor="confirmPassword"
              className="form-label"
              style={{ color: "#b3b3b3" }}
            >
              Confirm Password
            </label>
            <input
              id="confirmPassword"
              placeholder="Confirm Password"
              type={showConfirmPassword ? "text" : "password"}
              className="form-control"
              required
              value={confirmPassword}
              style={{
                borderRadius: "8px",
                border: "none",
                padding: "10px",
                backgroundColor: "#282828",
                color: "white",
              }}
              onChange={(e: ChangeEvent<HTMLInputElement>) =>
                setConfirmPassword(e.target.value)
              }
            />
            <button
              type="button"
              onClick={toggleConfirmPasswordVisibility}
              className="btn position-absolute top-50 end-0 translate-middle-y"
              style={{
                border: "none",
                background: "transparent",
                fontSize: "16px",
                color: "#1db954",
                cursor: "pointer",
              }}
            >
              {showConfirmPassword ? "Hide" : "Show"}
            </button>
          </div>

          {/* Error Message */}
          {errorMessage && <p className="text-danger">{errorMessage}</p>}

          {/* Submit Button */}
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
            Sign Up
          </button>

          {/* Redirect to Sign In */}
          <div className="mt-3 text-center">
            <small style={{ color: "#b3b3b3" }}>
              Already have an account?{" "}
              <a
                href="/SignIn"
                style={{ color: "#1db954", textDecoration: "none" }}
              >
                Sign In
              </a>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
