import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import AddTask from "../components/Task/AddTask";
import { isUserLoggedIn } from "../store/authSlice";
import TaskCard from "../components/Task/TaskCard";
import SearchBar from "../components/SearchBar";
import Notification from "../components/Notification/Notification";
import { hideNotification } from "../store/notificationSlice";

const Home = () => {
  const { user, isLoggedIn } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.notification);

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(isUserLoggedIn());
    }
  }, [dispatch, isLoggedIn, notification]);
  return (
    <div className="flex flex-col justify-center mt-3 items-center overflow-hidden">
      {notification && (
        <div className="fixed top-4 right-4 z-50">
          <Notification
            type={notification.type}
            message={notification.message}
            onClose={() => dispatch(hideNotification())}
            duration={3000}
          />
        </div>
      )}
      <div className="flex justify-between items-center w-[70%] mb-4">
        <h1 className="text-2xl font-bold text-gray-700">Task List</h1>
        {isLoggedIn && user && user.role === "user" ? <AddTask /> : <div></div>}
      </div>

      <hr className="h-[2px] mt-2 bg-slate-300 w-[70%] m-auto" />
      <div className="mt-4 w-[50%]">
        <SearchBar />
      </div>
      {isLoggedIn ? (
        <div className="w-full mt-6">
          <TaskCard />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full w-full mt-5 gap-0 ">
          <Link
            to="/login"
            className="px-6 py-3 text-sm font-semibold leading-6 text-center"
          >
            You need to <span className="underline text-blue-500">log in </span>{" "}
            to access this page !!!
          </Link>
          or
          <div>
            <Link
              to="/register"
              className="px-6 py-3 text-sm font-semibold leading-6 text-center"
            >
              <span className="underline text-blue-500">Register </span> to
              access this page !!!
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
