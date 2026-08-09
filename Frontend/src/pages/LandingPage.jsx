import { useNavigate } from "react-router-dom";
import previewImg from "../assets/gemini-svg.svg";
import { Zap, Users, CloudUpload, Monitor } from 'lucide-react';
import logo from "../assets/collablogo-removebg-preview.png";

export default function LandingPage() {
  const navigate = useNavigate();
  const features = [
    { icon: Zap, label: 'Real-time Sync' },
    { icon: Users, label: 'Share & Collaborate' },
    { icon: CloudUpload, label: 'Save Boards' },
    { icon: Monitor, label: 'Cross Platform' },
  ];

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <header className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center">
        <img src={logo} alt="logo" className="h-18 w-auto"/>
        <h1 className="text-xl font-bold text-indigo-600">
          CollabBoard
        </h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/login")}
            className="text-sm font-semibold text-slate-700 hover:text-indigo-600"
          >
            Log in
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="rounded-full bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700"
          >
            Sign up
          </button>
        </div>
      </header>

      {/* MAIN */}
      <div className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT */}
        <section className="pl-10 flex flex-col gap-6 text-center md:text-left">
          <div className="flex-col">
            <p className="text-4xl font-extrabold uppercase">
              Real-Time Sync
            </p>

            <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900">
              Collaborative 
            </h2>
            <span className="text-4xl md:text-5xl font-extrabold text-indigo-600">Whiteboard</span>
          </div>

          <p className="text-lg text-slate-600 max-w-lg">
            Draw, brainstorm, and plan with your team instantly. Bring ideas to life on a shared digital canvas from anywhere.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="w-44 rounded-full bg-indigo-600 px-8 py-3 text-white font-bold hover:bg-indigo-700"
          >
            Get started
          </button>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md">
      {features.map((item, index) => {
        const IconComponent = item.icon;
        return (
          <div
            key={index}
            className="flex items-center gap-3 px-4 py-3 bg-slate-100/80 hover:bg-slate-100 rounded-xl transition-all"
          >
            <IconComponent className="w-5 h-5 text-indigo-600 stroke-[2.2]" />
            <span className="text-sm font-medium text-slate-900">
              {item.label}
            </span>
          </div>
        );
      })}
    </div>
        </section>

        {/* RIGHT */}
        <section className="flex justify-center p-6 bg-slate-50 rounded-2xl">
          <img
            src={previewImg}
            alt="Whiteboard Preview"
            className="w-full h-full max-w-xl rounded-xl shadow-lg"
          />
        </section>
        
      </div>
    </div>
  );
}