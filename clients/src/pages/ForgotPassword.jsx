import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      
      {/* BACK BUTTON */}
      <Link
        to={"/login"}
        className="absolute top-6 left-6 border-2 border-black rounded-3xl font-bold w-40 py-2 px-4 hover:bg-black hover:text-white transition text-center"
      >
        Back
      </Link>

      {/* FORGOT PASSWORD CARD */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        
        <h1 className="text-3xl font-medium text-center mb-4">
          Forgot Password
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Please enter your email
        </p>

        <form onSubmit={handleForgotPassword}>
          <div className="mb-6">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border-2 border-black transition disabled:opacity-60 disabled:cursor-not-allowed"
          >
            RESET PASSWORD
          </button>
        </form>
      </div>
    </div>
  </>
);

};

export default ForgotPassword;
