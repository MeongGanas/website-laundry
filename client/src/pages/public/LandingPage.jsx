import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
    Search,
    Sparkles,
    ShieldCheck,
    Clock,
    Shirt,
    CheckCircle2,
    ArrowRight,
    Phone,
    MapPin,
    Star,
    Award,
    Heart,
    Droplets,
    Wind,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatRupiah } from "@/lib/utils";
import api from "@/services/api";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

export function LandingPage() {
    const shouldReduceMotion = useReducedMotion();
    const [popularServices, setPopularServices] = useState([]);
    const [loadingServices, setLoadingServices] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();

    const fadeIn = {
        hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
        visible: (i = 1) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
        }),
    };

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const res = await api.get("/public/services");
                setPopularServices(res.data.slice(0, 6));
            } catch (err) {
                console.error("Failed to load services", err);
            } finally {
                setLoadingServices(false);
            }
        };
        fetchServices();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;
        navigate(`/track?invoice=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-primary/20 selection:text-primary">
            <Navbar />

            {/* Hero Section with Split Image Visual */}
            <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/60 via-white to-slate-50 py-16 sm:py-24">
                {/* Subtle decorative glow blobs */}
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-primary/10 rounded-full blur-3xl pointer-events-none -z-10" />

                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                        {/* Left Col: Text & Quick Search */}
                        <motion.div
                            initial="hidden"
                            animate="visible"
                            variants={fadeIn}
                            className="lg:col-span-7 space-y-6 text-center lg:text-left"
                        >
                            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/80 text-primary text-xs font-bold shadow-2xs">
                                <Sparkles className="w-4 h-4 text-primary animate-pulse" />
                                <span>
                                    Solusi Laundry Higienis & Terpercaya
                                </span>
                            </div>

                            <h1 className="text-4xl sm:text-5xl lg:text-[55px] font-black text-slate-900 tracking-tight leading-[1.15]">
                                Pakaian Bersih & Rapi, <br />
                                <span className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                                    Bisa Dilacak Real-Time!
                                </span>
                            </h1>

                            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                                Nikmati kemudahan laundry modern tanpa rasa
                                khawatir. Sistem{" "}
                                <strong>1 mesin 1 pelanggan</strong>, detergen
                                premium antibakteri, dan notifikasi nota digital
                                instan ke WhatsApp Anda.
                            </p>

                            {/* Quick Tracking Search Bar */}
                            <div className="max-w-lg mx-auto lg:mx-0 bg-white p-2.5 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200">
                                <form
                                    onSubmit={handleSearch}
                                    className="flex flex-col sm:flex-row gap-2"
                                >
                                    <div className="relative flex-1">
                                        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                        <Input
                                            type="text"
                                            placeholder="Masukkan No. Nota / No. HP Anda..."
                                            value={searchQuery}
                                            onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                            }
                                            className="pl-10 h-11 text-xs border-0 focus-visible:ring-0 shadow-none bg-transparent"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        size="default"
                                        className="h-11 px-6 font-bold shadow-sm"
                                    >
                                        Lacak Resi
                                        <ArrowRight className="w-4 h-4 ml-1.5" />
                                    </Button>
                                </form>
                            </div>

                            {/* Demo Nota Shortcuts */}
                            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 text-xs text-slate-500 pt-1">
                                <span className="text-[11px] font-medium">
                                    💡 Contoh Nota Demo:
                                </span>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/track?invoice=TRX-20261007-0001",
                                        )
                                    }
                                    className="bg-white hover:bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-mono text-[11px] font-semibold border border-slate-200 shadow-2xs transition-colors"
                                >
                                    TRX-20261007-0001
                                </button>
                                <button
                                    onClick={() =>
                                        navigate(
                                            "/track?invoice=TRX-20261007-0002",
                                        )
                                    }
                                    className="bg-white hover:bg-slate-100 px-2.5 py-1 rounded-md text-slate-700 font-mono text-[11px] font-semibold border border-slate-200 shadow-2xs transition-colors"
                                >
                                    TRX-20261007-0002
                                </button>
                            </div>
                        </motion.div>

                        {/* Right Col: High Quality Aesthetic Laundry Imagery with Floating Badges */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="lg:col-span-5 relative"
                        >
                            <div className="relative mx-auto max-w-md lg:max-w-none">
                                {/* Main Hero Image */}
                                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                                    <img
                                        src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?auto=format&fit=crop&w=800&q=80"
                                        alt="Modern Laundry Interior"
                                        className="w-full h-80 sm:h-96 object-cover hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                                    <div className="absolute bottom-4 left-4 right-4 text-white p-2">
                                        <p className="text-xs font-medium text-slate-200">
                                            Standar Kebersihan Bintang 5
                                        </p>
                                        <h3 className="text-base font-bold">
                                            Mesin Cuci Higienis Suhu Terkontrol
                                        </h3>
                                    </div>
                                </div>

                                {/* Floating Badge 1 (Top Left) */}
                                <motion.div
                                    initial={{ y: -10 }}
                                    animate={{ y: 0 }}
                                    transition={{
                                        repeat: Infinity,
                                        repeatType: "reverse",
                                        duration: 3,
                                    }}
                                    className="absolute -top-4 -left-4 sm:-left-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0">
                                        <ShieldCheck className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-800">
                                            1 Mesin 1 Pelanggan
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Tidak dicampur orang lain
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Badge 2 (Bottom Right) */}
                                <motion.div
                                    initial={
                                        shouldReduceMotion
                                            ? { y: 0 }
                                            : { y: 10 }
                                    }
                                    animate={{ y: 0 }}
                                    transition={
                                        shouldReduceMotion
                                            ? { duration: 0 }
                                            : {
                                                  repeat: Infinity,
                                                  repeatType: "reverse",
                                                  duration: 3.5,
                                                  delay: 0.5,
                                              }
                                    }
                                    className="absolute -bottom-5 -right-4 sm:-right-6 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-slate-100 flex items-center space-x-3"
                                >
                                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="text-[11px] font-bold text-slate-800">
                                            Parfum Premium
                                        </div>
                                        <div className="text-[10px] text-slate-500">
                                            Harum tahan 7&nbsp;hari
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Feature Highlights Grid */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -4 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-xl bg-blue-100 text-primary flex items-center justify-center mb-4">
                                <Shirt className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">
                                Pencucian Higienis
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Pakaian Anda diproses tersendiri di mesin khusus
                                berstandar sanitasi tinggi.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -4 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4">
                                <Sparkles className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">
                                Pilihan Parfum Mewah
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Bebas pilih aroma: Lavender, Akasia, Ocean
                                Fresh, Snappy, atau Sakura.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -4 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                                <Clock className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">
                                Paket Kilat & Express
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Butuh cepat? Tersedia pilihan express
                                24&nbsp;jam dan kilat pengerjaan 6&nbsp;jam.
                            </p>
                        </motion.div>

                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -4 }}
                            className="p-6 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center transition-all shadow-2xs hover:shadow-md"
                        >
                            <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center mb-4">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-slate-900 mb-1">
                                Garansi 100% Puas
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Kurang wangi atau masih bernoda? Kami cuci ulang
                                gratis tanpa biaya tambahan.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Popular Services Section with Visual Thumbnails */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-12 gap-4">
                        <div>
                            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 text-xs px-3 py-1 font-bold mb-2">
                                Pilihan Terbaik Pelanggan
                            </Badge>
                            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                                Layanan & Tarif Terpopuler
                            </h2>
                            <p className="text-xs sm:text-sm text-slate-600 mt-1">
                                Timbangan jujur dan harga transparan untuk
                                kebutuhan laundry sehari-hari.
                            </p>
                        </div>
                        <Link to="/layanan">
                            <Button
                                variant="outline"
                                className="font-semibold text-xs border-slate-300"
                            >
                                Lihat Semua Layanan & Tarif →
                            </Button>
                        </Link>
                    </div>

                    {loadingServices ? (
                        <div className="text-center py-12 text-slate-400">
                            Memuat paket layanan…
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {popularServices.map((svc) => (
                                <motion.div
                                    key={svc.id}
                                    whileHover={
                                        shouldReduceMotion ? {} : { y: -5 }
                                    }
                                    transition={{ duration: 0.2 }}
                                >
                                    <Card className="h-full border-slate-200 hover:shadow-xl transition-all flex flex-col justify-between overflow-hidden bg-white">
                                        <CardHeader className="pb-3">
                                            <div className="flex items-center justify-between mb-2">
                                                <Badge
                                                    variant={
                                                        svc.category ===
                                                        "kiloan"
                                                            ? "default"
                                                            : "secondary"
                                                    }
                                                    className="uppercase font-bold text-[10px]"
                                                >
                                                    {svc.category}
                                                </Badge>
                                                <span className="text-xs text-slate-500 flex items-center bg-slate-100 px-2 py-0.5 rounded-full">
                                                    <Clock className="w-3 h-3 mr-1" />
                                                    <span className="tabular-nums font-semibold">
                                                        {svc.estimated_hours}
                                                    </span>
                                                    &nbsp;Jam
                                                </span>
                                            </div>
                                            <CardTitle className="text-lg text-slate-900">
                                                {svc.name}
                                            </CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex items-baseline">
                                                <span className="text-2xl font-black text-primary tabular-nums">
                                                    {formatRupiah(svc.price)}
                                                </span>
                                                <span className="text-xs text-slate-500 font-medium ml-1">
                                                    &nbsp;/ {svc.unit}
                                                </span>
                                            </div>
                                            <p className="text-xs text-slate-600 leading-relaxed min-h-[36px]">
                                                {svc.description}
                                            </p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    )}

                    <div className="text-center mt-12">
                        <Link to="/layanan">
                            <Button
                                size="lg"
                                className="font-bold px-8 shadow-md"
                            >
                                Katalog Lengkap
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Visual Photo Showcase: Keunggulan Laundry Kami */}
            <section className="py-20 bg-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-6xl">
                    <div className="text-center max-w-2xl mx-auto mb-14">
                        <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-emerald-200 text-xs px-3 py-1 font-bold mb-2">
                            Kualitas Teruji
                        </Badge>
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            Perawatan Terbaik untuk Setiap Helai Pakaian
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500 mt-2">
                            Kami memadukan peralatan modern dengan kehati-hatian
                            staf berpengalaman.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Photo Card 1: Lipatan Rapi */}
                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -6 }}
                            className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1582735689369-4fe89db7114c?auto=format&fit=crop&w=600&q=80"
                                alt="Hasil Setrika Uap dan Lipatan Rapi Bersih"
                                width={600}
                                height={384}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 space-y-2">
                                <div className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Hasil Sempurna
                                </div>
                                <h4 className="text-base font-bold text-slate-900">
                                    Setrika Uap & Lipatan Rapi
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Penyetrikaan uap suhu tinggi memastikan
                                    pakaian bebas kusut tanpa merusak serat kain
                                    halus.
                                </p>
                            </div>
                        </motion.div>

                        {/* Photo Card 2: Bedding & Blanket */}
                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -6 }}
                            className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=600&q=80"
                                alt="Perawatan Bed Cover dan Selimut Tebal"
                                width={600}
                                height={384}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 space-y-2">
                                <div className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Perawatan Khusus
                                </div>
                                <h4 className="text-base font-bold text-slate-900">
                                    Bed Cover & Selimut Tebal
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Pencucian mendalam mengangkat tungau dan
                                    debu, dikeringkan tuntas tanpa bau apek.
                                </p>
                            </div>
                        </motion.div>

                        {/* Photo Card 3: Shoes / Sneakers */}
                        <motion.div
                            whileHover={shouldReduceMotion ? {} : { y: -6 }}
                            className="rounded-3xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-xl transition-all"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=600&q=80"
                                alt="Cuci Sepatu Sneaker Deep Cleaning"
                                width={600}
                                height={384}
                                loading="lazy"
                                decoding="async"
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-6 space-y-2">
                                <div className="text-xs font-bold text-primary uppercase tracking-wider">
                                    Deep Cleaning
                                </div>
                                <h4 className="text-base font-bold text-slate-900">
                                    Cuci Sepatu & Sneaker
                                </h4>
                                <p className="text-xs text-slate-600 leading-relaxed">
                                    Perawatan manual khusus bahan kanvas, kulit,
                                    dan mesh agar sepatu kembali bersih seperti
                                    baru.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Customer Testimonials */}
            <section className="py-20 bg-slate-50">
                <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
                    <div className="text-center mb-14">
                        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
                            Apa Kata Pelanggan Kami?
                        </h2>
                        <p className="text-xs sm:text-sm text-slate-500">
                            Ulasan nyata dari pelanggan setia yang mempercayakan
                            cucian mereka kepada kami.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="border-slate-200 p-6 space-y-3 shadow-2xs hover:shadow-md transition-shadow">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                                “Paling suka fitur lacak resinya. Jadi nggak
                                perlu nebak-nebak baju udah selesai atau belum,
                                tinggal cek dari HP. Wangi Lavender-nya juara!”
                            </p>
                            <div className="pt-2 border-t text-xs font-bold text-slate-900">
                                — Maya Anggraini (Ibu Rumah Tangga)
                            </div>
                        </Card>

                        <Card className="border-slate-200 p-6 space-y-3 shadow-2xs hover:shadow-md transition-shadow">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                                “Layanan kilat 6&nbsp;jam sangat membantu waktu
                                ada tugas kantor mendadak. Kemeja putih
                                disetrika uap rapi banget, lipatannya presisi.”
                            </p>
                            <div className="pt-2 border-t text-xs font-bold text-slate-900">
                                — Hendra Wijaya (Karyawan Swasta)
                            </div>
                        </Card>

                        <Card className="border-slate-200 p-6 space-y-3 shadow-2xs hover:shadow-md transition-shadow">
                            <div className="flex text-amber-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className="w-4 h-4 fill-amber-400"
                                    />
                                ))}
                            </div>
                            <p className="text-xs text-slate-700 leading-relaxed italic">
                                “Cuci bed cover king size dan sepatu sneaker
                                bersih tuntas tanpa bau apek. Kasirnya ramah dan
                                nota digital langsung dikirim ke WhatsApp.”
                            </p>
                            <div className="pt-2 border-t text-xs font-bold text-slate-900">
                                — Dini Pratiwi (Mahasiswi)
                            </div>
                        </Card>
                    </div>
                </div>
            </section>

            {/* CTA Box */}
            <section className="py-16 bg-primary text-white">
                <div className="container mx-auto px-4 sm:px-6 max-w-4xl text-center space-y-6">
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                        Pakaian Menumpuk? Serahkan Pada Kami!
                    </h2>
                    <p className="text-sm sm:text-base text-primary-foreground/90 max-w-xl mx-auto leading-relaxed">
                        Kunjungi outlet kami hari ini atau hubungi kasir untuk
                        info antar-jemput cucian Anda.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4 pt-2">
                        <Link to="/layanan">
                            <Button
                                size="lg"
                                className="bg-white text-primary hover:bg-slate-100 font-bold shadow-md"
                            >
                                Cek Paket & Harga
                            </Button>
                        </Link>
                        <Link to="/kontak">
                            <Button
                                size="lg"
                                variant="outline"
                                className="border-white text-black hover:bg-white/10 hover:text-white font-bold"
                            >
                                Kontak & Lokasi Outlet
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
}
