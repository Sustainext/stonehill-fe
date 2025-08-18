import React, { useState, useEffect } from "react";
import { FiPlus, FiCheckCircle } from "react-icons/fi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Moment from "react-moment";
import { useAuth } from "../../../Context/auth";
import axiosInstance, { del, patch, post } from "../../utils/axiosMiddleware";
import GoalsModal from "./GoalsModal";

const MyGoals = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentGoal, setCurrentGoal] = useState(null);
  const [goals, setGoals] = useState({});
  const [loopen, setLoOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  const { userDetails, token } = useAuth();
  const [userId, setUserId] = useState(null);

  const [activeTab, setActiveTab] = useState("upcoming");
  const [formData, setFormData] = useState({
    status: "not_started",
    title: "",
    organization: "",
    description: "",
    deadline: "",
  });

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const response = await axiosInstance.get("/api/auth/get_user_roles/");

        if (response.status === 200) {
          const data = await response.data;
          console.log("Fetched user role:", data);
          setIsAdmin(data.admin);
        } else {
          console.error("Failed to fetch user role");
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  useEffect(() => {
    if (userDetails) {
      setUserId(userDetails?.user_detail[0]?.id);
    }
  }, [userDetails]);

  const LoaderOpen = () => setLoOpen(true);
  const LoaderClose = () => setLoOpen(false);

  const fetchGoals = async () => {
    try {
      LoaderOpen();
      const response = await axiosInstance.get(
        `/sustainapp/my_goal/?assigned_to=${userId}`
      );
      setGoals(response.data);
    } catch (error) {
      toast.error("Error fetching goals");
    } finally {
      LoaderClose();
    }
  };

  useEffect(() => {
    if (userId) {
      fetchGoals();
    }
  }, [userId]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsEditing(false);
    setFormData({
      status: "not_started",
      title: "",
      organization: "",
      description: "",
      deadline: "",
    });
  };

  const handleEditModal = (goal) => {
    if (!goal) {
      toast.error("Invalid goal selected");
      return;
    }
    setIsModalOpen(true);
    setIsEditing(true);
    setCurrentGoal(goal);
    setFormData({
      status: goal.status || "not_started",
      title: goal.title || "",
      organization: goal.organization || "",
      description: goal.description || "",
      deadline: goal.deadline || "",
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setCurrentGoal(null);
    setFormData({
      status: "not_started",
      title: "",
      organization: "",
      description: "",
      deadline: "",
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (status) => {
    setFormData((prev) => ({ ...prev, status }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    LoaderOpen();

    try {
      let response;
      if (isEditing) {
        response = await patch(
          `/sustainapp/my_goal/${currentGoal.id}/`,
          formData
        );
        if (response.status === 200) {
          toast.success("Goal updated successfully", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      } else {
        response = await post(`/sustainapp/my_goal/`, {
          ...formData,
          assigned_to: userId,
          completed: false,
        });

        if (response.status === 201) {
          toast.success("Goal added successfully!", {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        }
      }

      setTimeout(() => {
        fetchGoals();
        handleCloseModal();
      }, 1000); // Delay to allow toast to show
    } catch (error) {
      toast.error("Error saving goal: " + error.message);
    } finally {
      LoaderClose();
    }
  };

  const handleDelete = async () => {
    if (!currentGoal) {
      toast.error("Invalid goal selected");
      return;
    }

    LoaderOpen();
    try {
      const response = await del(`/sustainapp/my_goal/${currentGoal.id}/`);
      if (response.status === 204) {
        toast.success("Goal deleted successfully!");
      }

      setTimeout(() => {
        fetchGoals();
        handleCloseModal();
      }, 1000); // Delay to show toast
    } catch (error) {
      toast.error("Error deleting goal");
    } finally {
      LoaderClose();
    }
  };

  const renderGoalsList = (goalsList) => {
    if (!goalsList || goalsList.length === 0) {
      return (
        <div className="flex flex-col justify-center items-center h-full">
          <div className="flex justify-center items-center pb-5">
            <FiCheckCircle style={{ color: "#ACACAC", fontSize: "36px" }} />
          </div>
          <p className="text-[14px] text-[#101828] font-bold text-center">
            Start by creating a goal
          </p>
          <button
            className="bg-[#007EEF] text-white w-[150px] px-2 py-1.5 rounded-md shadow-md mt-4 text-sm"
            onClick={handleOpenModal}
          >
            Add a goal
          </button>
        </div>
      );
    }

    return goalsList.map((goal) => {
      // Check if the goal object is valid
      if (!goal || typeof goal !== "object") {
        return (
          <div className="flex flex-col justify-center items-center h-full">
            <div className="flex justify-center items-center pb-5">
              <FiCheckCircle style={{ color: "#ACACAC", fontSize: "36px" }} />
            </div>
            <p className="text-[14px] text-[#101828] font-bold text-center">
              Start by creating a goal
            </p>
            {isAdmin && (
              <button
                className="bg-[#007EEF] text-white w-[150px] px-2 py-1 rounded-md shadow-md mt-4 text-sm"
                onClick={handleOpenModal}
              >
                Add a goal
              </button>
            )}
          </div>
        );
      }

      return (
        <>
          {/* <ToastContainer style={{ fontSize: "12px" }} /> */}
          <div
            key={goal.id}
            className="flex border-b border-[#ebeced] py-2"
          >
            {/* Task Name Column */}
            <div className="flex-[2] cursor-pointer">
              <div className="truncate text-[#007eef] text-[13px] font-normal leading-none ml-3">
                <p
                  className="py-1 cursor-pointer"
                  data-tooltip-id={`goal-tooltip-${goal.id}`}
                  data-tooltip-content={goal.title}
                  onClick={() => isAdmin && handleEditModal(goal)}
                  style={{ cursor: isAdmin ? "pointer" : "default" }}
                >
                  {goal.title || "Untitled Goal"}
                </p>
              </div>
            </div>

            {/* Status Column */}
            <div className="flex-[1] min-w-[80px] ml-2">
              <div className="text-left">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      goal.status === "completed"
                        ? "bg-green-500"
                        : goal.status === "in_progress"
                        ? "bg-yellow-400"
                        : "bg-gray-300"
                    }`}
                  ></div>
                  <div className="text-xs">
                    {goal.status_display || "Not Started"}
                  </div>
                </div>
              </div>
            </div>

            {/* Due Date Column */}
            <div className="flex-[1] mr-4 text-right">
              <div className="text-neutral-500 text-xs font-normal leading-[15px]">
                <Moment format="DD/MM/YYYY">{goal.deadline}</Moment>
              </div>
            </div>
          </div>
        </>
      );
    });
  };

  return (
    <>
      {/* <ToastContainer style={{ fontSize: "12px", zIndex: 1000 }} /> */}
      <div className="xl:p-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200 h-[450px] xl:h-[470px] lg:h-[470px] md:h-[470px] 4k:h-[470px] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-[#0f1728] text-lg font-medium font-['Manrope'] leading-7">
            Organization Goals
          </h1>
          {isAdmin && (
            <button
              onClick={handleOpenModal}
              className="text-sky-600 text-sm cursor-pointer font-normal leading-[13px] flex items-center me-2 space-x-2"
            >
              <FiPlus className="w-5 h-5" />
              Add Goal
            </button>
          )}
        </div>

        <div className="flex gap-8 border-b border-gray-200 mb-6">
          {["Upcoming", "Overdue", "Completed"].map((tab) => (
            <button
              key={tab}
              className={`pb-2 ${
                activeTab === tab.toLowerCase()
                  ? "text-blue-500 border-b-2 border-blue-500"
                  : "text-gray-500"
              }`}
              onClick={() => setActiveTab(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="flex px-4 py-2 text-sm font-medium text-gray-500 border-b">
          {/* Task Name Column */}
          <div className="flex-[2] -ml-2">
            Tasks
          </div>

          {/* Status Column */}
          <div className="flex-[1] ml-2 min-w-[80px]">Status</div>

          {/* Due Date Column */}
          <div className="flex-[1] mr-1 text-right">Due Date</div>
        </div>

        <div className="flex-1 overflow-auto table-scrollbar">
          {goals && goals[activeTab]
            ? renderGoalsList(goals[activeTab])
            : renderGoalsList([])}
        </div>

        {isModalOpen && (
          <GoalsModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            isEditing={isEditing}
            formData={formData}
            onSubmit={handleSubmit}
            onChange={handleInputChange}
            onDelete={handleDelete}
            handleStatusChange={handleStatusChange}
          />
        )}
      </div>
    </>
  );
};

export default MyGoals;
