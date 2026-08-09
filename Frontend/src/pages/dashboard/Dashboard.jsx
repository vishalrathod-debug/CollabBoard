import { useEffect, useState } from "react";
import BoardList from "./BoardList";
import CreateBoardModal from "../../components/modals/CreateBoardModal";
import { deleteBoard, getBoards, toggleStarBoard, updateBoard } from "../../services/boardService";
import logo from "../../assets/collablogo-removebg-preview.png";
import { useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Users,
  History,
  Settings,
  LogOut,
  ChevronRight,
  Zap,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [activeItem, setActiveItem] = useState("Dashboard");

  const menuItems = [
    { name: "Dashboard", icon: LayoutGrid },
    { name: "Team Members", icon: Users },
    { name: "Live Sessions", icon: Zap },
    { name: "Board History", icon: History },
    { name: "Settings", icon: Settings },
  ];

    useEffect(() => {
      const fetchBoards = async () => {
      try {
        const res = await getBoards();
        setBoards(res.boards || res);
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

    // 🔥 instant UI update
    setBoards((prev) => prev.filter((b) => b._id !== id));
  } catch (err) {
    console.error(err);
  }
};

const handleRename = async (id, title) => {
  try {
    await updateBoard(id, { title });

    setBoards((prev) =>
      prev.map((b) =>
        b._id === id ? { ...b, title } : b
      )
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
        b._id === id
          ? { ...b, isStarred: !b.isStarred }
          : b
      )
    );
  } catch (err) {
    console.error(err);
  }
};
  const handleBoardCreated = (newBoard) => {
    setBoards((prev) => [newBoard, ...prev]);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="flex h-screen">
      {/* 🔹 Sidebar */}
      <div className="w-64 bg-white border-r flex flex-col justify-between p-4">
        {/* Top */}
        <div>
          <div className="flex items-center gap-2 mb-6">
            <img src={logo} className="w-8 h-8" />
            <h2 className="font-bold text-lg">CollabBoard</h2>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg mb-6"
          >
            + New Board
          </button>

          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeItem === item.name;

              return (
                <button
                  key={item.name}
                  onClick={() => setActiveItem(item.name)}
                  className={`flex w-full items-center gap-3 px-4 py-2 rounded-lg
                    ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                  {isActive && <ChevronRight className="ml-auto w-4 h-4" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom */}
        <div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* 🔹 Main */}
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between mb-6">
          <h1 className="text-xl font-bold">My Boards</h1>
        </div>

        <BoardList
  boards={boards}
  loading={loading}
  onCreateClick={() => setShowModal(true)}
  onDelete={handleDelete}
  onRename={handleRename}
  onStar={handleStar}
/>

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
