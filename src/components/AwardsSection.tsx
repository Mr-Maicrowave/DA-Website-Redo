import { motion } from "framer-motion";
import { Star, Play, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";

const AwardsSection = () => {
    return (
        <section className="relative pt-32 pb-20 bg-gradient-to-b from-amber-50 via-white to-white overflow-hidden">
            {/* Seamless Gradient Transition from Hero */}
            <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none" />

            {/* Decorative Blobs */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-pastel-amber/30 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-brand-pastel-sky/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/3" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col items-center text-center mb-12">
                    {/* Award Badge */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
                        whileInView={{ scale: 1, opacity: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, type: "spring" }}
                        className="mb-8 relative"
                    >
                        <div className="absolute inset-0 bg-yellow-400 rounded-full blur-[60px] opacity-40 animate-pulse" />
                        <img
                            src="/Photos and Videos/2025_FAIR_WINNER_LBA.jpg"
                            alt="Winner Fairfield City Local Business Awards 2025"
                            className="relative w-48 h-auto md:w-56 drop-shadow-2xl hover:scale-105 transition-transform duration-300"
                        />
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-4xl md:text-5xl font-bold font-heading text-brand-midnight mb-4"
                    >
                        Award-Winning <span className="text-yellow-500">Education Excellence</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                        className="text-lg md:text-xl text-brand-midnight/70 font-medium"
                    >
                        Winner of Outstanding Education Service • Fairfield City Local Business Awards 2025
                    </motion.p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center">
                    {/* Video / Image Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="relative group rounded-3xl overflow-hidden shadow-2xl rotate-1 hover:rotate-0 transition-transform duration-500"
                    >
                        <div className="aspect-video relative bg-brand-midnight/10">
                            <img
                                src="/images/v3/hero_team.jpg" // DA Tuition team photo
                                alt="Award Ceremony"
                                className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500"
                            />
                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-brand-midnight/30 group-hover:bg-brand-midnight/20 transition-colors" />

                            {/* Play Button Mockup */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300 cursor-pointer">
                                    <Play className="w-6 h-6 md:w-8 md:h-8 text-brand-midnight fill-brand-midnight ml-1" />
                                </div>
                            </div>

                            <div className="absolute bottom-4 left-4 right-4 text-white text-sm font-medium bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/10">
                                🏆 Award Ceremony Highlights
                            </div>
                        </div>
                    </motion.div>

                    {/* Impact Stats Card */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                        className="bg-white p-8 md:p-10 rounded-3xl shadow-xl border border-brand-pastel-amber/30 relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/3" />

                        <h3 className="text-2xl font-bold text-brand-midnight mb-8 flex items-center gap-2">
                            <Trophy className="w-6 h-6 text-yellow-500" />
                            Our Impact
                        </h3>

                        <div className="space-y-8 relative z-10">
                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-brand-pastel-sky/30 flex items-center justify-center text-brand-primary">
                                    <Users className="w-8 h-8 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-brand-midnight font-heading">10,000+</div>
                                    <div className="text-brand-midnight/60 font-medium">Students Helped Since 2005</div>
                                </div>
                            </div>

                            <div className="flex items-center gap-6">
                                <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">
                                    <Star className="w-8 h-8 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div>
                                    <div className="text-4xl font-bold text-brand-midnight font-heading">5.0</div>
                                    <div className="text-brand-midnight/60 font-medium flex items-center gap-1">
                                        Google Average Rating
                                        <span className="text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-500">500+ Reviews</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-8 border-t border-gray-100">
                            <p className="text-brand-midnight/70 mb-4 text-sm">
                                Join the tuition centre that delivers proven results with a personal touch.
                            </p>
                            <Button
                                className="w-full bg-brand-highlight hover:bg-brand-highlight/90 text-white font-bold h-12 rounded-xl text-lg shadow-lg shadow-brand-highlight/20"
                                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Book Interview
                            </Button>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default AwardsSection;
