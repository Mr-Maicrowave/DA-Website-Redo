import { useState, useRef } from 'react';
import { Play, Pause, Volume2, VolumeX, ArrowRight, ExternalLink, Users, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AwardRecognition = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Redesigned Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center mb-6">
            <div className="relative">
              <img 
                src="/Photos and Videos/2025_FAIR_WINNER_LBA.jpg"
                alt="2025 Fairfield City Local Business Awards Winner"
                className="w-64 h-64 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-lg"
              />
              <div className="absolute -inset-2 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 rounded-full blur-sm"></div>
            </div>
          </div>
          
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold text-brand-midnight mb-4 leading-tight">
              🏆 Award‑Winning <span className="gradient-text">Education Excellence</span>
            </h2>
            <p className="text-lg text-brand-midnight/80 mb-6">
              Winner of <span className="font-semibold text-brand-midnight">Outstanding Education Service</span>
              <br />Fairfield City Local Business Awards 2025
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
              <Button size="lg" className="btn-primary">
                Book Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <a 
                href="https://business.fairfieldcity.nsw.gov.au/Business-Awards/Fairfield-City-Local-Business-Awards"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-brand-blue-dark hover:text-brand-blue-light font-medium transition-colors"
              >
                View Award Details
                <ExternalLink className="ml-1 h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Unified Grid Layout for Perfect Alignment */}
        <div className="grid lg:grid-cols-2 lg:grid-rows-[auto_1fr] gap-12">
          
          {/* Video Player - Top Left */}
          <div className="relative">
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden shadow-2xl cursor-pointer" onClick={handlePlayPause}>
              <video
                ref={videoRef}
                className="w-full aspect-video object-cover"
                muted={isMuted}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
                onEnded={() => setIsPlaying(false)}
                preload="metadata"
                poster="/Photos and Videos/EP6_0216.jpg"
              >
                <source src="/Photos and Videos/08 Oustanding Education Service _DA tuition_02_FairField.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>

              {/* Video Overlay */}
              {!isPlaying && (
                <>
                  <div className="absolute top-4 left-4 bg-black/70 text-white text-sm px-3 py-1 rounded-full">
                    45 seconds
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                    <div className="bg-white hover:bg-gray-100 text-brand-midnight rounded-full w-20 h-20 flex items-center justify-center transform hover:scale-110 transition-all duration-300 shadow-xl">
                      <Play size={32} className="ml-1" />
                    </div>
                  </div>
                </>
              )}

              {/* Video Controls */}
              {isPlaying && (
                <div className="absolute bottom-4 left-4 flex items-center space-x-3">
                  <button
                    onClick={(e) => { e.stopPropagation(); handlePlayPause(); }}
                    className="bg-white/90 hover:bg-white text-brand-midnight rounded-full w-10 h-10 flex items-center justify-center transition-all"
                  >
                    <Pause size={18} />
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleMuteToggle(); }}
                    className="bg-white/90 hover:bg-white text-brand-midnight rounded-full w-10 h-10 flex items-center justify-center transition-all"
                  >
                    {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
                  </button>
                </div>
              )}
            </div>
            
            <p className="text-brand-midnight/80 mt-4 text-center">
              Award ceremony highlights - Outstanding Education Service
            </p>
          </div>

          {/* Impact Statistics - Top Right */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 h-full flex flex-col justify-between">
            <h3 className="text-xl font-bold text-brand-midnight mb-4 text-center">Our Impact</h3>
            
            <div className="space-y-4 flex-1 flex flex-col justify-center">
              <div className="text-center p-4 bg-blue-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full mb-2">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-blue-600 mb-1">10,000+</div>
                <div className="text-brand-midnight/80 font-medium text-sm">Students Helped</div>
                <div className="text-xs text-brand-midnight/70">Since 2005</div>
              </div>
              
              <div className="text-center p-4 bg-yellow-50 rounded-xl">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-yellow-500 rounded-full mb-2">
                  <Star className="h-5 w-5 text-white" />
                </div>
                <div className="text-2xl font-bold text-yellow-600 mb-1">5.0★</div>
                <div className="text-brand-midnight/80 font-medium text-sm">Google Rating</div>
                <div className="text-xs text-brand-midnight/70">From 500+ reviews</div>
              </div>
            </div>
          </div>

          {/* Why We Won - Bottom Left (Aligned) */}
          <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20 flex flex-col justify-between h-full">
            <div>
              <h3 className="text-2xl font-bold text-brand-midnight mb-6">Why We Won</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-brand-midnight/80">
                    <span className="font-semibold">Voted by families</span> we've helped since 2005
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-brand-midnight/80">
                    <span className="font-semibold">Focus on confidence first</span>, then academic results
                  </p>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-3 flex-shrink-0"></div>
                  <p className="text-brand-midnight/80">
                    <span className="font-semibold">20+ years</span> of proven educational excellence
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial - Bottom Right (Aligned) */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-8 border border-white/30 shadow-lg flex flex-col justify-center h-full">
            <blockquote className="text-xl text-brand-midnight italic mb-4">
              "My daughter went from dreading math to asking for extra problems. The confidence she gained changed everything."
            </blockquote>
            <cite className="text-brand-midnight/80 font-medium not-italic">
              — Michelle K, Fairfield Heights parent
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AwardRecognition;