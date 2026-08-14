import {
  LayoutDashboard,
  Plus,
  Briefcase,
  Wallet,
  Droplet,
  Shield,
  Receipt,
  FileText,
  Settings,
  Circle,
  X,
  Menu,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useState } from "react";
import { useSidebar } from "../../context/SidebarContext";
import { useActiveAccount, useActiveWalletChain, useWalletBalance } from "thirdweb/react";
import { skaleBaseSepolia, thirdwebClient } from "../../thirdweb/client";

function formatTokenAmount3(value: string | number): string {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n)) return String(value);
  return n.toFixed(3);
}

export function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();
  const account = useActiveAccount();
  const chain = useActiveWalletChain();
  const nativeBalance = useWalletBalance({
    client: thirdwebClient,
    chain: skaleBaseSepolia,
    address: account?.address,
  });

  const walletValue =
    nativeBalance.data?.displayValue && nativeBalance.data?.symbol
      ? `${formatTokenAmount3(nativeBalance.data.displayValue)} ${nativeBalance.data.symbol}`
      : account?.address
        ? "—"
        : "Not connected";
  const walletSubtext = account?.address
    ? `Connected • ${chain?.name ?? skaleBaseSepolia.name}`
    : "Connect on Wallet page";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Plus, label: "Create Task", path: "/create-task" },
    { icon: Briefcase, label: "Active Jobs", path: "/active-jobs" },
    { icon: Wallet, label: "Wallet", path: "/wallet" },
    { icon: Droplet, label: "Faucet", path: "/faucet" },
    { icon: Shield, label: "Policies", path: "/policies" },
    { icon: Receipt, label: "Receipts", path: "/receipts" },
    { icon: FileText, label: "Logs", path: "/logs" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button - Hidden when menu is open */}
      {!mobileMenuOpen && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="lg:hidden fixed top-4 left-4 z-[60] p-2 bg-slate-900 border border-slate-800 rounded-lg text-white cursor-pointer shadow-lg"
        >
          <Menu className="w-6 h-6" />
        </button>
      )}

      {/* Mobile Overlay */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-slate-950 border-r border-slate-800 flex flex-col z-50 transition-all duration-300 ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        } ${isCollapsed ? "lg:w-20" : "lg:w-64"} w-64`}
      >
        {/* Close button for mobile */}
        <button
          onClick={() => setMobileMenuOpen(false)}
          className="lg:hidden absolute top-4 right-4 p-2 text-slate-400 hover:text-white cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Collapse/Expand Toggle Button - Desktop Only */}
        <button
          onClick={toggleSidebar}
          className={`hidden lg:flex absolute top-6 -right-3 w-6 h-6 bg-slate-900 border border-slate-700 rounded-full items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 hover:border-slate-600 transition-all cursor-pointer z-10 shadow-lg`}
        >
          {isCollapsed ? (
            <ChevronRight className="w-3.5 h-3.5" />
          ) : (
            <ChevronLeft className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Logo Section */}
        <div className={`border-b border-slate-800 transition-all ${isCollapsed ? "p-4" : "p-5"}`}>
          <button
            onClick={() => handleNavigation("/")}
            className={`flex items-center w-full hover:opacity-90 transition-opacity cursor-pointer gap-3 ${
              isCollapsed ? "justify-center gap-0" : ""
            }`}
          >
            <span className="flex items-center justify-center flex-shrink-0 w-12 h-12 rounded-xl bg-slate-800/80 border border-slate-700/80 p-1.5">
              <img
                src="/favicon.svg"
                alt=""
                className="w-full h-full object-contain"
              />
            </span>
            {!isCollapsed && (
              <span className="text-xl font-bold text-white whitespace-nowrap overflow-hidden truncate">
                ProcuraAI
              </span>
            )}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <div key={item.label} className="relative group">
                <button
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center rounded-lg transition-all relative cursor-pointer ${
                    isCollapsed ? "justify-center px-3 py-3" : "gap-3 px-4 py-3"
                  } ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/50"
                  }`}
                >
                  {isActive && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"></div>
                  )}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && (
                    <span className="font-medium whitespace-nowrap overflow-hidden">
                      {item.label}
                    </span>
                  )}
                </button>

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="hidden group-hover:block absolute left-full top-1/2 -translate-y-1/2 ml-2 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm whitespace-nowrap z-50 shadow-xl">
                    {item.label}
                    <div className="absolute right-full top-1/2 -translate-y-1/2 border-4 border-transparent border-r-slate-800"></div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Wallet Summary at Bottom */}
        <div className={`border-t border-slate-800 transition-all ${isCollapsed ? "p-4" : "p-6"}`}>
          {isCollapsed ? (
            <div className="group relative">
              <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 flex flex-col items-center gap-2 cursor-pointer">
                <Wallet className="w-5 h-5 text-blue-400" />
                <Circle className="w-2 h-2 fill-green-400 text-green-400" />
              </div>
              
              {/* Tooltip for collapsed wallet */}
              <div className="hidden group-hover:block absolute left-full bottom-0 ml-2 px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white text-sm whitespace-nowrap z-50 shadow-xl min-w-[200px]">
                <div className="text-xs text-slate-400 mb-1">Wallet Balance</div>
                <div className="text-lg font-bold text-white mb-2">{walletValue}</div>
                <div className="flex items-center gap-2 text-xs">
                  <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                  <span className="text-green-400">{walletSubtext}</span>
                </div>
                <div className="absolute right-full top-4 border-4 border-transparent border-r-slate-800"></div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-sm text-slate-400">Wallet Balance</div>
              <div className="text-2xl font-bold text-white">{walletValue}</div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">Network: {chain?.name ?? "—"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Circle className="w-2 h-2 fill-green-400 text-green-400" />
                <span className="text-sm text-green-400">{account?.address ? "Connected" : "Disconnected"}</span>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}