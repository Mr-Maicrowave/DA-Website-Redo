import { useState } from "react";
import { motion } from "framer-motion";
import { Star, Award, TrendingUp, Quote, X } from "lucide-react";
import { successStories, SuccessStory } from "@/data/successStories";
import reviewsData from "@/data/reviews.json"; // Import JSON
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Type for Google Review
interface GoogleReview {
    id: string;
    author: string;
    rating: number;
    date: string;
    text: string;
    featured: boolean;
    subject?: string;
}

const SuccessStoriesMarquee = () => {
    const [selectedStory, setSelectedStory] = useState<SuccessStory | null>(null);
    const [selectedReview, setSelectedReview] = useState<GoogleReview | null>(null); // State for Google Review

    // Filter featured reviews or just take a subset
    const googleReviews = (reviewsData.reviews as GoogleReview[])
        .filter(r => r.featured)
        .slice(0, 15); // Take top 15 featured

    return (
        <section className="relative py-24 overflow-hidden bg-gradient-to-b from-brand-pastel-sky via-brand-pastel-lavender to-white">
            {/* Background Decor */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/60 rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-brand-pastel-rose/40 rounded-full blur-[100px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                >
                    <h2 className="text-4xl md:text-5xl font-bold font-heading text-brand-midnight mb-6">
                        From the Principal of <span className="text-brand-highlight">DA Tuition</span>
                    </h2>
                    <p className="text-xl text-brand-midnight/70 max-w-3xl mx-auto leading-relaxed">
                        We’re deeply grateful to the parents and students who shared their heartfelt reviews.
                        Your stories inspire us to help every child unlock their <span className="text-brand-midnight font-medium">limitless potential</span>.
                    </p>
                </motion.div>
            </div>

            {/* Marquee Container */}
            <div className="flex flex-col gap-12">
                {/* Row 1: Success Stories (Left to Right) */}
                <div className="relative flex overflow-x-hidden -my-4 py-4 mask-gradient-light">
                    <div className="animate-marquee flex gap-6 items-stretch whitespace-normal">
                        {[...successStories, ...successStories].map((story, i) => (
                            <ReviewCard key={`student-${i}`} story={story} onClick={() => setSelectedStory(story)} />
                        ))}
                    </div>
                </div>

                {/* Row 2: Google Reviews (Right to Left) */}
                <div className="relative flex overflow-x-hidden -my-4 py-4 mask-gradient-light">
                    <div className="animate-marquee-reverse flex gap-6 items-stretch whitespace-normal">
                        {[...googleReviews, ...googleReviews].map((review, i) => (
                            <GoogleReviewCard key={`google-${i}`} review={review} onClick={() => setSelectedReview(review)} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom Gradient Fade */}
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent pointer-events-none" />

            {/* Full Story Dialog */}
            <Dialog open={!!selectedStory} onOpenChange={(open) => !open && setSelectedStory(null)}>
                <DialogContent className="max-w-4xl w-[90vw] md:w-full h-[90vh] md:h-[80vh] bg-white border-0 shadow-2xl p-0 overflow-hidden rounded-3xl flex flex-col md:flex-row ring-0 outline-none">
                    {selectedStory && (
                        <>
                            {/* Left/Top Panel: Key Details */}
                            <div className="bg-brand-midnight text-white p-8 md:w-1/3 flex-shrink-0 flex flex-col justify-center relative overflow-hidden">
                                <div className="absolute top-0 left-0 w-full h-full bg-brand-highlight/20 mix-blend-overlay" />
                                <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-brand-highlight rounded-full blur-[50px] opacity-50" />

                                <div className="relative z-10 text-center md:text-left">
                                    <div className="mb-6">
                                        <h3 className="text-2xl font-bold font-heading mb-1">{selectedStory.name}</h3>
                                        <p className="text-brand-pastel-sky opacity-90 text-sm">{selectedStory.school}</p>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <div className="text-xs text-brand-pastel-sky mb-1">Achievement</div>
                                            <div className="font-bold text-lg text-white flex items-center gap-2 justify-center md:justify-start">
                                                {selectedStory.iconType === 'award' && <Award className="w-5 h-5 text-brand-spark" />}
                                                {selectedStory.iconType === 'trending' && <TrendingUp className="w-5 h-5 text-brand-highlight" />}
                                                {selectedStory.iconType === 'star' && <Star className="w-5 h-5 text-yellow-400" />}
                                                {selectedStory.achievement}
                                            </div>
                                        </div>

                                        <div className="bg-white/10 rounded-xl p-4 backdrop-blur-sm">
                                            <div className="text-xs text-brand-pastel-sky mb-1">Subject</div>
                                            <div className="font-bold text-lg text-white">{selectedStory.subject}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right/Bottom Panel: Full Story */}
                            <div className="p-8 md:w-2/3 bg-white relative flex flex-col h-full overflow-hidden">
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-20 bg-white/80 backdrop-blur-sm rounded-full"
                                    onClick={() => setSelectedStory(null)}
                                >
                                    <X size={24} />
                                </Button>

                                <div className="mb-4 flex-shrink-0">
                                    <div className="flex gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                        ))}
                                    </div>
                                    <h4 className="text-xl font-bold text-brand-midnight">Student Success Story</h4>
                                </div>

                                <div className="relative z-10 text-brand-midnight/80 leading-relaxed text-base overflow-y-auto pr-4 custom-scrollbar flex-grow space-y-6 pb-6">
                                    <blockquote className="relative border-l-4 border-brand-highlight/20 pl-4 py-1 italic text-brand-midnight/90">
                                        "{selectedStory.quote}"
                                    </blockquote>

                                    <div>
                                        <h5 className="font-bold text-brand-midnight mb-2 text-lg">Appreciation</h5>
                                        <div className="whitespace-pre-line text-sm md:text-base">
                                            {selectedStory.appreciation}
                                        </div>
                                    </div>

                                    {selectedStory.advice && (
                                        <div>
                                            <h5 className="font-bold text-brand-midnight mb-2 text-lg">Advice for Students</h5>
                                            <div className="whitespace-pre-line text-sm md:text-base">
                                                {selectedStory.advice}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>

            {/* Google Review Dialog */}
            <Dialog open={!!selectedReview} onOpenChange={(open) => !open && setSelectedReview(null)}>
                <DialogContent className="max-w-2xl bg-white border-0 shadow-2xl p-8 rounded-3xl outline-none ring-0">
                    {selectedReview && (
                        <div className="flex flex-col h-full max-h-[80vh]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h3 className="text-2xl font-bold text-brand-midnight font-heading mb-1">{selectedReview.author}</h3>
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        {/* Google Logo Placeholder or G icon */}
                                        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                                        </svg>
                                        <span>Google Review</span>
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-gray-400 hover:text-gray-600 rounded-full"
                                    onClick={() => setSelectedReview(null)}
                                >
                                    <X size={24} />
                                </Button>
                            </div>

                            <div className="flex gap-1 mb-6">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                                ))}
                            </div>

                            <div className="overflow-y-auto custom-scrollbar flex-grow pr-2">
                                <p className="text-brand-midnight/80 leading-relaxed text-lg whitespace-pre-line">
                                    "{selectedReview.text}"
                                </p>
                            </div>

                            <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center text-sm text-gray-500">
                                <span>{selectedReview.date}</span>
                                {selectedReview.subject && (
                                    <span className="px-3 py-1 bg-brand-pastel-sky/50 rounded-full text-brand-midnight font-medium text-xs">
                                        {selectedReview.subject}
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </section>
    );
};

const ReviewCard = ({ story, onClick }: { story: SuccessStory; onClick: () => void }) => (
    <div
        className="w-[85vw] max-w-[350px] md:w-[400px] md:max-w-none flex-shrink-0 relative group cursor-pointer"
        onClick={onClick}
    >
        <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-brand-highlight/30 transition-all duration-300">

            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-midnight font-heading">{story.name}</h3>
                    <p className="text-sm text-gray-500">{story.school || "HSC Student"}</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-brand-highlight/10 border border-brand-highlight/20 text-xs font-semibold text-brand-highlight">
                    {story.subject}
                </div>
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
            </div>

            {/* Quote */}
            <blockquote className="relative">
                <Quote className="absolute -top-2 -left-2 w-8 h-8 text-brand-highlight/10 rotate-180" />
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 relative z-10 pl-4">
                    "{story.quote}"
                </p>
            </blockquote>

            {/* Footer / Read More */}
            <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-brand-highlight font-medium flex items-center gap-1">
                    {story.iconType === 'award' && <Award className="w-3 h-3" />}
                    {story.iconType === 'trending' && <TrendingUp className="w-3 h-3" />}
                    {story.achievement}
                </span>
                <button className="text-xs font-semibold text-brand-midnight group-hover:text-brand-highlight transition-colors flex items-center gap-1">
                    Read full story
                    <span className="group-hover:translate-x-1 transition-transform">→</span>
                </button>
            </div>
        </div>
    </div>
);

const GoogleReviewCard = ({ review, onClick }: { review: GoogleReview; onClick: () => void }) => (
    <div
        className="w-[85vw] max-w-[350px] md:w-[400px] md:max-w-none flex-shrink-0 relative group cursor-pointer"
        onClick={onClick}
    >
        <div className="h-full p-6 rounded-2xl bg-white border border-gray-100 shadow-lg hover:shadow-xl hover:scale-[1.02] hover:border-blue-200 transition-all duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center font-bold text-brand-highlight text-lg border border-blue-100 uppercase">
                        {review.author.charAt(0)}
                    </div>
                    <div>
                        <h3 className="text-base font-bold text-brand-midnight font-heading leading-tight">{review.author}</h3>
                        <div className="flex items-center gap-1 text-[10px] text-gray-400">
                            <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                            </svg>
                            Google Review
                        </div>
                    </div>
                </div>
                {review.subject && (
                    <div className="px-2 py-0.5 rounded-md bg-gray-50 border border-gray-100 text-[10px] font-medium text-gray-500">
                        {review.subject}
                    </div>
                )}
            </div>

            {/* Stars */}
            <div className="flex gap-1 mb-3">
                {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
            </div>

            {/* Text */}
            <div className="text-gray-600 text-sm leading-relaxed line-clamp-4 mb-4">
                "{review.text}"
            </div>

            {/* Read More Mock */}
            <div className="mt-auto border-t border-gray-50 pt-3 flex items-center text-blue-500 text-xs font-semibold group-hover:underline">
                Read full review
            </div>
        </div>
    </div>
);

export default SuccessStoriesMarquee;
