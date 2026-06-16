// app/terms/page.js
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | Tattvam Collective",
  description: "Review the Terms of Use and rules governing the use of the Tattvam Collective website.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsOfService() {
  const sections = [
    {
      id: "use-of-website",
      num: "1",
      title: "Use of Website",
      content: (
        <p>
          This website is intended to provide information about Tattvam Collective, our architectural philosophy, projects, services, research, publications, and related content. You agree to use this website only for lawful purposes and in a manner that does not infringe upon the rights of, restrict, or inhibit any other person's use and enjoyment of the website.
        </p>
      ),
    },
    {
      id: "intellectual-property",
      num: "2",
      title: "Intellectual Property",
      content: (
        <div className="space-y-4">
          <p>
            All content on this website, including but not limited to text, drawings, plans, renderings, photographs, graphics, logos, videos, publications, design concepts, and other visual or written materials, is the property of Tattvam Collective or its respective content providers and is protected under applicable copyright and intellectual property laws.
          </p>
          <p>
            Architectural drawings, renderings, photographs, diagrams, publications, and project documentation displayed on this website may not be copied, reproduced, modified, distributed, published, transmitted, stored, or used in any form without the prior written consent of Tattvam Collective.
          </p>
          <p className="italic text-sm text-[#6B7280]">
            Any unauthorized use of website content may violate copyright, trademark, and other applicable laws.
          </p>
        </div>
      ),
    },
    {
      id: "project-information",
      num: "3",
      title: "Project Information and Visual Content",
      content: (
        <div className="space-y-4">
          <p>
            Project descriptions, drawings, renderings, photographs, visualizations, and related content presented on this website are provided for informational and portfolio purposes only.
          </p>
          <p>
            Certain project information may represent conceptual designs, work-in-progress documentation, or edited visual content. Some project details may be omitted or modified to comply with client confidentiality requirements.
          </p>
          <p>
            Tattvam Collective reserves the right to update, modify, or remove project information at any time without prior notice.
          </p>
        </div>
      ),
    },
    {
      id: "professional-disclaimer",
      num: "4",
      title: "Professional Disclaimer",
      content: (
        <div className="space-y-4">
          <p>
            The content provided on this website is for general informational purposes only and should not be construed as architectural, engineering, planning, legal, financial, or professional advice.
          </p>
          <p>
            Viewing or using this website does not create a client-consultant relationship with Tattvam Collective. Any professional engagement shall be governed solely by a separate written agreement between Tattvam Collective and the respective client.
          </p>
        </div>
      ),
    },
    {
      id: "accuracy-of-information",
      num: "5",
      title: "Accuracy of Information",
      content: (
        <div className="space-y-4">
          <p>
            While we strive to ensure that all information on this website is accurate and up to date, Tattvam Collective makes no warranties or representations regarding the completeness, accuracy, reliability, suitability, or availability of any content.
          </p>
          <p className="font-medium">
            Any reliance placed on information contained within this website is strictly at the user's own risk.
          </p>
        </div>
      ),
    },
    {
      id: "third-party-links",
      num: "6",
      title: "Third-Party Links",
      content: (
        <p>
          This website may contain links to third-party websites for convenience and reference purposes. Tattvam Collective has no control over the content, availability, or practices of such websites and does not endorse or assume responsibility for them. Users access third-party websites at their own discretion and risk.
        </p>
      ),
    },
    {
      id: "limitation-of-liability",
      num: "7",
      title: "Limitation of Liability",
      content: (
        <p>
          Tattvam Collective shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising out of or in connection with the use of, or inability to use, this website or its content. This limitation includes, but is not limited to, damages relating to loss of data, loss of profits, business interruption, or reliance upon information obtained through this website.
        </p>
      ),
    },
    {
      id: "changes-to-terms",
      num: "8",
      title: "Changes to These Terms",
      content: (
        <p>
          Tattvam Collective reserves the right to modify or update these Terms of Use at any time without prior notice. Continued use of the website following the publication of revised terms constitutes acceptance of those changes.
        </p>
      ),
    },
    {
      id: "governing-law",
      num: "9",
      title: "Governing Law",
      content: (
        <p>
          These Terms of Use shall be governed by and interpreted in accordance with the laws of India. Any disputes arising under or relating to these Terms of Use shall be subject to the exclusive jurisdiction of the courts of Vadodara, Gujarat, India.
        </p>
      ),
    },
    {
      id: "contact-information",
      num: "10",
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
            For any questions regarding these Terms of Use, please contact us using the details provided above.
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
          <span className="text-[#111111] font-medium">Terms of Service</span>
        </div>

        {/* Header Section */}
        <div className="border-b border-gray-200 pb-10 mb-12">
          <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-light text-[#111111] mb-4 tracking-wide">
            Terms of Service
          </h1>
          <p className="text-sm text-[#6B7280] tracking-wider uppercase">
            Last Updated: June 2026
          </p>
        </div>

        {/* Introduction */}
        <div className="mb-12 p-6 bg-[#FAF9F6] border-l-4 border-[#C6A77D] text-[#6B7280] text-[15px] leading-[1.8] font-light">
          Welcome to the Tattvam Collective website. By accessing or using this website, you agree to be bound by these Terms of Use. If you do not agree with any part of these terms, please discontinue use of this website.
        </div>

        {/* Content Section */}
        <div className="space-y-12">
          {sections.map((sec) => (
            <section key={sec.id} id={sec.id} className="scroll-mt-24">
              <h2 className="font-cormorant text-2xl sm:text-3xl font-light text-[#111111] mb-4 flex items-baseline gap-3 tracking-wide">
                <span className="text-sm font-sans text-[#C6A77D] tracking-widest font-semibold">
                  {sec.num.padStart(2, '0')}
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
