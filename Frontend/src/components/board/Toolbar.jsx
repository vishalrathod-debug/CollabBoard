import { Circle, MousePointer2, Pencil, Redo2, Square, StickyNote, Type, Undo2 } from "lucide-react";

const tools = [
  { id: "select", label: "Select", icon: MousePointer2 },
  { id: "pen", label: "Draw", icon: Pencil },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "ellipse", label: "Circle", icon: Circle },
  { id: "text", label: "Text", icon: Type },
  { id: "sticky", label: "Sticky note", icon: StickyNote },
];

export default function Toolbar({ activeTool, onToolChange, color, onColorChange, strokeWidth, onStrokeWidthChange, onUndo, onRedo, canUndo, canRedo }) {
  return (
    <aside className="flex items-center gap-1 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-300/40 md:flex-col">
      {tools.map(({ id, label, icon: Icon }) => (
        <button key={id} type="button" title={label} onClick={() => onToolChange(id)} className={`rounded-xl p-2.5 transition ${activeTool === id ? "bg-indigo-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>
          <Icon className="h-5 w-5" />
        </button>
      ))}
      <span className="hidden h-px w-7 bg-slate-200 md:block" />
      <input aria-label="Stroke colour" type="color" value={color} onChange={(event) => onColorChange(event.target.value)} className="h-8 w-8 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
      <input aria-label="Stroke width" type="range" min="1" max="12" value={strokeWidth} onChange={(event) => onStrokeWidthChange(Number(event.target.value))} className="hidden w-20 accent-indigo-600 md:block" />
      <span className="hidden h-px w-7 bg-slate-200 md:block" />
      <button type="button" title="Undo" disabled={!canUndo} onClick={onUndo} className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"><Undo2 className="h-5 w-5" /></button>
      <button type="button" title="Redo" disabled={!canRedo} onClick={onRedo} className="rounded-xl p-2.5 text-slate-600 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-35"><Redo2 className="h-5 w-5" /></button>
    </aside>
  );
}
