import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { resetAuthSlice, resetPassword } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);
    dispatch(resetPassword(formData, token));
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
        to={"/password/forgot"}
        className="absolute top-6 left-6 border-2 border-black rounded-3xl font-bold w-40 py-2 px-4 hover:bg-black hover:text-white transition text-center"
      >
        Back
      </Link>

      {/* RESET PASSWORD CARD */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        
        <h1 className="text-3xl font-medium text-center mb-4">
          Reset Password
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Please enter your new password
        </p>

        <form onSubmit={handleResetPassword}>
          <div className="mb-4">
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="New Password"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none"
            />
          </div>

          <div className="mb-6">
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
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

export default ResetPassword;
