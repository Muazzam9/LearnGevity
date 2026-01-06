import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const About = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[40vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-primary-orange font-bold tracking-[2px] text-xs sm:text-sm uppercase bg-primary-orange/10 px-4 py-2 rounded-full border border-primary-orange/20 inline-block">
            In a nutshell
          </span>
          
          <div className="h-px w-16 bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple opacity-90 mx-auto my-6 sm:my-7"></div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-5 sm:mb-6 text-white leading-tight">
            About LearnGevity
          </h1>
          
          <p className="max-w-2xl mx-auto text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed">
            Student-powered tutoring created to connect university students with learners — practical, affordable, and community-driven.
          </p>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 text-white/95">
        {/* Welcome */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-4 sm:mb-6">
            Welcome!
          </h2>
          <p className="text-white/90 leading-relaxed text-base sm:text-lg mb-4">
            LearnGevity Tutoring is a student-powered tutoring platform founded by 2nd-year astrophysics student, <strong className="text-white font-bold">Shakaarah-Zaian Bharath</strong>. I am 21 years old with a passion for education and I love a <strong className="text-white font-bold">good</strong> side hustle! <strong className="text-white font-bold">I have over four years of tutoring experience</strong> and a <strong className="text-white font-bold">TEFL certification</strong>.
          </p>
        </section>

        {/* Why LearnGevity Was Created */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-4 sm:mb-6">
            Why LearnGevity Was Created
          </h2>
          <p className="text-white/90 leading-relaxed text-base sm:text-lg mb-4">
            As a student, finding meaningful part-time work can feel impossible. You need experience to get a job, but you need a job to gain experience — and without a completed degree, the job pool becomes even smaller.
          </p>
          <p className="text-white/90 leading-relaxed text-base sm:text-lg">
            Yet many university students have <strong className="text-white font-bold">excellent academic ability</strong>, strong subject knowledge, and the passion to teach — they just lack opportunities. I created LearnGevity to fix that.
          </p>
        </section>

        {/* Our Tutors */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-4 sm:mb-6">
            Our Tutors
          </h2>
          <p className="text-white/90 leading-relaxed text-base sm:text-lg mb-4">
            Every tutor on our platform is:
          </p>
          <ul className="space-y-3 text-white/90 text-base sm:text-lg">
            <li className="flex items-start">
              <span className="text-primary-purple mr-3 mt-1 text-xl">•</span>
              <span>Currently enrolled in university</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-purple mr-3 mt-1 text-xl">•</span>
              <span>Has achieved at least <strong className="text-white font-bold">70%</strong> in the subjects they teach</span>
            </li>
          </ul>
        </section>

        {/* Our Promise */}
        <section className="mb-12 sm:mb-16 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 sm:p-8">
          <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-4 sm:mb-6">
            Our Promise to You
          </h2>
          <p className="text-white/90 leading-relaxed text-base sm:text-lg">
            We offer a <strong className="text-white font-bold">full money-back guarantee on the first lesson</strong>. If you are not satisfied with your session, simply report the issue within <strong className="text-white font-bold">24 hours</strong> and you will receive a complete refund for that session.
          </p>
        </section>

        {/* Our Mission */}
        <section className="mb-12 sm:mb-16">
          <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-4 sm:mb-6">
            Our Mission
          </h2>
          <ul className="space-y-3 text-white/90 text-base sm:text-lg">
            <li className="flex items-start">
              <span className="text-primary-orange mr-3 mt-1">✓</span>
              <span>Support students academically</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-3 mt-1">✓</span>
              <span>Provide meaningful work for university students</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-3 mt-1">✓</span>
              <span>Create a safe, trustworthy tutoring community</span>
            </li>
            <li className="flex items-start">
              <span className="text-primary-orange mr-3 mt-1">✓</span>
              <span>Make learning more personal, accessible, and effective</span>
            </li>
          </ul>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default About;

