import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Terms = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-primary-navy via-[#0a1238] to-[#061027]">
      <Navbar />

      {/* Hero Section */}
      <section className="min-h-[30vh] flex items-center justify-center text-center px-4 sm:px-6 lg:px-8 py-12 sm:py-14 relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <span className="text-primary-orange font-bold tracking-[2px] text-xs sm:text-sm uppercase bg-primary-orange/10 px-4 py-2 rounded-full border border-primary-orange/20 inline-block">
            Legal
          </span>

          <div className="h-px w-16 bg-gradient-to-r from-primary-purple via-primary-orange to-primary-purple opacity-90 mx-auto my-6 sm:my-7"></div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold uppercase tracking-tight mb-5 sm:mb-6 text-white leading-tight">
            Booking Terms & Conditions
          </h1>
        </div>
      </section>

      {/* Content Section */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 sm:p-8 lg:p-12 border border-white/10">
          <div className="prose prose-invert prose-lg max-w-none">
            
            {/* Introduction */}
            <div className="mb-8 p-6 bg-primary-orange/10 border-l-4 border-primary-orange rounded-lg">
              <p className="text-white/90 leading-relaxed mb-0">
                By proceeding with this booking, you acknowledge and agree to the following terms and conditions:
              </p>
            </div>

            {/* Section 1 */}
            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-orange mb-4">
                1. Payments, Cancellations & No-Refund Policy
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  All tutoring sessions must be paid for in advance unless otherwise agreed in writing.
                </p>
                <p>
                  LearnGevity <strong className="text-white">does not offer refunds</strong> for tutoring sessions once payment has been made.
                </p>
                <p>
                  An exception applies only to the <strong className="text-white">first tutoring session</strong>, where a partial or full refund may be considered at LearnGevity's discretion if the student or parent/guardian is genuinely dissatisfied with the service provided and the complaint is raised within 24 hours of the session.
                </p>

                <h3 className="text-xl font-bold text-white mt-6 mb-3">Missed Sessions & Late Cancellations</h3>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Any session cancelled less than two (2) hours before the scheduled start time will be considered a missed session.</li>
                  <li>Missed sessions are fully billable and non-refundable.</li>
                  <li>Sessions missed due to lateness, absence, or failure to attend will not be rescheduled or refunded.</li>
                </ul>
                <p className="italic">This policy applies to both online and in-person sessions.</p>
              </div>
            </section>

            {/* Section 2 */}
            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-orange mb-4">
                2. In-Person (House-Call) Sessions
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>Where an in-person tutoring session is selected, you acknowledge that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Tutors are independent contractors and not employees of LearnGevity.</li>
                  <li>LearnGevity is not responsible or liable for any loss, damage, injury, theft, or safety incidents that may occur at the student's premises.</li>
                  <li>Responsibility for ensuring a safe and appropriate learning environment rests with the student or parent/guardian.</li>
                </ul>
                <p>
                  LearnGevity conducts reasonable screening of tutors but cannot guarantee or assume liability for conduct occurring during in-person sessions.
                </p>
              </div>
            </section>

            {/* Section 3 */}
            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-orange mb-4">
                3. Tutor–Student Interaction
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  LearnGevity acts as a facilitator connecting students with tutors. Any academic outcomes, performance improvements, or results are not guaranteed and may vary depending on student effort, tutor methodology, and external factors.
                </p>
              </div>
            </section>

            {/* Section 4 */}
            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-orange mb-4">
                4. Personal Information & Data Consent
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  By submitting this booking, you consent to LearnGevity collecting, storing, and using your personal information, including but not limited to:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Full name</li>
                  <li>Email address</li>
                  <li>Phone number</li>
                </ul>
                <p>
                  This information will be used solely for legitimate business purposes, including booking coordination, communication, service delivery, and support.
                </p>
                <p>LearnGevity will:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Handle personal information responsibly and securely</li>
                  <li>Not sell or misuse your data</li>
                  <li>Not share your information with third parties except where required to deliver services (e.g. tutors, scheduling tools, payment providers)</li>
                </ul>
              </div>
            </section>

            {/* Section 5 */}
            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-orange mb-4">
                5. Communication Consent
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>
                  You consent to being contacted by LearnGevity via email, phone call, or WhatsApp regarding your booking, payments, scheduling, and service-related updates.
                </p>
              </div>
            </section>

            {/* Section 6 */}
            <section className="mb-10">
              <h2 className="text-2xl sm:text-3xl font-bold text-primary-orange mb-4">
                6. Acceptance of Terms
              </h2>
              <div className="space-y-4 text-white/80 leading-relaxed">
                <p>By ticking the box below and proceeding with payment, you confirm that:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>You have read and understood these terms</li>
                  <li>You agree to be legally bound by them</li>
                  <li>You are either the student booking services or the parent/legal guardian authorised to do so</li>
                </ul>
              </div>
            </section>

            {/* Footer Note */}
            <div className="mt-12 p-6 bg-primary-purple/10 border border-primary-purple/30 rounded-lg">
              <p className="text-white/70 text-sm mb-0">
                If you have any questions about these terms and conditions, please contact us before booking your session.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Terms;

