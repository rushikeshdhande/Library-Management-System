import React, { useEffect, useState } from "react";
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import Header from "../layout/Header";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
import logo from "../assets/black-logo.png";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const { settingPopup } = useSelector((state) => state.popup);
  const { userBorrowedBooks } = useSelector((state) => state.borrow);

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    let numberOfTotalBorrowedBooks = userBorrowedBooks.filter(
      (book) => book.returned === false
    );
    let numberOfTotalReturnedBooks = userBorrowedBooks.filter(
      (book) => book.returned === true
    );
    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#3D3E3E", "#151619"],
        hoverOffset: 4,
      },
    ],
  };
return (
  <>
    <main className="relative flex-1 px-4 sm:px-6 pt-24 pb-6 bg-gray-100">
      <Header />

      <div className="flex flex-col xl:flex-row gap-6">
        {/* LEFT SECTION */}
        <section className="flex flex-col gap-6 xl:flex-[3]">
          
          {/* TOP CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="w-[3px] bg-black h-full rounded"></span>
              <div className="bg-gray-200 w-16 h-16 flex items-center justify-center rounded-lg">
                <img src={bookIcon} alt="icon" className="w-7 h-7" />
              </div>
              <p className="text-lg font-semibold">
                Your Borrowed Books
              </p>
            </div>

            <div className="flex items-center gap-4 bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition">
              <span className="w-[3px] bg-black h-full rounded"></span>
              <div className="bg-gray-200 w-16 h-16 flex items-center justify-center rounded-lg">
                <img src={returnIcon} alt="icon" className="w-7 h-7" />
              </div>
              <p className="text-lg font-semibold">
                Your Returned Books
              </p>
            </div>
          </div>

          {/* BROWSE + LOGO */}
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            <div className="flex items-center gap-4 bg-white p-5 w-full rounded-xl shadow-sm hover:shadow-md transition">
              <span className="w-[3px] bg-black h-full rounded"></span>
              <div className="bg-gray-200 w-16 h-16 flex items-center justify-center rounded-lg">
                <img src={browseIcon} alt="icon" className="w-7 h-7" />
              </div>
              <p className="text-lg font-semibold">
                Browse Books Inventory
              </p>
            </div>

            <img
              src={logo_with_title}
              alt="logo"
              className="hidden lg:block h-20 object-contain"
            />
          </div>

          {/* QUOTE CARD */}
          <div className="relative bg-white p-6 sm:p-8 rounded-2xl shadow-md text-center">
            <h4 className="text-lg sm:text-xl xl:text-2xl font-semibold leading-relaxed">
              “Embarking on the journey of reading fosters personal growth,
              nurturing a path towards excellence and refined character.”
            </h4>
            <p className="mt-4 text-sm text-gray-500">
              ~ Rushikesh Developer
            </p>
          </div>
        </section>

        {/* RIGHT SECTION */}
        <section className="flex flex-col gap-6 xl:flex-[2]">
          
          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-xl shadow-md flex justify-center">
            <div className="w-full max-w-xs">
              <Pie data={data} options={{ cutout: "55%" }} />
            </div>
          </div>

          {/* LEGEND CARD */}
          <div className="bg-white p-6 rounded-xl shadow-md flex items-center gap-4">
            <img src={logo} alt="logo" className="h-12" />
            <span className="w-[2px] bg-black h-16"></span>
            <div className="flex flex-col gap-3 text-sm sm:text-base">
              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#3D3E3E]"></span>
                Total Borrowed Books
              </p>
              <p className="flex items-center gap-3">
                <span className="w-3 h-3 rounded-full bg-[#151619]"></span>
                Total Returned Books
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  </>
);

};

export default UserDashboard;
