import { MousePointer2 } from "lucide-react";

export default function CursorLayer({ cursors, users }) {
  return Object.entries(cursors).map(([socketId, cursor]) => {
    const user = users.find((item) => item.socketId === socketId);
    return (
      <g
        key={socketId}
        transform={`translate(${cursor.x * 1600} ${cursor.y * 1000})`}
        className="pointer-events-none"
      >
        <MousePointer2
          x="0"
          y="0"
          width="22"
          height="22"
          fill="#4f46e5"
          stroke="white"
          strokeWidth="2"
        />
        <text
          x="18"
          y="28"
          className="fill-indigo-700 text-[14px] font-semibold"
        >
          {user?.name || "Collaborator"}
        </text>
      </g>
    );
  });
}
