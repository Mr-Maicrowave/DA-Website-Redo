
import { motion } from "framer-motion";
import { Users, BookOpen, MessageCircle, Sparkles, ArrowRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const FeaturesGrid = () => {
    return (
        <section className="relative py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-4xl md:text-5xl font-bold font-heading text-brand-midnight mb-6"
                >
                    Why Students <span className="text-brand-highlight">Thrive Here</span>
                </motion.h2>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="text-xl text-brand-midnight/70 leading-relaxed"
                >
                    We don't just teach content. We build the habits, mindset, and confidence
                    that turns "I can't" into <span className="font-semibold text-brand-midnight">"Top in State"</span>.
                </motion.p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]">
                {/* 1. Hero Feature: Small Classes (Spans 2 cols on tablet/desktop) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                    className="md:col-span-2 row-span-2 relative group overflow-hidden rounded-3xl bg-white border border-brand-pastel-sky shadow-lg hover:shadow-2xl hover:shadow-brand-highlight/10 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-pastel-sky to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="absolute -right-20 -top-20 w-80 h-80 bg-brand-highlight/10 rounded-full blur-3xl group-hover:bg-brand-highlight/20 transition-colors duration-500" />

                    <div className="p-8 md:p-10 h-full flex flex-col justify-between relative z-10">
                        <div>
                            <div className="w-14 h-14 rounded-2xl bg-brand-pastel-sky flex items-center justify-center mb-6 text-brand-highlight shadow-sm group-hover:scale-110 transition-transform duration-300">
                                <Users size={28} strokeWidth={2.5} />
                            </div>
                            <h3 className="text-3xl font-bold text-brand-midnight mb-4">Small Class Sizes</h3>
                            <p className="text-lg text-brand-midnight/70 leading-relaxed max-w-md">
                                In a crowded lecture hall, you're just a number. Here, you're a priority.
                                Our intimate classes ensure every question is answered and every mistake is caught
                                <em> before</em> it becomes a habit.
                            </p>
                        </div>

                        <div className="mt-8 flex items-center gap-4 text-sm font-semibold text-brand-highlight">
                            <span className="flex items-center gap-2">
                                <Sparkles size={16} /> Individual Attention
                            </span>
                            <span className="flex items-center gap-2">
                                <TrendingUp size={16} /> Faster Growth
                            </span>
                        </div>
                    </div>
                </motion.div>

                {/* 2. Vertical Feature: Custom Materials (Tall card) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 }}
                    className="md:col-span-1 row-span-2 relative group overflow-hidden rounded-3xl bg-brand-midnight text-white shadow-xl hover:shadow-2xl hover:shadow-brand-highlight/20 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                    {/* Abstract 'Book' pattern/image placeholder */}
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand-highlight via-brand-midnight to-brand-midnight group-hover:opacity-50 transition-opacity duration-500" />

                    <div className="p-8 h-full flex flex-col justify-end relative z-20">
                        <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center mb-6 border border-white/20 group-hover:bg-white/20 transition-colors duration-300">
                            <BookOpen size={28} className="text-white" />
                        </div>
                        <h3 className="text-2xl font-bold mb-3">The "Gangsta" Materials</h3>
                        <p className="text-white/80 leading-relaxed text-sm">
                            Forget generic textbooks. Our custom-curated notes are legendary—distilling complex syllabus dot points into
                            clear, actionable strategies that actually make sense.
                        </p>
                    </div>
                </motion.div>

                {/* 3. Support Feature */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                    className="md:col-span-1 relative group overflow-hidden rounded-3xl bg-white border border-brand-pastel-mint shadow-lg shadow-brand-pastel-mint/20 hover:shadow-2xl hover:shadow-brand-pastel-mint/30 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-pastel-mint/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="p-8 h-full relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-brand-pastel-mint flex items-center justify-center mb-4 text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                            <MessageCircle size={24} strokeWidth={2.5} />
                        </div>
                        <h3 className="text-xl font-bold text-brand-midnight mb-2">24/7 Mentorship</h3>
                        <p className="text-brand-midnight/60 text-sm">
                            Stuck on a question at 10pm? Send a photo. Our tutors are there to unstuck you, anytime.
                        </p>
                    </div>
                </motion.div>

                {/* 4. Results Feature (Wide on bottom right? Or just fill remaining) */}
                {/* Actually with col-span-2 row-span-2 (Hero) + col-span-1 row-span-2 (Materials) = Top 2/3 filled.
                    Wait:
                    Grid 3 cols.
                    Hero: col-span-2, row-span-2. (Takes [0,0] to [1,1]) -> 4 slots? No, Grid is complex.
                    Let's simplify layout:
                    [ Hero Hero Materials ]
                    [ Hero Hero Materials ]
                    [ Support Vibe Materials? ] -> No Materials is tall.

                    Revised Layout:
                    Row 1: [ Hero (2) ] [ Materials (1) ]
                    Row 2: [ Support (1) ] [ Vibe (1) ] [ Materials (spans down?) ]

                    Actually, let's do:
                    [ Hero 2x1 and Materials 1x2.
                    [ Hero (2) ] [ Materials (1 vertical) ]
                    [ Support (1) ] [ Results (1) ] [ Materials (cont) ]

                    Better:
                    [ Hero (2 cols, 2 rows) ] [ Materials (1 col, 1 row) ]
                                            [ Support (1 col, 1 row) ]
                    This fills a 3x2 grid perfectly.
                    Hero takes (0,0), (0,1), (1,0), (1,1).
                    Materials takes (2,0).
                    Support takes (2,1).
                */}

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ y: -5 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-gradient-to-r from-brand-highlight to-brand-midnight text-white shadow-xl hover:shadow-2xl hover:shadow-brand-highlight/30 transition-all duration-300"
                >
                    <div className="absolute inset-0 bg-noise opacity-10 mix-blend-overlay" />
                    <div className="absolute right-0 top-0 h-full w-1/2 bg-white/5 skew-x-12 translate-x-12 group-hover:translate-x-6 transition-transform duration-700" />

                    <div className="p-8 h-full flex items-center justify-between relative z-10">
                        <div>
                            <h3 className="text-xl font-bold mb-2 flex items-center gap-2">
                                <Sparkles size={20} className="text-yellow-400" />
                                Results That Speak
                            </h3>
                            <p className="text-white/80 text-sm max-w-sm">
                                90% of our students achieve their goal marks within 2 terms.
                            </p>
                        </div>
                        <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-brand-highlight transition-colors cursor-pointer group-hover:scale-110 duration-300">
                            <ArrowRight size={24} />
                        </div>
                    </div>
                </motion.div>
            </div>
            {/* Note: I realized my grid math might be off in the comments.
                Let's do a simple flexible grid.
                Card 1: Col-span-2.
                Card 2: Col-span-1 (Tall).
                Card 3: Col-span-1.
                Card 4: Col-span-2.
            */}
        </section>
    );
};

export default FeaturesGrid;
