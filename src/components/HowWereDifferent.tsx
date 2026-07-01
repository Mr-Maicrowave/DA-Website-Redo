import { Shield, Heart, Users, Star } from 'lucide-react';
import { FadeInUp } from './animations/FadeInUp';
import { StaggerContainer, StaggerItem } from './animations/StaggerChildren';
const HowWereDifferent = () => {
  const differences = [
    {
      icon: Shield,
      title: "No Entrance Exams",
      description: "If you want to grow and learn, you're welcome here. We believe every child has potential.",
      iconColor: "text-brand-midnight"
    },
    {
      icon: Heart,
      title: "Emotional Support First",
      description: "We focus on building confidence and resilience alongside academic skills. Your child's wellbeing matters.",
      iconColor: "text-red-500"
    },
    {
      icon: Users,
      title: "Personal Connection",
      description: "Small classes, individual attention. We meet each student exactly where they are in their learning journey.",
      iconColor: "text-brand-midnight"
    },
    {
      icon: Star,
      title: "Beyond Academic Excellence",
      description: "We're not just about grades. We develop critical thinking, creativity, and life skills for lasting success.",
      iconColor: "text-brand-midnight"
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background is handled by parent gradient in Index.tsx, but we can enforce height/padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <FadeInUp className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-brand-midnight">
            How We're <span className="text-brand-highlight">Different</span>
          </h2>
          <p className="text-xl text-brand-midnight/80 max-w-2xl mx-auto leading-relaxed">
            At DA Tuition, we don't just teach subjects - we nurture the whole child.
            Here's what makes our approach uniquely effective.
          </p>
        </FadeInUp>

        {/* Cards Grid */}
        <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {differences.map((diff, index) => (
            <StaggerItem key={index}>
              <div
                className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 h-full flex flex-col justify-between"
              >
                <div>
                  <div className="mb-6">
                    <diff.icon size={32} className={`${diff.iconColor} stroke-[1.5]`} />
                  </div>

                  <h3 className="text-xl font-bold mb-4 text-brand-midnight leading-tight">
                    {diff.title}
                  </h3>

                  <p className="text-brand-midnight/70 leading-relaxed text-sm">
                    {diff.description}
                  </p>
                </div>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>

        {/* Visual Proof / Authentic Environment */}
        <StaggerContainer className="mt-16 grid md:grid-cols-2 gap-8">
          <StaggerItem className="rounded-[2rem] overflow-hidden shadow-2xl aspect-video md:aspect-[16/9] border border-brand-navy/5">
            <img src="/images/programs/highschool-classroom-wide-3.jpg" alt="Modern Learning Environment" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </StaggerItem>
          <StaggerItem className="rounded-[2rem] overflow-hidden shadow-2xl aspect-video md:aspect-[16/9] border border-brand-navy/5">
            <img src="/images/programs/primary-group-colorful-2.jpg" alt="Vibrant Learning Spaces" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </StaggerItem>
        </StaggerContainer>
      </div>
    </section>
  );
};

export default HowWereDifferent;