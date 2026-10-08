import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate, Outlet } from "react-router-dom";
import {
    LayoutDashboard,
    ShoppingCart,
    Layers,
    Users,
    LogOut,
    Sparkles,
    ExternalLink,
    Menu,
    X,
    User as UserIcon,
    Tag,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/AuthContext";

export function DashboardLayout() {
    const location = useLocation();
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Close mobile menu on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") setMobileMenuOpen(false);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Close mobile menu on resize >= lg (1024px)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setMobileMenuOpen(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Lock body scroll when mobile menu is open
    useEffect(() => {
        if (mobileMenuOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileMenuOpen]);

    const handleLogout = async () => {
        await logout();
        navigate("/login");
    };

    const menuItems = [
        {
            title: "Dashboard Ringkasan",
            path: "/admin/dashboard",
            icon: LayoutDashboard,
        },
        {
            title: "POS Kasir (Order Baru)",
            path: "/admin/pos",
            icon: ShoppingCart,
            highlight: true,
        },
        {
            title: "Papan Antrian Cucian",
            path: "/admin/orders",
            icon: Layers,
        },
        {
            title: "Data Pelanggan",
            path: "/admin/customers",
            icon: Users,
        },
        {
            title: "Layanan & Tarif",
            path: "/admin/services",
            icon: Tag,
        },
    ];

    return (
        <div className="min-h-screen bg-slate-50 flex">
            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex w-64 flex-col bg-white sticky top-0 h-screen z-30 shadow-xs">
                {/* Brand */}
                <div className="h-16 flex items-center px-6">
                    <Link
                        to="/"
                        className="flex items-center space-x-2 font-black text-xl text-primary tracking-tight"
                    >
                        <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center shadow-md">
                            <Sparkles className="w-4 h-4 text-white" />
                        </div>
                        <span className="text-slate-900 font-extrabold text-xl">
                            Laundry
                        </span>
                    </Link>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6 px-4 space-y-1.5">
                    <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                        Menu Operasional
                    </div>
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={`flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                                    isActive
                                        ? "bg-primary text-white shadow-sm"
                                        : item.highlight
                                          ? "bg-primary/10 text-primary hover:bg-primary/20 font-semibold"
                                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                }`}
                            >
                                <Icon
                                    className={`w-4 h-4 ${isActive ? "text-white" : item.highlight ? "text-primary" : "text-slate-500"}`}
                                />
                                <span>{item.title}</span>
                            </Link>
                        );
                    })}

                    <div className="pt-6 px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
                        Akses Publik
                    </div>
                    <a
                        href="/track"
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <span className="flex items-center space-x-3">
                            <ExternalLink className="w-4 h-4 text-slate-400" />
                            <span>Portal Lacak Resi</span>
                        </span>
                        <Badge
                            variant="outline"
                            className="text-[10px] py-0 border-0 bg-slate-100"
                        >
                            Publik
                        </Badge>
                    </a>
                </div>

                {/* User Card & Logout */}
                <div className="p-4 bg-slate-50/70">
                    <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 font-bold">
                            <UserIcon className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="font-semibold text-sm text-slate-900 truncate">
                                {user?.name || "Staff Laundry"}
                            </div>
                            <div className="flex items-center space-x-1">
                                <Badge
                                    variant={
                                        user?.role === "admin"
                                            ? "default"
                                            : "secondary"
                                    }
                                    className="text-[10px] uppercase font-bold py-0"
                                >
                                    {user?.role || "Kasir"}
                                </Badge>
                            </div>
                        </div>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="ghost"
                        size="sm"
                        className="w-full text-rose-600 bg-rose-50/60 hover:bg-rose-100 hover:text-rose-700"
                    >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Top Navbar Header */}
                <header className="h-16 bg-white sticky top-0 z-20 flex items-center justify-between px-4 sm:px-6 lg:px-8 shadow-xs">
                    <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
                        <button
                            type="button"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            aria-label={
                                mobileMenuOpen
                                    ? "Tutup navigasi"
                                    : "Buka navigasi"
                            }
                            aria-expanded={mobileMenuOpen}
                            className="lg:hidden p-2 rounded-xl text-slate-700 hover:bg-slate-100 active:bg-slate-200 transition-colors shrink-0"
                        >
                            {mobileMenuOpen ? (
                                <X className="w-5 h-5" />
                            ) : (
                                <Menu className="w-5 h-5" />
                            )}
                        </button>
                        <div className="font-bold text-slate-900 text-sm sm:text-base lg:text-lg truncate">
                            {menuItems.find((i) => i.path === location.pathname)
                                ?.title || "Panel Laundry"}
                        </div>
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
                        <Link to="/admin/pos">
                            <Button
                                size="sm"
                                className="bg-primary text-white hover:bg-primary/90 font-semibold shadow-xs"
                            >
                                <ShoppingCart className="w-4 h-4 sm:mr-1.5" />
                                <span className="hidden sm:inline">
                                    + Order Baru
                                </span>
                                <span className="sm:hidden font-bold">POS</span>
                            </Button>
                        </Link>
                    </div>
                </header>

                {/* Mobile Navigation Drawer with Animated Backdrop */}
                <AnimatePresence>
                    {mobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                key="admin-nav-backdrop"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                onClick={() => setMobileMenuOpen(false)}
                                className="fixed inset-0 top-16 bg-slate-900/40 backdrop-blur-xs z-30 lg:hidden"
                            />

                            {/* Drawer Content */}
                            <motion.div
                                key="admin-nav-panel"
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2, ease: "easeOut" }}
                                className="fixed top-16 left-0 right-0 z-40 bg-white p-4 space-y-2 shadow-xl lg:hidden max-h-[calc(100vh-4rem)] overflow-y-auto"
                            >
                                <div className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Menu Operasional
                                </div>
                                {menuItems.map((item) => {
                                    const Icon = item.icon;
                                    const isActive =
                                        location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            onClick={() =>
                                                setMobileMenuOpen(false)
                                            }
                                            className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                                isActive
                                                    ? "bg-primary text-white shadow-xs"
                                                    : item.highlight
                                                      ? "bg-primary/10 text-primary font-bold hover:bg-primary/20"
                                                      : "text-slate-700 hover:bg-slate-100"
                                            }`}
                                        >
                                            <Icon
                                                className={`w-4 h-4 ${isActive ? "text-white" : item.highlight ? "text-primary" : "text-slate-500"}`}
                                            />
                                            <span>{item.title}</span>
                                        </Link>
                                    );
                                })}

                                <div className="pt-3 px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                    Akses Publik
                                </div>
                                <a
                                    href="/track"
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-700 hover:bg-slate-100"
                                >
                                    <span className="flex items-center space-x-3">
                                        <ExternalLink className="w-4 h-4 text-slate-400" />
                                        <span>Portal Lacak Resi</span>
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="text-[10px] py-0 border-0 bg-slate-100"
                                    >
                                        Publik
                                    </Badge>
                                </a>

                                <div className="pt-3 flex justify-between items-center px-1">
                                    <div className="text-xs">
                                        <span className="font-bold text-slate-800 block truncate max-w-[150px]">
                                            {user?.name || "Staff"}
                                        </span>
                                        <span className="text-slate-400 text-[10px] uppercase font-semibold">
                                            {user?.role || "Kasir"}
                                        </span>
                                    </div>
                                    <Button
                                        onClick={handleLogout}
                                        variant="ghost"
                                        size="sm"
                                        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 text-xs font-semibold"
                                    >
                                        <LogOut className="w-4 h-4 mr-1.5" />{" "}
                                        Keluar
                                    </Button>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>

                {/* Nested Page Content */}
                <main
                    className={`flex-1 min-w-0 p-4 sm:p-6 lg:p-8 w-full ${location.pathname === "/admin/orders" ? "max-w-none" : "max-w-7xl mx-auto"}`}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
