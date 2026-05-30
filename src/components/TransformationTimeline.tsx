import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Brain, Rocket, Trophy, AlertTriangle, XCircle, CheckCircle, Flame } from 'lucide-react';
import { Button } from './ui/button';

interface TimelineStage {
    year: string;
    title: string;
    struggle: {
        title: string;
        desc: string;
        icon: any;
    };
    solution: {
        title: string;
        desc: string;
        icon: any;
    };
}

const timelineData: TimelineStage[] = [
    {
        year: "Years 7-9",
        title: "The Early Years",
        struggle: {
            title: "Missing the Basics",
            desc: "It is easy to miss small steps in class. Without help, these small gaps can grow into big problems later.",
            icon: AlertTriangle
        },
        solution: {
            title: "Building Confidence",
            desc: "We fix the basics in Maths and English early. We help your child build good study habits so they feel ready for high school.",
            icon: Brain
        }
    },
    {
        year: "Years 10-11",
        title: "The Hard Years",
        struggle: {
            title: "Working Too Hard",
            desc: "School work gets much harder. Students try to study for hours, but they don't get the results they want.",
            icon: Flame
        },
        solution: {
            title: "Staying Ahead",
            desc: "We teach topics before they learn them at school. This makes class time easier and removes the stress.",
            icon: Rocket
        }
    },
    {
        year: "Year 12",
        title: "The HSC Year",
        struggle: {
            title: "Exam Stress",
            desc: "The final exams are scary. Many students feel lost and worry about their ATAR because they don't have a plan.",
            icon: XCircle
        },
        solution: {
            title: "Exam Mastery",
            desc: "We practice with real past papers every week. Your child will walk into the final exam feeling calm and prepared.",
            icon: Trophy
        }
    }
];

const TransformationTimeline = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    return (
        <section ref={containerRef} className="relative py-24 bg-gradient-to-b from-white to-brand-pastel-sky text-brand-midnight overflow-hidden">

            {/* Background Ambience */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-pastel-amber/30 rounded-full blur-[120px] pointer-events-none opacity-60" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1 rounded-full bg-brand-highlight/10 border border-brand-highlight/20 text-brand-highlight text-sm font-semibold tracking-wider uppercase mb-6"
                    >
                        The Journey
                    </motion.div>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                        className="text-4xl md:text-5xl font-bold font-heading mb-6 text-brand-midnight"
                    >
                        Two Paths. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-highlight to-brand-spark">One Destination.</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-brand-midnight/70"
                    >
                        Most students leave their success to chance. We engineer it.
                    </motion.p>
                </div>

                {/* Timeline Container */}
                <div className="relative">

                    {/* Central Progress Line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-1 bg-brand-midnight/10 hidden md:block">
                        <motion.div
                            style={{ scaleY: scrollYProgress }}
                            className="absolute top-0 left-0 right-0 h-full bg-gradient-to-b from-brand-highlight to-brand-spark origin-top"
                        />
                    </div>

                    <div className="space-y-32">
                        {timelineData.map((stage, index) => (
                            <TimelineItem key={index} stage={stage} index={index} />
                        ))}
                    </div>

                </div>

                {/* CTA Footer */}
                <div className="text-center mt-32">
                    <Button size="lg" className="bg-brand-midnight hover:bg-brand-midnight/90 text-white text-lg px-8 py-6 rounded-full font-bold shadow-lg shadow-brand-highlight/20">
                        Choose The Evolved Path
                    </Button>
                </div>

            </div>
        </section>
    );
};

const TimelineItem = ({ stage, index }: { stage: TimelineStage; index: number }) => {
    return (
        <div className="relative grid md:grid-cols-2 gap-12 md:gap-24 items-center">

            {/* Central Year Marker (Mobile: Top, Desktop: Center) */}
            <div className="md:absolute left-1/2 -translate-x-1/2 md:-ml-[1px] flex justify-center order-first md:order-none mb-8 md:mb-0">
                <div className="bg-white border-4 border-brand-pastel-sky rounded-full w-20 h-20 flex items-center justify-center relative z-10 shadow-xl text-brand-midnight font-bold">
                    <span className="text-sm text-center leading-tight">{stage.year}</span>
                </div>
            </div>

            {/* Struggle Side (Always Left on Desktop) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 0.6 }}
                className="md:text-right md:pr-12"
            >
                <div className="bg-red-50 border border-red-100 rounded-3xl p-8 hover:bg-red-100 transition-colors group shadow-lg">
                    <div className="flex items-center gap-4 mb-4 md:flex-row-reverse">
                        <div className="p-3 rounded-full bg-red-500/10 text-red-500">
                            <stage.struggle.icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-midnight">{stage.struggle.title}</h3>
                    </div>
                    <p className="text-lg text-brand-midnight/80 leading-relaxed">
                        {stage.struggle.desc}
                    </p>
                </div>
            </motion.div>

            {/* Solution Side (Always Right on Desktop) */}
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ margin: "-20%" }}
                transition={{ duration: 0.6 }}
                className="md:pl-12"
            >
                <div className="bg-white border border-brand-highlight/20 rounded-3xl p-8 relative overflow-hidden group shadow-xl hover:shadow-2xl transition-all">
                    <div className="absolute inset-0 bg-brand-pastel-sky opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="flex items-center gap-4 mb-4 relative z-10">
                        <div className="p-3 rounded-full bg-brand-highlight/10 text-brand-highlight">
                            <stage.solution.icon size={24} />
                        </div>
                        <h3 className="text-2xl font-bold text-brand-midnight">{stage.solution.title}</h3>
                    </div>
                    <p className="text-lg text-brand-midnight/80 leading-relaxed relative z-10">
                        {stage.solution.desc}
                    </p>
                </div>
            </motion.div>

        </div>
    );
};

export default TransformationTimeline;
