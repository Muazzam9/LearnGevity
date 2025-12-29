import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { FaWhatsapp, FaEnvelope, FaInstagram, FaLinkedin, FaUserGraduate, FaStar, FaMoneyBillWave } from 'react-icons/fa';

const Contact = () => {
  const contactMethods = [
    {
      icon: FaWhatsapp,
      name: 'WhatsApp',
      value: '+27 83 380 5075',
      link: 'https://wa.me/27833805075',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: FaEnvelope,
      name: 'Email',
      value: 'learngevity.info@gmail.com',
      link: 'mailto:learngevity.info@gmail.com',
      color: 'from-primary-orange to-[#ff8800]'
    },
    {
      icon: FaInstagram,
      name: 'Instagram',
      value: '@learn_gevity',
      link: 'https://www.instagram.com/learn_gevity',
      color: 'from-pink-500 to-purple-600'
    },
    {
      icon: FaLinkedin,
      name: 'LinkedIn',
      value: 'LearnGevity SA',
      link: 'https://www.linkedin.com/in/learn-gevity-sa/',
      color: 'from-blue-600 to-blue-700'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[40vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-primary-orange font-bold tracking-[2px] text-xs sm:text-sm uppercase bg-primary-orange/10 px-4 py-2 rounded-full border border-primary-orange/20 inline-block">
            Get in touch
          </span>
          
          <div className="h-px w-16 bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple opacity-90 mx-auto my-6 sm:my-7"></div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-5 sm:mb-6 text-white leading-tight">
            Contact LearnGevity
          </h1>
          
          <p className="max-w-2xl mx-auto text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed">
            We're here to help you connect, learn, and succeed.
          </p>
        </div>
      </section>

      {/* Contact Methods Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-16">
          {contactMethods.map((method, index) => {
            const IconComponent = method.icon;
            return (
              <a
                key={index}
                href={method.link}
                target={method.name === 'Email' ? '_self' : '_blank'}
                rel={method.name !== 'Email' ? 'noopener noreferrer' : undefined}
                className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 sm:p-8 hover:bg-white/10 hover:border-primary-purple/30 hover:-translate-y-2 transition-all duration-300 text-center flex flex-col items-center"
              >
                {/* Icon with gradient background */}
                <div className={`w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-4 sm:mb-6 rounded-2xl bg-gradient-to-br ${method.color} flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="text-white text-4xl sm:text-5xl" />
                </div>
                
                {/* Name */}
                <h3 className="text-white font-extrabold text-lg sm:text-xl mb-2 sm:mb-3 uppercase tracking-wide">
                  {method.name}
                </h3>
                
                {/* Value - with word break for long text */}
                <p className="text-white/80 text-sm sm:text-base font-medium group-hover:text-primary-orange transition-colors break-words w-full px-2">
                  {method.value}
                </p>
              </a>
            );
          })}

        </div>

        {/* Quick Links Section */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-8 text-center">
            Quick Links
          </h2>
          
          <div className="grid sm:grid-cols-3 gap-6">
            <Link 
              to="/tutors" 
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary-purple/30 transition-all duration-300"
            >
              <div className="text-primary-purple text-5xl mb-4 group-hover:text-primary-orange transition-colors">
                <FaUserGraduate />
              </div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-primary-orange transition-colors">Browse Our Tutors</h3>
              <p className="text-white/70 text-sm">Find the perfect tutor for your needs</p>
            </Link>

            <Link 
              to="/apply" 
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary-orange/30 transition-all duration-300"
            >
              <div className="text-primary-orange text-5xl mb-4 group-hover:text-primary-purple transition-colors">
                <FaStar />
              </div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-primary-orange transition-colors">Become a Tutor</h3>
              <p className="text-white/70 text-sm">Join our team of educators</p>
            </Link>

            <Link 
              to="/pricing" 
              className="group bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 hover:border-primary-purple/30 transition-all duration-300"
            >
              <div className="text-green-500 text-5xl mb-4 group-hover:text-primary-orange transition-colors">
                <FaMoneyBillWave />
              </div>
              <h3 className="font-bold text-white text-lg mb-2 group-hover:text-primary-orange transition-colors">View Pricing</h3>
              <p className="text-white/70 text-sm">Flexible options for every budget</p>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Contact;

