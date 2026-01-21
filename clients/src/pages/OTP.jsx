import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Link, Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification(email, otp));
  };

  useEffect(() => {
    // if (message) {
    //   toast.success(message);
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
    <div className="flex items-center justify-center min-h-screen bg-gray-100 relative">
      
      {/* BACK BUTTON */}
      <Link
        to={"/register"}
        className="absolute top-6 left-6 border-2 border-black rounded-3xl font-bold w-40 py-2 px-4 hover:bg-black hover:text-white transition text-center"
      >
        Back
      </Link>

      {/* OTP CARD */}
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
        <h1 className="text-3xl font-medium text-center mb-4">
          Check your Mailbox
        </h1>

        <p className="text-gray-600 text-center mb-8">
          Please enter the OTP to proceed
        </p>

        <form onSubmit={handleOtpVerification}>
          <div className="mb-6">
            <input
              type="number"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="OTP"
              className="w-full px-4 py-3 border border-black rounded-md focus:outline-none text-center tracking-widest"
            />
          </div>

          <button
            type="submit"
            className="w-full font-semibold bg-black text-white py-3 rounded-lg hover:bg-white hover:text-black border-2 border-black transition"
          >
            VERIFY
          </button>
        </form>
      </div>
    </div>
  </>
);


};

export default OTP;
