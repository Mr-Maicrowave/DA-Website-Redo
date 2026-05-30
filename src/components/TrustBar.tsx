import { Award, Users, Trophy, Star, TrendingUp, Shield } from 'lucide-react';
import { siteStats } from '@/data/site-stats';

const TrustBar = () => {
  const trustPoints = [
    {
      icon: <Award className="w-5 h-5" />,
      label: "Award Winner",
      value: "Outstanding Education 2025"
    },
    {
      icon: <Star className="w-5 h-5" />,
      label: "Google Rating",
      value: `${siteStats.googleRating} from ${siteStats.reviewCount} Reviews`
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      label: "Success Rate",
      value: "85% Selective Entry"
    },
    {
      icon: <Users className="w-5 h-5" />,
      label: "Teacher Quality",
      value: "Band 6 Subject Matter Experts"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      label: "Experience",
      value: `${siteStats.yearsExperience} Years Trusted`
    }
  ];

  return (
    <div className="bg-gradient-to-r from-brand-blue to-brand-blue-dark text-white py-3">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-center">
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8">
            {trustPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className="text-yellow-400">{point.icon}</div>
                <div className="flex flex-col">
                  <span className="text-xs opacity-80">{point.label}</span>
                  <span className="text-sm font-semibold">{point.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustBar;