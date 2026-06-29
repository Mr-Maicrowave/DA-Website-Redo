import React, { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Book, Star, ArrowRight, Award, User, MessageSquare, GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { teacherData, type Teacher } from '@/data/teachers';
import { TeacherBadges } from '@/components/teachers/TeacherBadges';
const TeachersEnhanced = () => {
  const navigate = useNavigate();
  const [flippedTeacher, setFlippedTeacher] = useState<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Handle card flip interaction
  const handleCardFlip = useCallback((teacherId: number) => {
    setFlippedTeacher(flippedTeacher === teacherId ? null : teacherId);
  }, [flippedTeacher]);

  // Handle keyboard navigation
  const handleKeyDown = useCallback((e: React.KeyboardEvent, teacherId: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleCardFlip(teacherId);
    } else if (e.key === 'Escape') {
      setFlippedTeacher(null);
    }
  }, [handleCardFlip]);
  return <section id="teachers" className="py-20 bg-gray-50">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h2 className="text-4xl font-bold mb-6">
          Meet Our <span className="gradient-text">Exceptional Teachers</span>
        </h2>
        <p className="text-xl text-brand-midnight/80">Our teachers aren't just qualified, they're passionate educators who genuinely care about each student's success. Get to know the dedicated professionals who will guide your child's learning journey.</p>
      </div>

      {/* Teachers Grid - Flip Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {teacherData.map((teacher, index) => {
          const isFlipped = flippedTeacher === teacher.id;

          return (
            <div
              key={teacher.id}
              className="flip-card-container"
              style={{
                animationDelay: `${index * 0.2}s`,
                height: isMobile ? '500px' : '600px'
              }}
            >
              <div
                className={cn(
                  "flip-card relative w-full h-full cursor-pointer",
                  "focus:outline-none focus:ring-2 focus:ring-brand-blue-dark focus:ring-offset-2",
                  isFlipped && "rotate-y-180"
                )}
                onClick={() => handleCardFlip(teacher.id)}
                onKeyDown={(e) => handleKeyDown(e, teacher.id)}
                tabIndex={0}
                role="button"
                aria-label={`Flip card to see more about ${teacher.name}`}
              >
                {/* Front of Card */}
                <div className="flip-card-front absolute inset-0 w-full h-full backface-hidden">
                  <div className="relative w-full h-full bg-white rounded-2xl overflow-hidden shadow-xl">
                    <img
                      src={teacher.image}
                      alt={teacher.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Front Overlay - Light gradient only at bottom for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />


                    {/* Front Content */}
                    <div className="absolute bottom-6 left-6 right-6 text-white">
                      <h3 className="text-2xl font-bold mb-2">{teacher.name}</h3>
                      <p className="text-blue-200 font-medium text-lg mb-3">{teacher.subject}</p>

                      {/* Teacher Badges */}
                      {teacher.badges && (
                        <div className="mb-3">
                          <TeacherBadges
                            badges={teacher.badges}
                            maxDisplay={3}
                            size="sm"
                            showTooltip={false}
                          />
                        </div>
                      )}

                      <div className="flex items-center text-blue-200 text-sm">
                        <ArrowRight className="w-4 h-4 mr-2" />
                        Tap to learn more
                      </div>
                    </div>
                  </div>
                </div>

                {/* Back of Card */}
                <div className="flip-card-back absolute inset-0 w-full h-full backface-hidden">
                  <div className="w-full h-full bg-white rounded-2xl shadow-xl p-6 overflow-y-auto">
                    {/* Header */}
                    <div className="border-b border-gray-200 pb-4 mb-4">
                      <h3 className="text-xl font-bold text-brand-midnight mb-1">{teacher.name}</h3>
                      <p className="text-brand-blue-dark font-medium">{teacher.subject}</p>
                    </div>

                    {/* Section 1: Credentials */}
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <GraduationCap className="w-5 h-5 text-brand-blue-dark mr-2" />
                        <h4 className="font-semibold text-brand-midnight">Qualifications & Specialties</h4>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {teacher.qualifications.map((qual, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">
                            {qual}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {teacher.specialties.map((specialty, i) => (
                          <span key={i} className="text-xs bg-brand-blue-light/10 text-brand-blue-dark px-2 py-1 rounded">
                            {specialty}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Section 2: Teaching Philosophy */}
                    <div className="mb-6">
                      <div className="flex items-center mb-3">
                        <User className="w-5 h-5 text-orange-400 mr-2" />
                        <h4 className="font-semibold text-brand-midnight">Teaching Philosophy</h4>
                      </div>
                      <p className="text-sm text-brand-midnight/80 italic mb-3">"{teacher.philosophy}"</p>
                      {teacher.teachingStyle && (
                        <p className="text-sm text-brand-midnight/80">{teacher.teachingStyle}</p>
                      )}
                    </div>

                    {/* Section 3: Achievements */}
                    {teacher.achievements && teacher.achievements.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center mb-3">
                          <Award className="w-5 h-5 text-brand-green mr-2" />
                          <h4 className="font-semibold text-brand-midnight">Key Achievements</h4>
                        </div>
                        <ul className="space-y-2">
                          {teacher.achievements.slice(0, 3).map((achievement, i) => (
                            <li key={i} className="text-sm text-brand-midnight/80 flex items-start">
                              <Star className="w-3 h-3 text-yellow-500 mr-2 mt-0.5 flex-shrink-0" />
                              {achievement}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Section 4: Achievement Badges */}
                    {teacher.badges && teacher.badges.length > 0 && (
                      <div className="mb-6">
                        <div className="flex items-center mb-3">
                          <Award className="w-5 h-5 text-brand-green mr-2" />
                          <h4 className="font-semibold text-brand-midnight">Recognition & Awards</h4>
                        </div>
                        <TeacherBadges
                          badges={teacher.badges}
                          maxDisplay={6}
                          size="md"
                          showTooltip={true}
                        />
                      </div>
                    )}

                    {/* Section 5: Student Testimonials */}
                    <div>
                      <div className="flex items-center mb-3">
                        <MessageSquare className="w-5 h-5 text-brand-blue-dark mr-2" />
                        <h4 className="font-semibold text-brand-midnight">Student Feedback</h4>
                      </div>
                      <div className="bg-blue-50 p-3 rounded-lg mb-3">
                        <p className="text-sm italic text-brand-midnight/80">"{teacher.testimonial}"</p>
                      </div>
                      {teacher.additionalTestimonials && teacher.additionalTestimonials.slice(0, 2).map((testimonial, i) => (
                        <div key={i} className="bg-gray-50 p-2 rounded mb-2">
                          <p className="text-xs italic text-brand-midnight/80">"{testimonial}"</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Call to Action */}
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-3xl mx-auto">
        <div className="flex items-center justify-center mb-4">
          <Book className="text-brand-blue-dark mr-2" size={32} />
          <h3 className="text-2xl font-bold">Ready to Meet Your Perfect Teacher?</h3>
        </div>
        <p className="text-brand-midnight/80 mb-6">
          Our teachers are carefully matched to each student's learning style and personality.
          Book an interview to find the perfect fit for your child.
        </p>
        <Button
          className="btn-primary group"
          onClick={() => navigate('/book-interview')}
        >
          Book Interview
          <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  </section>;
};
export default TeachersEnhanced;
