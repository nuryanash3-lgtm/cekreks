"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
    ChevronDown,
    Globe,
    User,
    Menu,
    X,
    Check,
} from "lucide-react";
import Logo from "@/components/common/Logo";
import { NAV_ITEMS } from "@/constants/navigation";

const LANGUAGES = [
    { code: "id", label: "Bahasa (ID)" },
    { code: "en", label: "English (EN)" },
];

export default function Navbar() {
    const [activeNav, setActiveNav] = useState("Beranda");
    const [isLangOpen, setIsLangOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState("id");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    const langRef = useRef<HTMLDivElement>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // Deteksi scroll untuk efek latar belakang blur
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 15);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Tutup dropdown jika klik di luar elemen
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            const target = event.target as Node;
            if (langRef.current && !langRef.current.contains(target)) {
                setIsLangOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Kunci scroll halaman saat menu mobile terbuka
    useEffect(() => {
        if (!isMobileMenuOpen) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        return () => {
            document.body.style.overflow = previousOverflow;
        };
    }, [isMobileMenuOpen]);

    const selectedLangLabel =
        LANGUAGES.find((lang) => lang.code === currentLang)?.label || "Bahasa (ID)";

    return (
        <header
            className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${isScrolled
                ? "bg-[#0e071e]/80 backdrop-blur-lg border-b border-purple-900/30 shadow-[0_4px_30px_rgba(0,0,0,0.5)] py-3"
                : "bg-transparent py-4"
                }`}
        >
            <div className="max-w-[100rem] mx-auto flex items-center justify-between px-4 sm:px-6">
                <Logo />

                {/* ================= NAV DESKTOP ================= */}
                <nav className="hidden lg:flex items-center gap-1 bg-[#150a2e]/90 backdrop-blur-md border border-purple-900/40 px-3 py-1.5 rounded-full shadow-inner shadow-purple-950/40">
                    {NAV_ITEMS.map((item) => {
                        const isActive = activeNav === item.name;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setActiveNav(item.name)}
                                className={`flex items-center gap-1 px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-300 ${isActive
                                    ? "bg-gradient-to-r from-[#6929d9] via-[#4f46e5] to-[#0ea5e9] text-white shadow-[0_0_16px_rgba(14,165,233,0.45)]"
                                    : "text-slate-300 hover:text-white hover:bg-white/5"
                                    }`}
                            >
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                {/* ================= AKSI KANAN (DESKTOP) ================= */}
                <div className="hidden lg:flex items-center gap-3">
                    {/* Dropdown Bahasa */}
                    <div className="relative" ref={langRef}>
                        <button
                            onClick={() => setIsLangOpen((prev) => !prev)}
                            className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1c113b]/80 border border-purple-800/40 text-xs text-slate-300 hover:border-purple-600 transition"
                        >
                            <Globe className="w-3.5 h-3.5 text-purple-300" />
                            <span>{selectedLangLabel}</span>
                            <ChevronDown
                                className={`w-3 h-3 text-slate-400 transition-transform duration-200 ${isLangOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {isLangOpen && (
                            <div className="absolute top-full right-0 mt-2 w-40 p-1.5 rounded-xl bg-[#140b2b]/95 backdrop-blur-xl border border-purple-800/40 shadow-xl flex flex-col gap-1">
                                {LANGUAGES.map((lang) => (
                                    <button
                                        key={lang.code}
                                        onClick={() => {
                                            setCurrentLang(lang.code);
                                            setIsLangOpen(false);
                                        }}
                                        className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-medium text-left transition ${currentLang === lang.code
                                            ? "bg-purple-900/60 text-cyan-300"
                                            : "text-slate-300 hover:bg-white/5"
                                            }`}
                                    >
                                        <span>{lang.label}</span>
                                        {currentLang === lang.code && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Tombol Login */}
                    <Link
                        href="/login"
                        className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#1c113b]/80 border border-purple-800/40 text-xs font-medium text-slate-200 hover:bg-purple-900/40 hover:border-cyan-400/50 transition"
                    >
                        <User className="w-3.5 h-3.5" />
                        <span>Login</span>
                    </Link>
                </div>

                {/* TOMBOL MOBILE BURGER */}
                <div className="flex items-center gap-2 lg:hidden">
                    {/* Tombol Bahasa Singkat untuk Mobile */}
                    <button
                        onClick={() => setCurrentLang((prev) => (prev === "id" ? "en" : "id"))}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-[#1c113b]/80 border border-purple-800/40 text-xs text-slate-300"
                    >
                        <Globe className="w-3.5 h-3.5 text-purple-300" />
                        <span className="uppercase">{currentLang}</span>
                    </button>

                    <button
                        onClick={() => setIsMobileMenuOpen(true)}
                        className="p-2 rounded-xl bg-[#190d38] border border-purple-800/50 text-slate-200 hover:text-white"
                        aria-label="Buka Menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>

            {/* ================= DRAWER MENU RESPONSIVE (DILUAR STACKING CONTEXT DENGAN PORTAL) ================= */}
            {mounted &&
                createPortal(
                    <div
                        className={`fixed inset-0 z-[9999] lg:hidden transition-all duration-300 ${isMobileMenuOpen
                                ? "pointer-events-auto visible"
                                : "pointer-events-none invisible"
                            }`}
                    >
                        {/* 1. Backdrop Gelap Menutup 100% Layar */}
                        <div
                            className={`fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${isMobileMenuOpen ? "opacity-100" : "opacity-0"
                                }`}
                            onClick={() => setIsMobileMenuOpen(false)}
                        />

                        {/* 2. Panel Menu Mobile Menutup Sisi Kiri Penuh (h-[100dvh]) */}
                        <div
                            className={`fixed inset-y-0 left-0 w-full max-w-xs sm:max-w-sm h-[100dvh] bg-[#0e071e] border-r border-purple-900/60 p-6 flex flex-col justify-between overflow-y-auto transform transition-transform duration-300 ease-in-out shadow-[20px_0_50px_rgba(0,0,0,0.8)] z-10 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                                }`}
                        >
                            <div>
                                {/* Header Drawer */}
                                <div className="flex items-center justify-between pb-6 border-b border-purple-900/30">
                                    <Logo />
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="w-9 h-9 rounded-xl bg-[#20103f] border border-purple-700/40 flex items-center justify-center text-slate-300 hover:text-white transition active:scale-95"
                                        aria-label="Tutup Menu"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                {/* Daftar Menu Mobile */}
                                <div className="flex flex-col gap-5 mt-6">
                                    <Link
                                        href="/#beranda"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-base font-semibold text-slate-200 hover:text-cyan-300 transition"
                                    >
                                        Beranda
                                    </Link>

                                    <Link
                                        href="/#portofolio"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-base font-semibold text-slate-200 hover:text-cyan-300 transition"
                                    >
                                        Portofolio
                                    </Link>

                                    <Link
                                        href="/#layanan"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-base font-semibold text-slate-200 hover:text-cyan-300 transition"
                                    >
                                        Layanan
                                    </Link>

                                    <Link
                                        href="/#harga"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-base font-semibold text-slate-200 hover:text-cyan-300 transition"
                                    >
                                        Harga
                                    </Link>

                                    <Link
                                        href="/#kontak"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="text-base font-semibold text-slate-200 hover:text-cyan-300 transition"
                                    >
                                        Kontak
                                    </Link>
                                </div>
                            </div>

                            {/* Tombol Login Bawah */}
                            <div className="pt-6 border-t border-purple-900/30">
                                <Link
                                    href="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="w-full py-3 rounded-full bg-[#1b0e38] border border-purple-700/60 text-sm font-semibold text-white flex items-center justify-center gap-2 hover:bg-purple-900/50 transition shadow-lg shadow-purple-950/50 active:scale-[0.98]"
                                >
                                    <User className="w-4 h-4 text-cyan-400" />
                                    <span>Login</span>
                                </Link>
                            </div>
                        </div>
                    </div>,
                    document.body
                )}
        </header>
    );
}