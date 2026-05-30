import NavigationNew from '@/components/NavigationNew';
import FooterNew from '@/components/FooterNew';
import { Star, Award, Trophy } from 'lucide-react';

const RisingStarAward = () => {
  // Student results data - First table (left column from PDF)
  const resultsTable1 = [
    { name: "Loi Nguyen", grade: "12 4U Term 1", school: "Freeman College", percentage: "100%" },
    { name: "Paul Vu", grade: "12 4U Term 2", school: "Patrician Brothers", percentage: "100%" },
    { name: "Kaiser Vo", grade: "12 STD Term 1", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "TJ Ho", grade: "12 STD Term 1", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Chanel Hak", grade: "8 M Term 3", school: "Meriden School", percentage: "100%" },
    { name: "Savina S.", grade: "8 M Term 4", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Katelyn Dinh", grade: "8 M Term 4", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Giang Phan", grade: "8 M Term 4", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Joie Lim", grade: "12 STD Term 2", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Marcus Nguyen", grade: "12 3U Term 2", school: "St Johns Park High School", percentage: "100%" },
    { name: "Marcus Nguyen", grade: "12 2U Term 2", school: "St Johns Park High School", percentage: "100%" },
    { name: "Orlando Jong", grade: "12 3U Term 2", school: "St Johns Park High School", percentage: "100%" },
    { name: "Joie Lim", grade: "12 STD Term 3", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Savina S.", grade: "8 M Term 3", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Outtara Nhem", grade: "12 2U Term 2", school: "St Johns Park High School", percentage: "98%" },
    { name: "Michelle Nguyen", grade: "11 2U Term 3", school: "Sefton High School", percentage: "98%" },
    { name: "Andrew Le", grade: "12 2U Term 4", school: "Patrician Brothers", percentage: "95%" },
  ];

  // Student results data - Second table (right column from PDF)
  const resultsTable2 = [
    { name: "Outtara Nhem", grade: "12 2U Term 1", school: "St Johns Park High School", percentage: "100%" },
    { name: "Outtara Nhem", grade: "12 3U Term 1", school: "St Johns Park High School", percentage: "100%" },
    { name: "Marcus Nguyen", grade: "12 3U Term 1", school: "St Johns Park High School", percentage: "100%" },
    { name: "Orlando Jong", grade: "12 3U Term 1", school: "St Johns Park High School", percentage: "100%" },
    { name: "Joie Lim", grade: "12 STD Term 1", school: "Bonnyrigg High School", percentage: "100%" },
    { name: "Krystal Vo", grade: "12 3U Term 4", school: "Bossley Park High School", percentage: "100%" },
    { name: "Areeb Sharier", grade: "9 M Term 1", school: "North Sydney Boys", percentage: "98%" },
    { name: "Vivien Lam", grade: "12 2U Term 1", school: "St Johns Park High School", percentage: "98%" },
    { name: "Sasha Fulgencio", grade: "12 STD Term 2", school: "Prairiewood High School", percentage: "97%" },
    { name: "Aiden Phanith", grade: "12 2U Term 1", school: "St Johns Park High School", percentage: "98%" },
    { name: "Areeb Sharier", grade: "9 M Term 3", school: "North Sydney Boys", percentage: "98%" },
    { name: "Selina Ho", grade: "10 M Term 2", school: "Bonnyrigg High School", percentage: "98%" },
    { name: "Dominic Pham", grade: "12 3U Term 1", school: "Freeman College", percentage: "97%" },
    { name: "Alice Nguyen", grade: "12 2U Term 2", school: "All Saint College", percentage: "97%" },
    { name: "Selina Ho", grade: "10 M Term 1", school: "Bonnyrigg High School", percentage: "96%" },
    { name: "Dominic Pham", grade: "12 3U Term 2", school: "Freeman College", percentage: "97%" },
    { name: "Areeb Sharier", grade: "9 M Term 2", school: "North Sydney Boys", percentage: "96%" },
    { name: "Ngoc Pham", grade: "11 2U Term 2", school: "St Johns Park High School", percentage: "96%" },
    { name: "Thanh Huy Tran", grade: "12 2U Term 2", school: "Bonnyrigg High School", percentage: "95%" },
    { name: "Antonio Tran", grade: "11 STD Term 2", school: "Prairiewood High School", percentage: "95%" },
    { name: "Ethan Tran", grade: "11 3U Term 3", school: "Bonnyrigg High School", percentage: "98%" },
    { name: "Luke Tran", grade: "11 3U Term 3", school: "Bonnyrigg High School", percentage: "98%" },
    { name: "Danny Trinh", grade: "11 3U Term 3", school: "Fairvale High School", percentage: "98%" },
    { name: "Ryan Ly", grade: "12 2U Term 4", school: "Patrician Brothers", percentage: "95%" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <NavigationNew />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 mt-[120px]">
        {/* Hero Section */}
        <section className="relative rounded-[2.5rem] overflow-hidden shadow-2xl mx-4 sm:mx-0 mt-6 mb-16">
          <div className="absolute inset-0">
            <img src="/images/v3/teacher_whiteboard.jpg" alt="Excellence in Teaching" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-brand-navy/80 mix-blend-multiply"></div>
            {/* Friendly vibrant pastel glow for celebration */}
            <div className="absolute inset-0 bg-gradient-to-tr from-brand-navy/90 via-yellow-500/30 to-amber-400/40 mix-blend-overlay"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-brand-navy/90 via-brand-navy/50 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center py-24 px-6 lg:py-32">
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="w-24 h-24 bg-white/10 backdrop-blur-md border border-white/20 rounded-full flex items-center justify-center shadow-xl">
                  <Trophy className="w-12 h-12 text-yellow-300 drop-shadow-sm" />
                </div>
                <div className="absolute -bottom-2 -right-2">
                  <Star className="w-8 h-8 text-yellow-400 fill-yellow-400 drop-shadow-sm" />
                </div>
              </div>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight drop-shadow-lg uppercase">
              Rising <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-amber-300">Star</span> of 2024
            </h1>

            <p className="text-xl md:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-md">
              Celebrating Excellence in Teaching at DA Tuition
            </p>
          </div>
        </section>
      </div>

      {/* Introduction Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pastel-card pastel-blue">
            <h2 className="text-2xl font-bold text-brand-midnight mb-6">An Extraordinary Year</h2>
            <div className="space-y-4 text-brand-midnight/80 leading-relaxed">
              <p>
                This year has been nothing short of extraordinary. Our HSC students have achieved exceptional results in their
                school assessments, and they eagerly await their final HSC outcomes. These achievements would not have been
                possible without the passion and tireless efforts of our exceptional team of tutors.
              </p>
              <p>
                Every tutor at DA Tuition has gone above and beyond, pouring their energy, expertise, and care into every
                student's success. Words cannot fully capture the depth of gratitude I feel for this remarkable team. You have
                stayed up late perfecting lessons, meticulously reviewed each student's school assignments, arrived early to
                provide one-on-one support, and offered encouraging words when students needed them most. Your dedication has
                not only propelled our students to academic success but also instilled in them confidence and resilience that
                will carry them far for life. Thank you for making a profound difference every single day.
              </p>
              <p>
                With such an outstanding team, choosing the Rising Star of 2024 was incredibly challenging, as each of you
                has made a significant and lasting impact. This award is typically given to the tutor who demonstrates
                exceptional growth and goes the extra mile to enhance their skills and help their students achieve
                extraordinary results. This year, one tutor stood out with an unparalleled ability to inspire confidence
                and a love of learning, and consistently deliver top marks and rankings for their students.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Winner Announcement */}
      <section className="py-12 bg-gradient-to-b from-white to-blue-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center p-3 bg-yellow-100 rounded-full mb-6">
              <Award className="w-12 h-12 text-yellow-600" />
            </div>
            <h2 className="text-4xl font-bold text-brand-midnight mb-8">
              Congratulations to <span className="gradient-text">Mr. Bunsea</span>!
            </h2>

            <div className="max-w-3xl mx-auto">
              <div className="pastel-card pastel-yellow">
                <div className="flex flex-col items-center">
                  <div className="w-48 h-48 bg-gray-200 rounded-full mb-6 flex items-center justify-center">
                    <span className="text-brand-midnight/70 text-sm">Mr. Bunsea</span>
                  </div>
                  <div className="text-center space-y-4">
                    <p className="text-lg font-semibold text-brand-midnight">
                      Winner of the Rising Star of the Year 2024
                    </p>
                    <p className="text-brand-midnight/80 leading-relaxed">
                      A huge congratulations to Mr Bunsea, the well-deserved winner of the Rising Star of the Year 2024!
                      Your love for teaching, commitment to excellence, and ability to connect with and inspire your
                      students have been truly phenomenal. You've not only helped your students realise their goals but
                      have also reminded us all of the difference a passionate tutor can make.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Results Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-brand-midnight mb-4">Outstanding Student Results</h2>
            <p className="text-lg text-brand-midnight/80">Let's take a moment to recognise the outstanding recent assessment results of Mr. Bunsea's students.</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* First Results Table */}
            <div className="overflow-hidden rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-4">
                <h3 className="text-white font-semibold text-lg">Mathematics Excellence</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">School</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultsTable1.map((student, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-brand-midnight">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-brand-midnight/70">{student.grade}</td>
                        <td className="px-4 py-3 text-sm text-brand-midnight/70">{student.school}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.percentage === '100%'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {student.percentage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Second Results Table */}
            <div className="overflow-hidden rounded-xl shadow-lg">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-4">
                <h3 className="text-white font-semibold text-lg">Academic Achievement</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">Grade</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">School</th>
                      <th className="px-4 py-3 text-center text-xs font-medium text-brand-midnight/70 uppercase tracking-wider">Score</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {resultsTable2.map((student, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-brand-midnight">{student.name}</td>
                        <td className="px-4 py-3 text-sm text-brand-midnight/70">{student.grade}</td>
                        <td className="px-4 py-3 text-sm text-brand-midnight/70">{student.school}</td>
                        <td className="px-4 py-3 text-sm text-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${student.percentage === '100%'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                            }`}>
                            {student.percentage}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank You Section */}
      <section className="py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="pastel-card pastel-green text-center">
            <div className="flex justify-center mb-6">
              <div className="flex space-x-2">
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-brand-midnight mb-4">Thank You to All Our Tutors</h2>
            <p className="text-brand-midnight/80 leading-relaxed mb-4">
              To every tutor at DA Tuition—thank you. Your hard work, resilience, and care form the foundation of DA.
              You have given so much of yourselves to help our students thrive, and it is because of you that DA
              Tuition continues to be a place of growth, inspiration, and success.
            </p>
            <p className="text-brand-midnight/80 leading-relaxed">
              Let us celebrate this achievement and the collective impact we have made together this year.
              Here's to another fantastic year ahead!
            </p>
            <div className="mt-8">
              <p className="text-3xl font-bold gradient-text">Teaching is a Work of the Heart</p>
            </div>
          </div>
        </div>
      </section>

      <FooterNew />
    </div>
  );
};

export default RisingStarAward;