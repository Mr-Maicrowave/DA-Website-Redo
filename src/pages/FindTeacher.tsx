import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { TeacherCard } from '@/components/teachers/TeacherCard';
import { TeacherFilters } from '@/components/teachers/TeacherFilters';
import { teacherData, type Teacher } from '@/data/teachers';
import { Search, HelpCircle } from 'lucide-react';
import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import TeacherComparisonTable from "@/components/TeacherComparisonTable";
import SEO from '@/components/SEO';

const FindTeacher = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedYearLevels, setSelectedYearLevels] = useState<string[]>([]);

  // Extract unique subjects and year levels from teacher data
  const subjects = useMemo(() => {
    const subjectSet = new Set<string>();
    teacherData.forEach(teacher => {
      // Extract main subject categories
      if (teacher.subject.includes('Mathematics')) subjectSet.add('Mathematics');
      if (teacher.subject.includes('English')) subjectSet.add('English');
      if (teacher.subject.includes('Chemistry')) subjectSet.add('Chemistry');
      if (teacher.subject.includes('Literacy')) subjectSet.add('Literacy');
      if (teacher.subject.includes('Numeracy')) subjectSet.add('Numeracy');
    });
    return Array.from(subjectSet).sort();
  }, []);

  const yearLevels = useMemo(() => {
    const yearSet = new Set<string>();
    teacherData.forEach(teacher => {
      teacher.yearLevels?.forEach(year => yearSet.add(year));
    });
    return Array.from(yearSet).sort((a, b) => {
      // Custom sort to handle Kindergarten and Year X
      if (a === 'Kindergarten') return -1;
      if (b === 'Kindergarten') return 1;
      const aNum = parseInt(a.replace('Year ', ''));
      const bNum = parseInt(b.replace('Year ', ''));
      return aNum - bNum;
    });
  }, []);

  // Filter teachers based on selected criteria
  const filteredTeachers = useMemo(() => {
    return teacherData.filter(teacher => {
      // Subject filter
      if (selectedSubjects.length > 0) {
        const hasSubject = selectedSubjects.some(subject =>
          teacher.subject.toLowerCase().includes(subject.toLowerCase())
        );
        if (!hasSubject) return false;
      }

      // Year level filter
      if (selectedYearLevels.length > 0) {
        const hasYearLevel = selectedYearLevels.some(year =>
          teacher.yearLevels?.includes(year)
        );
        if (!hasYearLevel) return false;
      }

      return true;
    });
  }, [selectedSubjects, selectedYearLevels]);

  const handleSubjectToggle = (subject: string) => {
    setSelectedSubjects(prev =>
      prev.includes(subject)
        ? prev.filter(s => s !== subject)
        : [...prev, subject]
    );
  };

  const handleYearLevelToggle = (yearLevel: string) => {
    setSelectedYearLevels(prev =>
      prev.includes(yearLevel)
        ? prev.filter(y => y !== yearLevel)
        : [...prev, yearLevel]
    );
  };

  const handleClearAll = () => {
    setSelectedSubjects([]);
    setSelectedYearLevels([]);
  };

  const handleTeacherSelect = (teacher: Teacher) => {
    // Navigate to booking flow
    console.log('Selected teacher:', teacher);
    // TODO: Implement booking flow navigation
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO
        title="Find a Tutor"
        description="Browse through our exceptional teachers and find the perfect match for your child's learning style and academic goals at DA Tuition."
        canonicalUrl="/find-teacher"
      />
      <NavigationNew />
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_screen.jpg" alt="DA Tuition Expert Teachers" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Vibrant warm pastel glow */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-orange-500/30 to-rose-400/30 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/60 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-12 sm:py-16 lg:py-24 px-6">
            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg">
              Find Your <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 via-rose-300 to-pink-300">Perfect Match</span>
            </h1>
            <p className="text-xl text-white/95 mb-10 max-w-2xl mx-auto drop-shadow-md font-medium">
              Browse through our exceptional teachers and find the perfect match for your child's learning style and academic goals.
            </p>

            {/* Two Path Options */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                variant="outline" 
                className="group bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => document.getElementById('filters')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search className="w-4 h-4 mr-2" />
                Browse Teachers Below
              </Button>
              <span className="text-white/60 font-medium">or</span>
              <Button 
                variant="outline" 
                className="group bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => window.location.href = '/#contact'}
              >
                <HelpCircle className="w-4 h-4 mr-2" />
                Request a Teacher Match
              </Button>
            </div>
          </div>
        </section>
      </div>

      <div className="pb-12" id="filters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <TeacherFilters
            subjects={subjects}
            yearLevels={yearLevels}
            selectedSubjects={selectedSubjects}
            selectedYearLevels={selectedYearLevels}
            onSubjectToggle={handleSubjectToggle}
            onYearLevelToggle={handleYearLevelToggle}
            onClearAll={handleClearAll}
          />

          {/* Results Count */}
          <div className="mb-6 text-brand-midnight/80">
            Showing {filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''}
            {(selectedSubjects.length > 0 || selectedYearLevels.length > 0) && ' (filtered)'}
          </div>

          {/* Teacher Cards Grid */}
          {filteredTeachers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTeachers.map((teacher, index) => (
                <TeacherCard
                  key={teacher.id}
                  teacher={teacher}
                  variant="discovery"
                  onSelect={handleTeacherSelect}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto mb-4" />
                <p className="text-lg">No teachers found matching your criteria.</p>
              </div>
              <Button variant="outline" onClick={handleClearAll}>
                Clear Filters
              </Button>
            </div>
          )}

          {/* No Match CTA */}
          <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 text-center border border-brand-blue/10">
            <h3 className="text-2xl font-bold mb-4">Don't See Your Perfect Match?</h3>
            <p className="text-brand-midnight/80 mb-6 max-w-2xl mx-auto">
              Our academic advisors can help identify the ideal teacher based on your child's
              specific learning style, goals, and personality.
            </p>
            <Button 
              className="btn-primary"
              onClick={() => window.location.href = '/#contact'}
            >
              <HelpCircle className="w-4 h-4 mr-2" />
              Request a Custom Teacher Match
            </Button>
          </div>
        </div>
      </div>
      {/* Teacher Comparison Table (Hidden per request) */}
      {/* <TeacherComparisonTable /> */}

      <FooterNew />
    </div >
  );
};

export default FindTeacher;
