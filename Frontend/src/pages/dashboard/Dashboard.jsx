import { useContext, useEffect, useState } from "react";
import BoardList from "./BoardList";
import CreateBoardModal from "../../components/modals/CreateBoardModal";
import Settings from "../settings/Settings";
import { deleteBoard, getBoards, toggleStarBoard, updateBoard } from "../../services/boardService";
import logo from "../../assets/collablogo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import {
  LayoutGrid,
  Users,
  History,
  Settings as SettingsIcon,
  LogOut,
  ChevronRight,
  Zap,
  DoorOpen,
} from "lucide-react";
import TeamMembers from "../team/TeamMembers";
import BoardActivity from "../../components/board/BoardActivity";
import LiveSessions from "../sessions/LiveSessions";

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(""); // 👈 Added state for active board
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Team Members", icon: Users },
    { name: "Live Sessions", icon: Zap },
    { name: "Board History", icon: History },
    { name: "Settings", icon: SettingsIcon },
  ];

  useEffect(() => {
    const fetchBoards = async () => {
      try {
        const res = await getBoards();
        const boardList = res.boards || res || [];
        setBoards(boardList);
        
        // Auto-select the first board if available
        if (boardList.length > 0) {
          setSelectedBoardId(boardList[0]._id);
        }
      } catch (err) {
        console.error("Fetch boards failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBoards();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBoard(id);
      setBoards((prev) => prev.filter((b) => b._id !== id));
      if (selectedBoardId === id) {
        setSelectedBoardId(boards.find((b) => b._id !== id)?._id || "");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRename = async (id, title) => {
    try {
      await updateBoard(id, { title });
      setBoards((prev) =>
        prev.map((b) => (b._id === id ? { ...b, title } : b))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleStar = async (id) => {
    try {
      await toggleStarBoard(id);
      setBoards((prev) =>
        prev.map((b) =>
          b._id === id ? { ...b, isStarred: !b.isStarred } : b
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [newBoard, ...prev]);
    if (!selectedBoardId) setSelectedBoardId(newBoard._id);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // 🔹 Board Selection Selector Header (for sub-views like Team Members & History)
  const renderBoardSelector = () => (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 bg-white p-4 rounded-xl border border-slate-200/80 shadow-2xs">
      <div>
        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
          Active Board Context
        </label>
        <select
          value={selectedBoardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
          className="bg-slate-50 border border-slate-200 text-slate-800 text-sm font-medium rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 outline-none"
        >
          {boards.length === 0 ? (
            <option value="">No boards available</option>
          ) : (
            boards.map((b) => (
              <option key={b._id} value={b._id}>
                {b.title}
              </option>
            ))
          )}
        </select>
      </div>
    </div>
  );

  // 🔹 Dynamic Main Content Renderer
  const renderMainContent = () => {
    switch (activeItem) {
      case "Settings":
        return <Settings />;

      case "Team Members":
        if (!selectedBoardId) {
          return (
            <div className="p-8 text-center bg-white rounded-xl border text-slate-400">
              Please create or select a board to view team members.
            </div>
          );
        }
        return (
          <>
            {renderBoardSelector()}
            <TeamMembers boardId={selectedBoardId} />
          </>
        );

      case "Live Sessions":
  return <LiveSessions />;

      case "Board History":
        if (!selectedBoardId) {
          return (
            <div className="p-8 text-center bg-white rounded-xl border text-slate-400">
              Please create or select a board to view activity history.
            </div>
          );
        }
        return (
          <>
            {renderBoardSelector()}
            <BoardActivity boardId={selectedBoardId} />
          </>
        );

      case "Dashboard":
      default:
        return (
          <>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">My Boards</h1>
              <button
                onClick={() => navigate("/join")}
                className="flex items-center gap-2 rounded-lg border border-indigo-200 bg-white px-3 py-2 text-sm font-medium text-indigo-700 hover:bg-indigo-50 transition"
              >
                <DoorOpen className="w-4 h-4" /> Join board
              </button>
            </div>

            <BoardList
              boards={boards}
              loading={loading}
              onCreateClick={() => setShowModal(true)}
              onDelete={handleDelete}
              onRename={handleRename}
              onStar={handleStar}
              onSelect={(id) => setSelectedBoardId(id)}
            />
          </>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      {/* 🔹 Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4">
        {/* Top */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} alt="Logo" className="w-8 h-8" />
            <h2 className="font-bold text-lg text-slate-900">CollabBoard</h2>
          </div>

          <button
            onClick={() => {
              setActiveItem("Dashboard");
              setShowModal(true);
            }}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-lg mb-6 font-medium transition shadow-2xs"
          >
            + New Board
          </button>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-700 font-semibold"
                      : "text-slate-600 hover:bg-slate-100 font-medium"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className="ml-auto w-4 h-4 text-indigo-500" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Main View */}
      <div className="flex-1 p-6 overflow-y-auto">
        {renderMainContent()}

        {showModal && (
          <CreateBoardModal
            onClose={() => setShowModal(false)}
            onCreated={handleBoardCreated}
          />
        )}
      </div>
    </div>
  );
}