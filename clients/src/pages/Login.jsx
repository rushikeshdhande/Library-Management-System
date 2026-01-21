import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { login, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
  };

  useEffect(() => {
    // if (message) {
    //   toast.success(message);
    //   dispatch(resetAuthSlice());
    // }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

 return (
  <>
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        
        {/* LOGO */}
        <div className="flex justify-center mb-8">
          <img src={logo} alt="logo" className="h-20 w-auto" />
        </div>

        {/* TITLE */}
        <h1 className="text-3xl font-medium text-center mb-4">
          Welcome Back !!
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Please enter your credentials to log in
        </p>

        {/* FORM */}
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
            />
          </div>

          <div className="flex justify-end mb-6">
            <Link
              to={"/password/forgot"}
              className="text-sm font-semibold text-black hover:underline"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border-2 border-black transition"
          >
            SIGN IN
          </button>
        </form>

        {/* SIGN UP */}
        <p className="text-center mt-6 text-sm">
          New to our platform?{" "}
          <Link to={"/register"} className="font-semibold hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  </>
);

};

export default Login;
