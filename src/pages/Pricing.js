import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Pricing = () => {
  const pricingOptions = [
    {
      title: "Private Session Online",
      price: "R180 / hour",
      gradient: "from-primary-purple to-[#5a3aef]",
    },
    {
      title: "Private Session In-person (House call)",
      price: "R250 / hour",
      gradient: "from-primary-orange to-[#ff8800]",
    },
    {
      title: "Group Session Online (2+ students)",
      price: "R160 / hour",
      gradient: "from-primary-purple to-primary-navy",
    },
    {
      title: "Group Session In-person (House call, 2+ students)",
      price: "R220 / hour",
      gradient: "from-[#5a3aef] to-primary-navy",
    },
    {
      title: "Bundle (10 private online sessions)",
      price: "R1620",
      badge: "10% discount",
      gradient: "from-primary-orange to-primary-purple",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[36vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-primary-orange font-bold tracking-[2px] text-xs sm:text-sm uppercase bg-primary-orange/10 px-4 py-2 rounded-full border border-primary-orange/20 inline-block">
            Pricing
          </span>

          <div className="h-px w-16 bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple opacity-90 mx-auto my-6 sm:my-7"></div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-5 sm:mb-6 text-white leading-tight">
            Transparent Pricing
          </h1>

          <p className="max-w-2xl mx-auto text-white/90 text-base sm:text-lg lg:text-xl leading-relaxed">
            Choose a plan that matches your needs — hourly sessions, bundles,
            and discounts for returning students.
          </p>
        </div>
      </section>

      {/* Pricing Grid */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <h2 className="text-primary-orange text-2xl sm:text-3xl font-extrabold uppercase tracking-wide mb-8 sm:mb-12 text-center">
          Our Rates
        </h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          {pricingOptions.slice(0, 4).map((option, index) => (
            <div
              key={index}
              className={`bg-gradient-to-br ${option.gradient} rounded-xl p-6 sm:p-8 shadow-xl border border-white/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group`}
            >
              {/* Background decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl"></div>

              <div className="relative z-10">
                <h3 className="text-white font-extrabold text-base sm:text-lg mb-4 uppercase tracking-wide leading-tight min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
                  {option.title}
                </h3>
                <p className="text-white text-3xl sm:text-4xl font-extrabold">
                  {option.price}
                </p>
              </div>

              {/* Hover effect overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 rounded-xl"></div>
            </div>
          ))}
        </div>

        {/* Featured Bundle Card */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-gradient-to-br from-primary-orange to-primary-purple rounded-2xl p-8 sm:p-10 shadow-2xl border-2 border-white/20 hover:shadow-3xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 text-center">
              <h3 className="text-white font-extrabold text-xl sm:text-2xl mb-3 uppercase tracking-wide">
                Bundle (10 private online sessions)
              </h3>
              <div className="flex items-center justify-center gap-3 mb-4">
                <span className="text-white/70 text-xl sm:text-2xl line-through">
                  R1800
                </span>
                <span className="text-white text-4xl sm:text-5xl font-extrabold">
                  R1620
                </span>
              </div>
              <p className="text-white/90 text-lg font-bold">
                Save 10% with this bundle!
              </p>
            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300 rounded-2xl"></div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
