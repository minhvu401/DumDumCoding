"use client";

import { useState, useEffect } from "react";

interface Todo {
  toDoId: number;
  userId: number;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  date: string;
  isCompleted: boolean;
  createdAt: string;
}

interface User {
  userId: number;
  userName: string;
  fullName: string;
  role: string;
}

export default function SchedulePage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [error, setError] = useState("");

  // Postpone modal states
  const [showPostponeModal, setShowPostponeModal] = useState(false);
  const [postponeTodo, setPostponeTodo] = useState<Todo | null>(null);
  const [newDate, setNewDate] = useState("");
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  // Tạo mảng thời gian từ 00:00 đến 23:30 (mỗi 30 phút)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, "0")}:${minute
          .toString()
          .padStart(2, "0")}`;
        slots.push(timeString);
      }
    }
    return slots;
  };

  // Lấy chỉ những time slots có tasks
  const getUsedTimeSlots = () => {
    const allSlots = generateTimeSlots();
    const usedSlots = [];

    for (const slot of allSlots) {
      const tasksInSlot = todos.filter((todo) => {
        const todoStart = todo.startTime.substring(0, 5);
        const todoEnd = todo.endTime.substring(0, 5);
        return todoStart <= slot && todoEnd > slot;
      });

      if (tasksInSlot.length > 0) {
        usedSlots.push(slot);
      }
    }

    return usedSlots;
  };

  // Tìm task trong khoảng thời gian
  const getTasksForTimeSlot = (slotTime: string) => {
    return todos.filter((todo) => {
      const todoStart = todo.startTime.substring(0, 5);
      const todoEnd = todo.endTime.substring(0, 5);
      return todoStart <= slotTime && todoEnd > slotTime;
    });
  };

  const fetchTodos = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      const res = await fetch(`/api/schedule?date=${date}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const response = await res.json();
        setTodos(response.todos || []);
        setCurrentUser(response.currentUser);
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to fetch todos");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
  };

  const createTodo = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      const res = await fetch("/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, description, startTime, endTime, date }),
      });

      if (res.ok) {
        setShowForm(false);
        setTitle("");
        setDescription("");
        setStartTime("");
        setEndTime("");
        setError("");
        fetchTodos();
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to create todo");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
  };

  const toggleComplete = async (todoId: number, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      const res = await fetch("/api/schedule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          todoId,
          isCompleted: !currentStatus,
        }),
      });

      if (res.ok) {
        setTodos((prevTodos) =>
          prevTodos.map((todo) =>
            todo.toDoId === todoId
              ? { ...todo, isCompleted: !currentStatus }
              : todo
          )
        );
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to update todo");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
  };

  const openPostponeModal = (todo: Todo) => {
    setPostponeTodo(todo);
    setNewDate(todo.date);
    setNewStartTime(todo.startTime.substring(0, 5));
    setNewEndTime(todo.endTime.substring(0, 5));
    setShowPostponeModal(true);
  };

  const closePostponeModal = () => {
    setShowPostponeModal(false);
    setPostponeTodo(null);
    setNewDate("");
    setNewStartTime("");
    setNewEndTime("");
  };

  const postponeTask = async () => {
    if (!postponeTodo) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No token found. Please login first.");
        return;
      }

      const res = await fetch("/api/schedule", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          todoId: postponeTodo.toDoId,
          postponeData: {
            newDate,
            newStartTime,
            newEndTime,
          },
        }),
      });

      if (res.ok) {
        closePostponeModal();
        fetchTodos(); // Refresh để cập nhật lại danh sách
        setError("");
      } else {
        const errorData = await res.json();
        setError(errorData.error || "Failed to postpone todo");
      }
    } catch (error) {
      console.error(error);
      setError("Network error");
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [date]);

  const completedTodos = todos.filter((todo) => todo.isCompleted);
  const incompleteTodos = todos.filter((todo) => !todo.isCompleted);
  const usedTimeSlots = getUsedTimeSlots();

  // Get minimum date (today)
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const currentTime = `${now.getHours().toString().padStart(2, "0")}:${now
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-pink-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 via-cyan-500 to-cyan-300 text-transparent bg-clip-text">
            Lịch làm việc của bé iu
          </h1>
          {currentUser && (
            <div className="bg-white rounded-lg p-3 shadow text-sm">
              <div className="font-semibold text-gray-800">
                {currentUser.fullName}
              </div>
              <div className="text-gray-600">
                Tài khoản: {currentUser.userName}
              </div>
            </div>
          )}
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {/* Controls */}
        <div className="bg-white rounded-lg p-4 mb-4 shadow">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="border-2 border-pink-200 rounded px-3 py-2"
              />
              <button
                onClick={() => setShowForm(true)}
                className=" bg-gradient-to-r from-pink-300 to-cyan-400 text-white px-4 py-2 rounded hover:from-pink-400 hover:to-cyan-500"
              >
                Thêm nhiệm vụ cho bé
              </button>
            </div>
            <div className="text-sm flex items-center gap-4">
              <span className="text-gray-600">
                Tổng nhiệm vụ: {todos.length}
              </span>
              <span className="text-cyan-400 font-medium">
                Đang làm: {incompleteTodos.length}
              </span>
              <span className="text-green-600 font-medium">
                Đã hoàn thành: {completedTodos.length}
              </span>
            </div>
          </div>
        </div>

        {/* Schedule Table - Chỉ hiển thị time slots có tasks */}
        {usedTimeSlots.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-cyan-100 to-pink-100">
                    <th className="px-3 py-3 text-left text-sm font-semibold text-gray-800 w-30">
                      Thời gian
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-800">
                      Nhiệm vụ
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usedTimeSlots.map((slot, index) => {
                    const tasksInSlot = getTasksForTimeSlot(slot);
                    const isEvenRow = index % 2 === 0;

                    return (
                      <tr
                        key={slot}
                        className={`border-b border-gray-100 ${
                          isEvenRow ? "bg-gray-50" : "bg-white"
                        }`}
                      >
                        <td className="px-4 py-2 text-sm font-medium text-gray-600 border-r border-gray-200 align-top">
                          {slot}
                        </td>
                        <td className="px-4 py-2">
                          <div className="space-y-2">
                            {tasksInSlot.map((todo) => {
                              const isFirstSlot =
                                todo.startTime.substring(0, 5) === slot;

                              // Chỉ hiển thị task ở time slot đầu tiên
                              if (!isFirstSlot) return null;

                              return (
                                <div
                                  key={todo.toDoId}
                                  className={`p-2 rounded border-l-4 ${
                                    todo.isCompleted
                                      ? "bg-green-50 border-l-green-400"
                                      : "bg-cyan-50 border-l-cyan-400"
                                  }`}
                                >
                                  <div className="flex items-start gap-2">
                                    <button
                                      onClick={() =>
                                        toggleComplete(
                                          todo.toDoId,
                                          todo.isCompleted
                                        )
                                      }
                                      className={`mt-0.5 w-4 h-4 border-2 rounded flex items-center justify-center flex-shrink-0 ${
                                        todo.isCompleted
                                          ? "border-green-400 bg-green-400 hover:bg-green-500"
                                          : "border-gray-300 hover:border-cyan-400"
                                      }`}
                                    >
                                      {todo.isCompleted && (
                                        <span className="text-white text-xs">
                                          ✓
                                        </span>
                                      )}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <h4
                                        className={`font-medium text-sm leading-tight ${
                                          todo.isCompleted
                                            ? "text-gray-600 line-through"
                                            : "text-gray-800"
                                        }`}
                                      >
                                        {todo.title}
                                      </h4>
                                      {todo.description && (
                                        <p
                                          className={`text-xs mt-1 leading-tight ${
                                            todo.isCompleted
                                              ? "text-gray-500 line-through"
                                              : "text-gray-600"
                                          }`}
                                        >
                                          {todo.description}
                                        </p>
                                      )}
                                      <div className="flex items-center gap-2 mt-1">
                                        <span
                                          className={`text-xs px-1.5 py-0.5 rounded ${
                                            todo.isCompleted
                                              ? "bg-green-100 text-green-700"
                                              : "bg-cyan-100 text-cyan-700"
                                          }`}
                                        >
                                          {todo.startTime.substring(0, 5)} -{" "}
                                          {todo.endTime.substring(0, 5)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                          Em{" "}
                                          {todo.isCompleted
                                            ? "xong rồi nhe hihi"
                                            : "chưa xong huhu"}
                                        </span>
                                      </div>
                                    </div>
                                    {!todo.isCompleted && (
                                      <button
                                        onClick={() => openPostponeModal(todo)}
                                        className="ml-2 px-2 py-1 text-xs bg-orange-100 text-orange-700 rounded hover:bg-orange-200 flex-shrink-0"
                                      >
                                        Cho bé dời nhe
                                      </button>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg p-8 text-center text-gray-500 shadow">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">Chưa có nhiệm vụ</h3>
            <p className="text-sm">Bé hãy tạo nhiệm vụ rồi xem nhé!</p>
          </div>
        )}

        {/* Add Task Modal */}
        {showForm && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="p-[2.5px] bg-gradient-to-r from-pink-300 to-cyan-400 rounded-lg shadow-lg">
              <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-lg text-cyan-300 font-bold mb-4">
                  Nhiệm vụ mới của Dúm
                </h3>

                <input
                  type="text"
                  placeholder="Tên nhiệm vụ"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3"
                />

                <textarea
                  placeholder="Mô tả nhiệm vụ"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-2 mb-3 h-20"
                />

                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ bắt đầu
                    </label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ hoàn thành
                    </label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => setShowForm(false)}
                    className="flex-1 border border-gray-300 rounded px-4 py-2 hover:bg-gray-200"
                  >
                    Em lười hihi
                  </button>
                  <button
                    onClick={createTodo}
                    disabled={!title || !startTime || !endTime}
                    className="bg-gradient-to-r from-pink-300 to-cyan-400 text-white px-2 py-2 rounded hover:from-pink-400 hover:to-cyan-500"
                  >
                    Em làm nhe bé iu 😘
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {showPostponeModal && postponeTodo && (
          <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="p-[2.5px] bg-gradient-to-r from-pink-300 to-cyan-400 rounded-lg shadow-lg">
              <div className="bg-white rounded-lg p-6 w-96">
                <h3 className="text-lg text-cyan-300 font-bold mb-4">
                  Dời nhiệm vụ: {postponeTodo.title}
                </h3>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ngày làm
                  </label>
                  <input
                    type="date"
                    value={newDate}
                    min={today}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ bắt đầu
                    </label>
                    <input
                      type="time"
                      value={newStartTime}
                      min={newDate === today ? currentTime : undefined}
                      onChange={(e) => setNewStartTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Giờ hoàn thành
                    </label>
                    <input
                      type="time"
                      value={newEndTime}
                      min={newStartTime}
                      onChange={(e) => setNewEndTime(e.target.value)}
                      className="w-full border border-gray-300 rounded px-3 py-2 cursor-pointer"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={closePostponeModal}
                    className="flex-1 border border-gray-300 rounded px-4 py-2 hover:bg-gray-200"
                  >
                    Hoi em làm được
                  </button>
                  <button
                    onClick={postponeTask}
                    disabled={!newDate || !newStartTime || !newEndTime}
                    className=" bg-orange-400 text-white rounded px-4 py-3 hover:bg-orange-600 disabled:opacity-50"
                  >
                    Bé dời nhe hihi 😘
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
