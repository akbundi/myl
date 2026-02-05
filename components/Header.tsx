import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Role } from "../types";

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  hasDnaResult: boolean;
  currentTheme: "gold" | "navy";
  onToggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({
  onNavigate,
  currentPage,
  user,
  onLogin,
  onLogout,
  hasDnaResult,
  currentTheme,
  onToggleTheme,
}) => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === Role.ADMIN;

  const navItems = isAdmin
    ? [
        { id: "admin-dashboard", label: "COMMAND" },
        { id: "market-insights", label: "INSIGHTS" },
      ]
    : [
        { id: "discover", label: "DISCOVER" },
        { id: "scanner", label: "SCANNER" },
        { id: hasDnaResult ? "recommendations" : "profile", label: "DNA" },
      ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-[60] px-12 py-8 flex items-center justify-between bg-transparent">
      <div className="flex items-center gap-14">
        <button
          onClick={() => onNavigate("landing")}
          className="font-serif text-3xl font-bold text-luxe-gold tracking-tighter hover:opacity-80 transition-all uppercase"
        >
          PULSE
        </button>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`text-[10px] uppercase tracking-[0.3em] transition-all hover:text-luxe-gold font-bold ${
                  isActive ? "text-luxe-gold" : "text-white/40"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      </div>

      <button
        onClick={onToggleTheme}
        className="w-10 h-10 glass rounded-full flex items-center justify-center border-white/5 hover:border-luxe-gold/40 transition-all"
      >
        <div
          className={`w-2 h-2 rounded-full ${currentTheme === "gold" ? "bg-luxe-gold shadow-[0_0_8px_rgba(212,175,55,1)]" : "bg-[#E2E8F0]"}`}
        />
      </button>

      {user ? (
        <div className="relative">
          <button
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className="flex items-center gap-4 group"
          >
            <div className="text-right hidden sm:block">
              <p className="text-[8px] uppercase tracking-[0.3em] text-white/30 font-bold mb-0.5">
                {user.role}
              </p>
              <p className="text-[12px] font-medium text-white tracking-wide">
                {user.name}
              </p>
            </div>
            <img
              src={user.image}
              className={`w-10 h-10 rounded-full border ${isAdmin ? "border-luxe-gold" : "border-white/10"}`}
              alt="Profile"
            />
          </button>

          <AnimatePresence>
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-4 w-60 glass border border-white/10 rounded-2xl p-2 shadow-2xl bg-black/95 z-[70]"
              >
                <button
                  onClick={() => {
                    onNavigate(
                      isAdmin
                        ? "admin-dashboard"
                        : hasDnaResult
                          ? "recommendations"
                          : "profile",
                    );
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-white/5 transition-colors group flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-luxe-gold/10 flex items-center justify-center text-luxe-gold">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <p className="text-[11px] font-medium text-white group-hover:text-luxe-gold">
                    Dashboard
                  </p>
                </button>
                <div className="my-2 border-t border-white/5" />
                <button
                  onClick={() => {
                    onLogout();
                    setIsProfileOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl hover:bg-red-500/10 transition-colors group flex items-center gap-3 text-red-500"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m4 4H7"
                    />
                  </svg>
                  <p className="text-[11px] font-medium">Terminate Session</p>
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ) : (
        <button
          onClick={onLogin}
          className="px-8 py-3 bg-white/5 border border-white/10 rounded-full hover:border-luxe-gold/60 transition-all text-[10px] uppercase tracking-[0.3em] font-bold"
        >
          CONNECT
        </button>
      )}
    </header>
  );
};

export default Header;
