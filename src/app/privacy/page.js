// app/privacy/page.js
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | Tattvam Collective",
  description: "Learn about how Tattvam Collective collects, uses, discloses, and safeguards your personal information when you visit our website.",
  alternates: {
    canonical: "/privacy",
  },
};

export default function PrivacyPolicy() {
  const sections = [
    {
      id: "information-we-collect",
      num: "1",
      title: "Information We Collect",
      content: (
        <>
          <p className="mb-4">We may collect the following types of information:</p>
          <ul className="space-y-4 pl-4 border-l-2 border-[#C6A77D]/30">
            <li>
              <strong className="text-[#111111] block mb-1">Personal Information:</strong>
              Name, email address, phone number, company name, or any information voluntarily provided through contact forms, inquiries, or other communications.
            </li>
            <li>
              <strong className="text-[#111111] block mb-1">Project Information:</strong>
              Information voluntarily submitted in relation to project inquiries, including project requirements, site details, budgets, timelines, and related information.
            </li>
            <li>
              <strong className="text-[#111111] block mb-1">Technical Information:</strong>
              IP address, browser type, device information, pages visited, referral sources, and website usage data collected automatically.
            </li>
          </ul>
        </>
      ),
    },
    {
      id: "how-we-use-your-information",
      num: "2",
      title: "How We Use Your Information",
      content: (
        <>
          <p className="mb-4">Your information may be used to:</p>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 list-disc pl-5 marker:text-[#C6A77D]">
            <li>Respond to inquiries and communication requests.</li>
            <li>Provide information about our work, services, research, and activities.</li>
            <li>Evaluate and respond to project inquiries.</li>
            <li>Improve website performance and user experience.</li>
            <li>Analyze website traffic and user engagement.</li>
            <li>Maintain website security and prevent misuse.</li>
          </ul>
        </>
      ),
    },
    {
      id: "cookies-and-tracking",
      num: "3",
      title: "Cookies and Tracking Technologies",
      content: (
        <p>
          This website may use cookies, analytics services, and similar technologies to enhance the browsing experience and analyze website traffic. You may choose to disable cookies through your browser settings. Disabling cookies may affect certain features of the website.
        </p>
      ),
    },
    {
      id: "sharing-of-information",
      num: "4",
      title: "Sharing of Information",
      content: (
        <p>
          Tattvam Collective does not sell, rent, or trade personal information. Information may be shared only when required by law, to protect our rights, or with trusted service providers who assist in operating, hosting, maintaining, or securing the website and who agree to keep such information confidential.
        </p>
      ),
    },
    {
      id: "data-security",
      num: "5",
      title: "Data Security",
      content: (
        <p>
          We implement reasonable administrative and technical measures to protect personal information. However, no method of transmission over the Internet or electronic storage is completely secure, and we cannot guarantee absolute security.
        </p>
      ),
    },
    {
      id: "external-links",
      num: "6",
      title: "External Links",
      content: (
        <p>
          Our website may contain links to external websites. We are not responsible for the privacy practices, policies, or content of such third-party websites. We encourage users to review their respective privacy policies.
        </p>
      ),
    },
    {
      id: "your-rights",
      num: "7",
      title: "Your Rights",
      content: (
        <p>
          You may request access, correction, or deletion of personal information you have provided to us, subject to applicable legal requirements.
        </p>
      ),
    },
    {
      id: "updates-to-this-policy",
      num: "8",
      title: "Updates to This Policy",
      content: (
        <p>
          Tattvam Collective may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
        </p>
      ),
    },
    {
      id: "contact-information",
      num: "9",
      title: "Contact Information",
      content: (
        <div className="bg-[#FAF9F6] border border-gray-100 p-6 rounded-lg space-y-3">
          <p className="font-semibold text-[#111111]">Tattvam Collective</p>
          <p className="text-[#6B7280]">Vadodara, Gujarat, India</p>
          <div className="pt-2 space-y-1">
            <p className="text-sm">
              <span className="text-[#6B7280]">Email:</span>{" "}
              <a href="mailto:tatvamcollective@gmail.com" className="text-[#C6A77D] hover:underline font-medium">
                tatvamcollective@gmail.com
              </a>
            </p>
          </div>
          <p className="text-sm text-[#6B7280] pt-2 italic">
            For any questions regarding this Privacy Policy or your personal information, please contact us using the details provided above.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div className="bg-[#FAF9F6] text-[#111111] min-h-screen py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Breadcrumb */}
        <div className="mb-12 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#6B7280]">
          <Link href="/" className="hover:text-[#C6A77D] transition-colors">Home</Link>
          <span>/</span>
          <span className="text-[#111111] font-medium">Privacy Policy</span>
        </div>

        {/* Header Section */}
        <div className="border-b border-gray-200 pb-10 mb-12">
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-[#111111] mb-4 tracking-wide">
            Privacy Policy
          </h1>
          <p className="text-sm text-[#6B7280] tracking-wider uppercase">
            Last Updated: June 2026
          </p>
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24">
              <h2 className="font-cormorant text-2xl sm:text-3xl font-light text-[#111111] mb-4 flex items-baseline gap-3 tracking-wide">
                <span className="text-sm font-sans text-[#C6A77D] tracking-widest font-semibold">
                  0{sec.num}
                </span>
                {sec.title}
              </h2>
              <div className="text-[15px] leading-[1.8] text-[#6B7280] font-light">
                {sec.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
