"use client";
import MyGoals from "./MyGoals";
import MyTasks from "./TasksNew/MyTask";
import Preferences from "./Preferences/page";
import { ToastContainer } from "react-toastify";

const HomeDashboard = () => {
  return (
    <>
    <ToastContainer style={{ fontSize: "12px", zIndex: 1000 }} />
      <div className="flex space-x-3 pe-4 ">
        <div className="w-1/2 space-y-4 mb-8">
          <div>
            <MyTasks />
          </div>
          <div className="col-start-1 row-start-2 rounded-lg">
            <MyGoals />
          </div>
        </div>
        <div className="row-span-2 col-start-2 row-start-1 rounded-lg shadow border border-gray-200 p-4 h-[660px] w-3/5 overflow-auto table-scrollbar">
          <Preferences />
        </div>
      </div>
    </>
  );
};

export default HomeDashboard;
