import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, GraduationCap, Star, Award } from 'lucide-react';
import { teacherData } from '@/data/teachers';
import { TeacherBadges } from '@/components/teachers/TeacherBadges';
import { FadeInUp } from './animations/FadeInUp';
import { StaggerContainer, StaggerItem } from './animations/StaggerChildren';

const TeachersPreview = () => {
  // Show only first 3 teachers for homepage
  const featuredTeachers = teacherData.slice(0, 3);

  return (
    <section id="teachers" className="py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <FadeInUp className="text-center max-w-3xl mx-auto mb-12 px-4">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 break-words">
            Meet Our <span className="gradient-text inline-block">Exceptional Teachers</span>
          </h2>
          <p className="text-xl text-brand-midnight/80">
            Passionate educators dedicated to your child's success
          </p>
        </FadeInUp>

        {/* Teachers Preview Grid */}
        <StaggerContainer className="grid md:grid-cols-3 gap-8 mb-12">
          {featuredTeachers.map((teacher, index) => (
            <StaggerItem key={teacher.id}>
              <div
                className="group relative bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
              >
                {/* Teacher Image */}
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={teacher.image}
                    alt={teacher.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Quick Info Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="text-xl font-bold">{teacher.name}</h3>
                    <p className="text-blue-200">{teacher.subject}</p>
                  </div>
                </div>

                {/* Teacher Details */}
                <div className="p-6">
                  {/* Badges */}
                  {teacher.badges && (
                    <div className="mb-4">
                      <TeacherBadges
                        badges={teacher.badges}
                        maxDisplay={2}
                        size="sm"
                        showTooltip={false}
                      />
                    </div>
                  )}

                  {/* Quick Stats */}
                  <div className="flex items-center justify-between text-sm text-brand-midnight/80 mb-4">
                    <div className="flex items-center gap-1">
                      <GraduationCap className="w-4 h-4" />
                      <span>{teacher.qualifications?.[0] || 'B.Ed'}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span>5.0 Rating</span>
                    </div>
                  </div>

                  {/* Short Bio */}
                  <p className="text-brand-midnight/80 text-sm line-clamp-3">
                    {teacher.philosophy ? teacher.philosophy.split('.')[0] + '.' : ''}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* View All Teachers CTA */}
        <FadeInUp className="text-center">
          <Link to="/teachers">
            <Button size="lg" className="btn-primary group">
              Meet All Our Teachers
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
          <p className="mt-4 text-brand-midnight/80">
            <span className="font-semibold">{teacherData.length}+ expert teachers</span> across all subjects
          </p>
        </FadeInUp>
      </div>
    </section>
  );
};

export default TeachersPreview;