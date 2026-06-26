import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Phone, Mail, MapPin, Clock, MessageSquare } from 'lucide-react';
import { FadeInUp } from './animations/FadeInUp';
import { StaggerContainer, StaggerItem } from './animations/StaggerChildren';

const Contact = () => {
  return <section id="contact" className="py-12 md:py-24">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Section Header */}
      <FadeInUp className="text-center max-w-3xl mx-auto mb-10 md:mb-16">
        <h2 className="text-4xl font-bold mb-6 text-brand-midnight">
          Start Your Child's <span className="gradient-text">Success Journey</span>
        </h2>
        <p className="text-xl text-brand-midnight/80">
          Let us help you choose the perfect program and learning format for your child.
          Book your interview today to discover personalized solutions that match their unique needs.
        </p>
      </FadeInUp>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <FadeInUp className="bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-brand-midnight">Book Interview</h3>

          <form className="space-y-6">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="parent-name">Parent Name *</Label>
                <Input id="parent-name" placeholder="Your full name" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="student-name">Student Name *</Label>
                <Input id="student-name" placeholder="Student's name" className="mt-1" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input id="email" type="email" placeholder="your.email@example.com" className="mt-1" />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input id="phone" placeholder="(04) XXXX XXXX" className="mt-1" />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="grade">Current Grade</Label>
                <select id="grade" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light">
                  <option>Select grade level</option>
                  <option>Kindergarten</option>
                  <option>Year 1</option>
                  <option>Year 2</option>
                  <option>Year 3</option>
                  <option>Year 4</option>
                  <option>Year 5</option>
                  <option>Year 6</option>
                  <option>Year 7</option>
                  <option>Year 8</option>
                  <option>Year 9</option>
                  <option>Year 10</option>
                  <option>Year 11</option>
                  <option>Year 12</option>
                </select>
              </div>
              <div>
                <Label htmlFor="subjects">Subjects of Interest</Label>
                <Input id="subjects" placeholder="Mathematics, English, etc." className="mt-1" />
              </div>
            </div>

            <div>
              <Label htmlFor="goals">Learning Goals & Concerns</Label>
              <Textarea id="goals" placeholder="Tell us about your child's learning goals, current challenges, or any specific areas where they need support..." className="mt-1" rows={4} />
            </div>

            <div>
              <Label htmlFor="preferred-time">Preferred Contact Time</Label>
              <select id="preferred-time" className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-brand-blue-light">
                <option>Select preferred time</option>
                <option>Morning (9am - 12pm)</option>
                <option>Afternoon (12pm - 5pm)</option>
                <option>Evening (5pm - 8pm)</option>
                <option>Weekends</option>
              </select>
            </div>

            <Button type="submit" className="w-full btn-primary py-3 text-lg">
              Book Interview
            </Button>

            <p className="text-sm text-brand-midnight/70 text-center">
              No obligation • Personalized assessment • Customized recommendations
            </p>
          </form>
        </FadeInUp>

        {/* Contact Information */}
        <StaggerContainer className="space-y-8">
          {/* Contact Details */}
          <StaggerItem className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-brand-midnight">Get In Touch</h3>

            <div className="space-y-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-blue-light/10 rounded-xl flex items-center justify-center mr-4">
                  <Phone className="text-brand-blue-dark" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-midnight">Phone</h4>
                  <p className="text-brand-midnight/80">0401 940 207</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-blue-light/10 rounded-xl flex items-center justify-center mr-4">
                  <Mail className="text-brand-blue-dark" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-midnight">Email</h4>
                  <p className="text-brand-midnight/80">info@datuition.com.au</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-blue-light/10 rounded-xl flex items-center justify-center mr-4">
                  <MapPin className="text-brand-blue-dark" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-midnight">Location</h4>
                  <p className="text-brand-midnight/80">Level 1/229 Canley Vale Rd<br />Canley Heights NSW 2166</p>
                </div>
              </div>

              <div className="flex items-center">
                <div className="w-12 h-12 bg-brand-highlight/10 rounded-xl flex items-center justify-center mr-4">
                  <Clock className="text-brand-midnight" size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-midnight">Hours</h4>
                  <p className="text-brand-midnight/80">Tue-Fri: 5:00pm - 9:00pm<br />Sat: 9:00am - 6:00pm<br />Sun: 10:00am - 7:00pm</p>
                </div>
              </div>
            </div>
          </StaggerItem>

          {/* FAQ Preview */}
          <StaggerItem className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-brand-midnight">Common Questions</h3>

            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-brand-blue-dark mb-2">Do you offer online tutoring?</h4>
                <p className="text-brand-midnight/80 text-sm">Our classes are in-person only. For students who need additional help between sessions, we can arrange online support.</p>
              </div>

              <div>
                <h4 className="font-semibold text-brand-blue-dark mb-2">What if my child doesn't improve?</h4>
                <p className="text-brand-midnight/80 text-sm">If your child attends regularly but doesn't make progress, we provide additional support at no cost.</p>
              </div>

              <div>
                <h4 className="font-semibold text-brand-blue-dark mb-2">How quickly will I see results?</h4>
                <p className="text-brand-midnight/80 text-sm">Most students see confidence improvements within 2-3 weeks, with academic improvements typically visible within 6-8 weeks.</p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6 btn-secondary" asChild>
              <a href="/faq">View All FAQs</a>
            </Button>
          </StaggerItem>

          {/* Quick Contact */}
          <StaggerItem className="bg-gradient-to-r from-brand-midnight to-brand-highlight text-white rounded-2xl p-8">
            <div className="flex items-center mb-4">
              <MessageSquare size={32} className="mr-3" />
              <h3 className="text-xl font-bold">Quick Question?</h3>
            </div>
            <p className="mb-6 text-blue-100">
              Text us your question and we'll get back to you within the hour during business hours.
            </p>
            <Button className="w-full bg-white text-brand-midnight hover:bg-gray-100">
              Send Quick Message
            </Button>
          </StaggerItem>
        </StaggerContainer>
      </div>
    </div>
  </section>;
};
export default Contact;