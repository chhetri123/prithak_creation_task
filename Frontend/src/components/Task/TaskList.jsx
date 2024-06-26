import React, { useEffect, useState } from "react";
import { FaCheckCircle, FaEdit, FaTrashAlt, FaUndoAlt } from "react-icons/fa";
import TaskFormModal from "./TaskFormModel";
import { useDispatch, useSelector } from "react-redux";
import { editTask, deleteTask, defaultState } from "../../store/taskSlice";
import { showNotification } from "../../store/notificationSlice";
import {
  getStatusIcon,
  getPriorityClass,
  dateToMonth_Day,
} from "../../utils/helper";

const TaskList = ({ task, onTaskClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const { status } = useSelector((state) => state.task);
  const dispatch = useDispatch();

  const handleEdit = async (updatedTask) => {
    setIsLoading(true);
    dispatch(editTask(updatedTask));
  };

  const handleDeleteTask = () => {
    dispatch(deleteTask(task._id));
  };
  useEffect(() => {
    if (status === "succeeded") {
      setIsLoading(false);
      setIsModalOpen(false);
      dispatch(defaultState());
      dispatch(
        showNotification({
          type: "success",
          message: "Action done !!",
        })
      );
    }
    if (status === "failed") {
      setIsLoading(false);
      dispatch(
        showNotification({
          type: "error",
          message: "An error occured while updating the task",
        })
      );
    }
  }, [status]);

  return (
    <div
      className="relative border rounded-lg p-4 mb-4 shadow-md bg-white transition-transform duration-500 transform hover:scale-105 w-full sm:w-72 md:w-80 lg:w-96 xl:w-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="flex justify-between items-center mb-2 focus:cursor-grab"
        onClick={() => onTaskClick(task)}
      >
        <div className="w-2/3">
          <h2 className="text-base font-semibold truncate hover:underline focus:cursor-pointer">
            {task.title}
            {user.role === "admin" && (
              <span className="text-gray-500 text-xs">
                &nbsp; (By <i>@{task.owner.name.split(" ")[0]}</i>)
              </span>
            )}
          </h2>
        </div>
        <div className="flex items-center space-x-5 w-1/3 justify-end">
          {getStatusIcon(task.status)}
          <span
            className={`px-4 py-1 rounded-lg ${getPriorityClass(
              task.priority
            )}`}
          >
            {task.priority}
          </span>
        </div>
      </div>
      <div className="flex flex-row justify-between items-center">
        <p className="text-gray-500 text-xs">
          Start: {dateToMonth_Day(task.createdAt)}
        </p>
        <p className="text-gray-500 text-sm">
          Due: {dateToMonth_Day(task.dueDate).split(",")[0]}
        </p>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        {task.tags.length < 1 ? (
          <div className="px-2 py-3"></div>
        ) : (
          task.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-semibold bg-gray-200 rounded-full px-2 py-1 max-w-[80px] truncate"
            >
              {`#${tag}`}
            </span>
          ))
        )}
      </div>
      {isHovered && (
        <div className="absolute bottom-4 right-8 sm:right-2 md:right-5 flex space-x-4 transition-opacity duration-1000">
          {task.status === "completed" ? (
            <FaUndoAlt
              className="text-yellow-500 cursor-pointer hover:text-yellow-700"
              title="Mark as Incomplete"
              onClick={() => handleEdit({ ...task, status: "open" })}
            />
          ) : (
            <FaCheckCircle
              className="text-green-500 cursor-pointer hover:text-green-700"
              title="Mark as Complete"
              onClick={() => handleEdit({ ...task, status: "completed" })}
            />
          )}
          <FaEdit
            className="text-blue-500 cursor-pointer hover:text-blue-700"
            title="Edit Task"
            onClick={() => setIsModalOpen(true)}
          />
          <FaTrashAlt
            className="text-red-500 cursor-pointer hover:text-red-700"
            title="Delete Task"
            onClick={handleDeleteTask}
          />
        </div>
      )}
      {isModalOpen && (
        <TaskFormModal
          isOpen={isModalOpen}
          onRequestClose={() => setIsModalOpen(false)}
          onSubmit={handleEdit}
          message={{
            heading: "Edit Task",
            button: isLoading ? "Updating Task..." : "Update Task",
            data: {
              ...task,
              tags: task.tags.join(","),
            },
          }}
        />
      )}
    </div>
  );
};

export default TaskList;
