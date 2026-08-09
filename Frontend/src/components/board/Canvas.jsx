import { useRef, useState } from "react";
import CursorLayer from "./CursorLayer";

const BOARD_WIDTH = 1600;
const BOARD_HEIGHT = 1000;
const pointList = (points) => points.map((point, index) => `${index ? "L" : "M"}${point.x} ${point.y}`).join(" ");

function Shape({ item }) {
  const common = { fill: "none", stroke: item.color, strokeWidth: item.strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" };
  if (item.type === "pen") return <path d={pointList(item.points)} {...common} />;
  if (item.type === "rectangle") return <rect x={Math.min(item.x, item.endX)} y={Math.min(item.y, item.endY)} width={Math.abs(item.endX - item.x)} height={Math.abs(item.endY - item.y)} rx="8" {...common} />;
  if (item.type === "ellipse") return <ellipse cx={(item.x + item.endX) / 2} cy={(item.y + item.endY) / 2} rx={Math.abs(item.endX - item.x) / 2} ry={Math.abs(item.endY - item.y) / 2} {...common} />;
  if (item.type === "text") return <text x={item.x} y={item.y} fill={item.color} fontSize="28" fontWeight="600">{item.text}</text>;
  if (item.type === "sticky") return <g transform={`translate(${item.x} ${item.y})`}><rect width="180" height="150" rx="8" fill="#fef08a" /><text x="16" y="34" fill="#713f12" fontSize="18">{item.text}</text></g>;
  return null;
}

export default function Canvas({ objects, onObjectsChange, tool, color, strokeWidth, onCursorMove, cursors, users, zoom }) {
  const svgRef = useRef(null);
  const [draft, setDraft] = useState(null);

  const pointFromEvent = (event) => {
    const bounds = svgRef.current.getBoundingClientRect();
    return { x: ((event.clientX - bounds.left) / bounds.width) * BOARD_WIDTH, y: ((event.clientY - bounds.top) / bounds.height) * BOARD_HEIGHT };
  };
  const commit = (item) => onObjectsChange([...objects, item]);
  const onPointerDown = (event) => {
    if (tool === "select") return;
    const point = pointFromEvent(event);
    if (tool === "text") {
      const text = window.prompt("Text to add");
      if (text?.trim()) commit({ id: crypto.randomUUID(), type: "text", ...point, text: text.trim(), color });
      return;
    }
    if (tool === "sticky") { commit({ id: crypto.randomUUID(), type: "sticky", ...point, text: "New idea" }); return; }
    event.currentTarget.setPointerCapture(event.pointerId);
    setDraft(tool === "pen" ? { id: crypto.randomUUID(), type: "pen", points: [point], color, strokeWidth } : { id: crypto.randomUUID(), type: tool, ...point, endX: point.x, endY: point.y, color, strokeWidth });
  };
  const onPointerMove = (event) => {
    const point = pointFromEvent(event);
    onCursorMove({ x: point.x / BOARD_WIDTH, y: point.y / BOARD_HEIGHT });
    if (!draft) return;
    setDraft((current) => current.type === "pen" ? { ...current, points: [...current.points, point] } : { ...current, endX: point.x, endY: point.y });
  };
  const onPointerUp = (event) => { if (draft) commit(draft); setDraft(null); event.currentTarget.releasePointerCapture?.(event.pointerId); };

  return <div className="h-full w-full overflow-auto bg-slate-100 p-5"><svg ref={svgRef} viewBox={`0 0 ${BOARD_WIDTH} ${BOARD_HEIGHT}`} onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} style={{ width: `${zoom}%` }} className={`min-h-[620px] min-w-[980px] touch-none rounded-xl bg-white shadow-sm ${tool === "select" ? "cursor-default" : "cursor-crosshair"}`}>
    <defs><pattern id="dot-grid" width="24" height="24" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#e2e8f0" /></pattern></defs>
    <rect width="100%" height="100%" fill="url(#dot-grid)" />
    {objects.map((item) => <Shape key={item.id} item={item} />)}
    {draft && <Shape item={draft} />}
    <CursorLayer cursors={cursors} users={users} />
  </svg></div>;
}
