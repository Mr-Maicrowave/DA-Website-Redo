
import React from 'react';
import { Check, HelpCircle, X } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ComparisonCriteria {
    category: string;
    description: string;
}

const comparisonCriteria: ComparisonCriteria[] = [
    { category: "Teaching Style", description: "The primary method of instruction used by the teacher." },
    { category: "Focus Area", description: "The specific aspect of the subject they specialize in." },
    { category: "Experience Level", description: "Years of professional teaching experience." },
    { category: "Ideal For", description: "The type of student who benefits most from this teacher." },
    { category: "Class Size", description: "Average number of students in their classes." },
];

const teachers = [
    {
        name: "Dr. Sarah Chen",
        role: "Head of Mathematics",
        style: "Socratic & Analytical",
        focus: "HSC Extension 2",
        experience: "15+ Years",
        idealFor: "High achievers aiming for state ranks",
        classSize: "Small Group (4-6)",
        bestFeature: "Deep theoretical insights"
    },
    {
        name: "Mr. David Miller",
        role: "Senior English Tutor",
        style: "Discussion-based",
        focus: "Analytical Essay Writing",
        experience: "10 Years",
        idealFor: "Students needing structure in essays",
        classSize: "Standard (8-12)",
        bestFeature: "Detailed feedback loops"
    },
    {
        name: "Ms. Emily Wong",
        role: "Science Specialist",
        style: "Visual & Practical",
        focus: "Chemistry & Physics",
        experience: "8 Years",
        idealFor: "Visual learners who need diagrams",
        classSize: "Medium (6-10)",
        bestFeature: "Real-world application"
    }
];

const TeacherComparisonTable = () => {
    return (
        <section className="py-12 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold mb-3">Compare Our Expert Tutors</h2>
                    <p className="text-lg text-brand-midnight/80">
                        Find the perfect teaching style for your child's needs
                    </p>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-hidden rounded-xl border border-gray-200 shadow-sm">
                    <Table>
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="w-[200px] font-bold text-brand-midnight">Feature</TableHead>
                                {teachers.map((teacher, index) => (
                                    <TableHead key={index} className="text-center">
                                        <div className="font-bold text-brand-midnight text-lg">{teacher.name}</div>
                                        <div className="text-xs text-brand-blue font-medium">{teacher.role}</div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {comparisonCriteria.map((criteria, idx) => (
                                <TableRow key={idx} className="hover:bg-gray-50/50">
                                    <TableCell className="font-medium text-brand-midnight/80 bg-gray-50/30">
                                        <div className="flex items-center gap-2">
                                            {criteria.category}
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger>
                                                        <HelpCircle className="w-4 h-4 text-gray-400" />
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p className="max-w-xs text-xs">{criteria.description}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </TableCell>
                                    {teachers.map((teacher, tIdx) => (
                                        <TableCell key={tIdx} className="text-center text-brand-midnight/80">
                                            {/* Mapping logic based on category */}
                                            {criteria.category === "Teaching Style" && teacher.style}
                                            {criteria.category === "Focus Area" && teacher.focus}
                                            {criteria.category === "Experience Level" && teacher.experience}
                                            {criteria.category === "Ideal For" && teacher.idealFor}
                                            {criteria.category === "Class Size" && teacher.classSize}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                            {/* Highlight Row */}
                            <TableRow className="bg-blue-50/50">
                                <TableCell className="font-bold text-brand-blue">Best Feature</TableCell>
                                {teachers.map((teacher, index) => (
                                    <TableCell key={index} className="text-center font-semibold text-brand-blue-dark">
                                        {teacher.bestFeature}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>

                {/* Mobile Card View */}
                <div className="md:hidden space-y-6">
                    {teachers.map((teacher, index) => (
                        <Card key={index} className="border-gray-200">
                            <CardHeader className="bg-gray-50 pb-4">
                                <CardTitle className="text-xl">{teacher.name}</CardTitle>
                                <CardDescription className="text-brand-blue font-medium">{teacher.role}</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 grid gap-4">
                                {comparisonCriteria.map((criteria, cIdx) => (
                                    <div key={cIdx} className="grid grid-cols-2 gap-2 text-sm border-b border-gray-100 last:border-0 pb-2 last:pb-0">
                                        <div className="font-medium text-brand-midnight/70">{criteria.category}</div>
                                        <div className="text-right font-medium text-brand-midnight">
                                            {criteria.category === "Teaching Style" && teacher.style}
                                            {criteria.category === "Focus Area" && teacher.focus}
                                            {criteria.category === "Experience Level" && teacher.experience}
                                            {criteria.category === "Ideal For" && teacher.idealFor}
                                            {criteria.category === "Class Size" && teacher.classSize}
                                        </div>
                                    </div>
                                ))}
                                <div className="mt-2 pt-2 bg-blue-50 -mx-6 px-6 py-3 flex justify-between items-center">
                                    <span className="font-bold text-brand-blue text-sm">Best Feature</span>
                                    <span className="font-semibold text-brand-blue-dark text-sm">{teacher.bestFeature}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

            </div>
        </section>
    );
};

export default TeacherComparisonTable;
