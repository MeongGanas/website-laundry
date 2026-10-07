import React, { useState, useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import {
    Search,
    CheckCircle2,
    Clock,
    Shirt,
    Calendar,
    AlertCircle,
    Sparkles,
    ArrowLeft,
    Phone,
    Layers,
    ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah, formatDate } from "@/lib/utils";
import api from "@/services/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

const STATUS_STEPS = [
    {
        key: "pending",
        label: "Baru Masuk",
        icon: Clock,
        desc: "Pesanan diterima di outlet",
    },
    {
        key: "washing",
        label: "Sedang Dicuci",
        icon: Shirt,
        desc: "Pakaian sedang diproses di mesin cuci",
    },
    {
        key: "drying",
        label: "Pengeringan",
        icon: Sparkles,
        desc: "Proses pengeringan maksimal",
    },
    {
        key: "ironing",
        label: "Disetrika & Packing",
        icon: Layers,
        desc: "Penyetrikaan uap dan pengemasan rapi",
    },
    {
        key: "ready",
        label: "Siap Diambil",
        icon: CheckCircle2,
        desc: "Pakaian sudah bersih, wangi & siap diambil",
    },
    {
        key: "completed",
        label: "Selesai / Diambil",
        icon: CheckCircle2,
        desc: "Pesanan sudah diserahkan kepada pelanggan",
    },
];

export function TrackOrderPage() {
    const shouldReduceMotion = useReducedMotion();
    const [searchParams] = useSearchParams();
    const initialInvoice = searchParams.get("invoice") || "";

    const [query, setQuery] = useState(initialInvoice);
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSearch = async (targetQuery) => {
        const q = (targetQuery || query).trim();
        if (!q) return;

        setLoading(true);
        setError(null);
        setOrder(null);

        try {
            const res = await api.get(`/track/${encodeURIComponent(q)}`);
            setOrder(res.data);
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError(
                    "Pesanan dengan nomor nota atau nomor HP tersebut tidak ditemukan. Pastikan nomor nota sudah benar.",
                );
            } else {
                setError(
                    "Gagal menghubungi server. Silakan coba beberapa saat lagi.",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (initialInvoice) {
            handleSearch(initialInvoice);
        }
    }, [initialInvoice]);

    const getCurrentStepIndex = (status) => {
        return STATUS_STEPS.findIndex((s) => s.key === status);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <Navbar />

            <main className="container mx-auto px-4 sm:px-6 py-12 max-w-4xl flex-1">
                {/* Header Title */}
                <motion.div
                    initial={
                        shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 15 }
                    }
                    animate={
                        shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0 }
                    }
                    className="text-center mb-8"
                >
                    <Badge className="mb-3 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs px-3 py-1 font-bold">
                        Live Tracker
                    </Badge>
                    <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-2">
                        Pelacakan Status Cucian
                    </h1>
                    <p className="text-xs sm:text-sm text-slate-600">
                        Ketahui progres pencucian pakaian Anda secara langsung
                        tanpa perlu repot datang ke outlet.
                    </p>
                </motion.div>

                {/* Search Box Card */}
                <motion.div
                    initial={
                        shouldReduceMotion
                            ? { opacity: 0 }
                            : { opacity: 0, y: 10 }
                    }
                    animate={
                        shouldReduceMotion
                            ? { opacity: 1 }
                            : { opacity: 1, y: 0 }
                    }
                    transition={{ delay: 0.1 }}
                >
                    <Card className="mb-8 border-slate-200 shadow-md">
                        <CardContent className="p-4 sm:p-6">
                            <form
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSearch();
                                }}
                                className="flex flex-col sm:flex-row gap-3"
                            >
                                <div className="relative flex-1">
                                    <label
                                        htmlFor="track-query-input"
                                        className="sr-only"
                                    >
                                        Nomor Nota atau Nomor WhatsApp Pelanggan
                                    </label>
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                    <Input
                                        id="track-query-input"
                                        type="text"
                                        placeholder="Masukkan Nomor Nota (cth: TRX-20261007-0001) atau No HP…"
                                        value={query}
                                        onChange={(e) =>
                                            setQuery(e.target.value)
                                        }
                                        autoComplete="off"
                                        spellCheck={false}
                                        className="pl-10 h-11 text-xs sm:text-sm"
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={loading}
                                    className="h-11 px-6 font-bold shadow-sm"
                                >
                                    {loading ? "Mencari…" : "Cek Status"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center space-x-3 text-xs sm:text-sm mb-8"
                    >
                        <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-600" />
                        <span>{error}</span>
                    </motion.div>
                )}

                {/* Order Details & Tracking Card */}
                {order && (
                    <motion.div
                        initial={
                            shouldReduceMotion
                                ? { opacity: 0 }
                                : { opacity: 0, scale: 0.98 }
                        }
                        animate={
                            shouldReduceMotion
                                ? { opacity: 1 }
                                : { opacity: 1, scale: 1 }
                        }
                        transition={{ duration: 0.4 }}
                        className="space-y-6"
                    >
                        {/* Header Status Card */}
                        <Card className="border-slate-200 overflow-hidden shadow-lg">
                            <div className="bg-gradient-to-r from-primary to-blue-700 p-6 sm:p-8 text-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="text-xs uppercase font-bold tracking-wider text-blue-100 mb-1">
                                        Nomor Nota / Resi
                                    </div>
                                    <div className="text-2xl sm:text-3xl font-black font-mono tracking-tight tabular-nums">
                                        {order.invoice_number}
                                    </div>
                                    <div className="text-xs text-blue-100 mt-1.5">
                                        Pelanggan:{" "}
                                        <span className="font-semibold text-white">
                                            {order.customer_name}
                                        </span>{" "}
                                        (
                                        <span className="tabular-nums">
                                            {order.customer_phone}
                                        </span>
                                        )
                                    </div>
                                </div>

                                <div className="flex flex-col sm:items-end">
                                    <Badge className="text-xs px-3.5 py-1 font-bold mb-2 uppercase bg-white text-primary hover:bg-white shadow-sm">
                                        Status: {order.status}
                                    </Badge>
                                    <span className="text-xs text-blue-100 tabular-nums">
                                        Est. Selesai:{" "}
                                        {formatDate(order.estimated_completion)}
                                    </span>
                                </div>
                            </div>

                            {/* Progress Tracker Steps */}
                            <CardContent className="p-6 sm:p-8">
                                <h3 className="font-bold text-slate-900 mb-8 text-base">
                                    Progres Pengerjaan Laundry:
                                </h3>

                                <div className="relative pl-6 sm:pl-8 border-l-2 border-primary/20 space-y-8 ml-3">
                                    {STATUS_STEPS.map((step, idx) => {
                                        const currentIdx = getCurrentStepIndex(
                                            order.status,
                                        );
                                        const isDone = currentIdx >= idx;
                                        const isCurrent = currentIdx === idx;
                                        const Icon = step.icon;

                                        return (
                                            <motion.div
                                                key={step.key}
                                                initial={
                                                    shouldReduceMotion
                                                        ? { opacity: 0 }
                                                        : { opacity: 0, x: -10 }
                                                }
                                                animate={
                                                    shouldReduceMotion
                                                        ? { opacity: 1 }
                                                        : { opacity: 1, x: 0 }
                                                }
                                                transition={{
                                                    delay: idx * 0.08,
                                                }}
                                                className="relative group"
                                            >
                                                {/* Dot / Icon indicator */}
                                                <div
                                                    className={`absolute -left-[37px] sm:-left-[45px] top-0 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                                                        isDone
                                                            ? "bg-primary border-primary text-white shadow-md"
                                                            : "bg-white border-slate-300 text-slate-300"
                                                    }`}
                                                >
                                                    <Icon className="w-4 h-4" />
                                                </div>

                                                {/* Text Detail */}
                                                <div>
                                                    <div className="flex items-center space-x-2">
                                                        <h4
                                                            className={`font-bold text-sm ${
                                                                isDone
                                                                    ? "text-slate-900"
                                                                    : "text-slate-400"
                                                            }`}
                                                        >
                                                            {step.label}
                                                        </h4>
                                                        {isCurrent && (
                                                            <Badge className="text-[10px] py-0 px-2 animate-pulse bg-emerald-600 text-white hover:bg-emerald-600 font-bold">
                                                                Tahap Saat Ini
                                                            </Badge>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-slate-500 mt-0.5">
                                                        {step.desc}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Order Items & Payment Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Item List */}
                            <Card className="border-slate-200 shadow-2xs">
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="text-base text-slate-900">
                                        Rincian Cucian
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3">
                                    {order.items?.map((item, idx) => (
                                        <div
                                            key={idx}
                                            className="flex justify-between items-center text-xs sm:text-sm py-2 border-b border-dashed border-slate-100 last:border-0"
                                        >
                                            <div>
                                                <div className="font-semibold text-slate-800">
                                                    {item.service_name}
                                                </div>
                                                <div className="text-xs text-slate-500">
                                                    <span className="tabular-nums font-semibold">
                                                        {item.quantity}
                                                    </span>{" "}
                                                    {item.unit}
                                                </div>
                                            </div>
                                            <div className="font-bold text-slate-900 tabular-nums">
                                                {formatRupiah(item.subtotal)}
                                            </div>
                                        </div>
                                    ))}

                                    {order.perfume && (
                                        <div className="pt-2 text-xs text-slate-600 flex justify-between border-t">
                                            <span>Pilihan Aroma Parfum:</span>
                                            <span className="font-bold text-primary">
                                                {order.perfume}
                                            </span>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Payment Summary */}
                            <Card className="border-slate-200 shadow-2xs flex flex-col justify-between">
                                <CardHeader className="pb-3 border-b">
                                    <CardTitle className="text-base text-slate-900">
                                        Status Pembayaran
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="p-4 space-y-3 text-xs sm:text-sm">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Total Biaya:
                                        </span>
                                        <span className="text-lg font-black text-slate-900 tabular-nums">
                                            {formatRupiah(order.total_amount)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-600">
                                            Sudah Dibayar:
                                        </span>
                                        <span className="font-semibold text-emerald-600 tabular-nums">
                                            {formatRupiah(order.paid_amount)}
                                        </span>
                                    </div>

                                    {order.payment_status !== "paid" && (
                                        <p className="text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200 mt-3 leading-relaxed">
                                            * Pembayaran dapat diselesaikan saat
                                            pengambilan pakaian di outlet kasir.
                                        </p>
                                    )}
                                </CardContent>
                                <div className="p-4">
                                    <div className="flex justify-between items-center pt-2 border-t">
                                        <span className="font-medium text-slate-800">
                                            Status:
                                        </span>
                                        <Badge
                                            variant={
                                                order.payment_status === "paid"
                                                    ? "paid"
                                                    : "unpaid"
                                            }
                                            className="font-bold uppercase"
                                        >
                                            {order.payment_status === "paid"
                                                ? "Lunas"
                                                : "Belum Lunas"}
                                        </Badge>
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </main>

            <Footer />
        </div>
    );
}
