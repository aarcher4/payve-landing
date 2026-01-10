"use client";

import Link from "next/link";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 px-6 md:px-12 py-6 bg-white/95 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link href="/" className="font-display text-xl tracking-wide text-[#505050] hover:text-sage transition-colors">
            PAYVE
          </Link>
          <Link
            href="/"
            className="text-sm text-gray-500 hover:text-[#505050] transition-colors font-light"
          >
            Back to Home
          </Link>
        </div>
      </nav>

      {/* Content */}
      <article className="max-w-4xl mx-auto px-6 md:px-12 py-12 md:py-20">
        <header className="mb-12 pb-8 border-b border-gray-200">
          <h1 className="font-display text-4xl md:text-5xl text-[#505050] mb-4">Terms of Service</h1>
          <p className="text-gray-500">Last Updated: January 8, 2026</p>
        </header>

        <div className="prose prose-gray max-w-none legal-content">
          <p className="text-lg text-gray-600 mb-8">
            This End-User License Agreement ("Agreement" or "Terms") is a binding legal contract between you ("User," "you," or "your") and Payve, Inc. ("Payve," "Company," "we," "us," or "our") governing your access to and use of the Payve platform, including our web applications, APIs, and related services (collectively, the "Service").
          </p>

          <p className="text-gray-600 mb-8 font-medium">
            BY CREATING AN ACCOUNT, ACCESSING, OR USING THE SERVICE, YOU ACKNOWLEDGE THAT YOU HAVE READ, UNDERSTOOD, AND AGREE TO BE BOUND BY THIS AGREEMENT. IF YOU DO NOT AGREE TO THESE TERMS, DO NOT ACCESS OR USE THE SERVICE.
          </p>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">1. Definitions</h2>

            <ul className="text-gray-600 space-y-3 mb-4">
              <li><span className="font-medium">"Account"</span> means the user account you create to access and use the Service.</li>
              <li><span className="font-medium">"Administrator"</span> means a User designated by an Organization with authority to manage the Organization's Account, invite other Users, and configure Service settings.</li>
              <li><span className="font-medium">"Authorized User"</span> means any individual authorized by an Administrator to access and use the Service on behalf of an Organization.</li>
              <li><span className="font-medium">"Organization"</span> means the business entity that subscribes to and uses the Service.</li>
              <li><span className="font-medium">"User Data"</span> means any data, content, documents, or information that you or your Authorized Users upload, submit, or transmit through the Service.</li>
              <li><span className="font-medium">"Third-Party Services"</span> means external services that may be integrated with Payve, including but not limited to accounting systems, payment processors, banking services, email platforms, productivity tools, and communication services.</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">2. License Grant and Restrictions</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">2.1 License Grant</h3>
            <p className="text-gray-600 mb-4">Subject to your compliance with this Agreement, Payve grants you a limited, non-exclusive, non-transferable, non-sublicensable, revocable license to access and use the Service solely for your internal business purposes in accordance with this Agreement and any applicable subscription terms.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">2.2 Restrictions</h3>
            <p className="text-gray-600 mb-4">You shall not, and shall not permit any third party to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-2 mb-4">
              <li>Copy, modify, adapt, translate, or create derivative works based on the Service</li>
              <li>Reverse engineer, disassemble, decompile, or otherwise attempt to derive the source code of the Service</li>
              <li>Sell, resell, sublicense, lease, rent, loan, or otherwise transfer or distribute the Service to any third party</li>
              <li>Remove, alter, or obscure any proprietary notices, labels, or marks on the Service</li>
              <li>Use the Service to develop a competing product or service</li>
              <li>Use any automated means, including robots, crawlers, or scrapers, to access the Service except through our published APIs</li>
              <li>Circumvent, disable, or interfere with security-related features of the Service</li>
              <li>Use the Service for any illegal, fraudulent, or unauthorized purpose</li>
              <li>Transmit any malware, viruses, or other malicious code through the Service</li>
              <li>Interfere with or disrupt the integrity or performance of the Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">3. Account Registration and Security</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.1 Account Creation</h3>
            <p className="text-gray-600 mb-4">To use the Service, you must create an Account by providing accurate, current, and complete information. You agree to update this information as necessary to maintain its accuracy.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.2 Account Security</h3>
            <p className="text-gray-600 mb-4">You are responsible for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Maintaining the confidentiality of your login credentials</li>
              <li>All activities that occur under your Account</li>
              <li>Notifying Payve immediately of any unauthorized use of your Account or any other security breach</li>
              <li>Ensuring that you log out of your Account at the end of each session</li>
            </ul>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.3 Administrator Responsibilities</h3>
            <p className="text-gray-600 mb-4">Administrators are responsible for managing Authorized Users and their access levels, ensuring all Authorized Users comply with this Agreement, configuring Organization settings and integrations, and responding to data access and deletion requests from their Authorized Users.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">4. User Data and Content</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">4.1 Ownership</h3>
            <p className="text-gray-600 mb-4">You retain all right, title, and interest in and to your User Data. Payve does not claim ownership of any User Data.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">4.2 License to User Data</h3>
            <p className="text-gray-600 mb-4">You grant Payve a non-exclusive, worldwide, royalty-free license to use, copy, store, transmit, display, and process your User Data solely as necessary to provide, maintain, and improve the Service, comply with applicable laws, and enforce this Agreement.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">4.3 Responsibility for User Data</h3>
            <p className="text-gray-600 mb-4">You are solely responsible for the accuracy, quality, and legality of your User Data, obtaining all necessary rights, consents, and permissions to use and share your User Data with the Service, and ensuring your User Data does not violate any third-party rights or applicable laws.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">4.4 AI-Powered Processing</h3>
            <p className="text-gray-600 mb-4">The Service uses artificial intelligence technologies to automatically process, classify, and extract data from your documents. By uploading documents to the Service, you consent to this AI-powered processing. Your documents are transmitted securely to these AI services, and the extracted data is used solely to provide the Service to you.</p>
            <p className="text-gray-600 mb-4">You acknowledge and consent to this data processing as described in our Privacy Policy.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">5. Third-Party Integrations</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">5.1 Third-Party Services</h3>
            <p className="text-gray-600 mb-4">The Service allows integration with Third-Party Services. Your use of Third-Party Services is subject to the terms and conditions and privacy policies of those third parties.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">5.2 Authorization</h3>
            <p className="text-gray-600 mb-4">By connecting Third-Party Services to your Account, you authorize Payve to access, retrieve, and process data from those services on your behalf.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">5.3 Disclaimer</h3>
            <p className="text-gray-600 mb-4">Payve is not responsible for the availability, accuracy, or functionality of Third-Party Services. We do not endorse and are not liable for any Third-Party Services or their content.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">6. Payment Services</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">6.1 Payment Processing</h3>
            <p className="text-gray-600 mb-4">The Service may facilitate payment processing through third-party payment processors. Your use of payment features is subject to the terms and conditions of those payment processors.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">6.2 Financial Information</h3>
            <p className="text-gray-600 mb-4">You acknowledge that accurate financial information is required for payment processing. You are responsible for ensuring the accuracy of all payment information and authorization.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">6.3 No Financial Advice</h3>
            <p className="text-gray-600 mb-4">The Service does not provide financial, legal, tax, or accounting advice. You should consult qualified professionals for such advice.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">7. Intellectual Property</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">7.1 Payve Property</h3>
            <p className="text-gray-600 mb-4">The Service, including all software, algorithms, user interfaces, designs, text, graphics, logos, and other content (excluding User Data), is owned by Payve or its licensors and is protected by intellectual property laws.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">7.2 Trademarks</h3>
            <p className="text-gray-600 mb-4">"Payve" and related logos and names are trademarks of Payve. You may not use these trademarks without our prior written consent.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">7.3 Feedback</h3>
            <p className="text-gray-600 mb-4">If you provide suggestions, ideas, or feedback about the Service ("Feedback"), you grant Payve a perpetual, irrevocable, worldwide, royalty-free license to use, modify, and incorporate such Feedback without any obligation to you.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">8. Confidentiality</h2>
            <p className="text-gray-600 mb-4">Each party agrees to maintain the confidentiality of the other party's confidential information and not to disclose it to any third party except as necessary to perform obligations under this Agreement or as required by law.</p>
            <p className="text-gray-600 mb-4">Confidential information does not include information that is or becomes publicly available through no fault of the receiving party, was rightfully in the receiving party's possession prior to disclosure, is independently developed by the receiving party, or is rightfully obtained from a third party without restriction.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">9. Disclaimers</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-gray-600 font-medium mb-4">THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.</p>
              <p className="text-gray-600 font-medium">PAYVE DOES NOT WARRANT THAT THE SERVICE WILL MEET YOUR REQUIREMENTS, BE UNINTERRUPTED, TIMELY, SECURE, OR ERROR-FREE, OR THAT ANY ERRORS IN THE SERVICE WILL BE CORRECTED.</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">10. Limitation of Liability</h2>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <p className="text-gray-600 mb-4">TO THE MAXIMUM EXTENT PERMITTED BY LAW, IN NO EVENT SHALL PAYVE, ITS AFFILIATES, OFFICERS, DIRECTORS, EMPLOYEES, AGENTS, OR LICENSORS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, REVENUE, OR DATA, BUSINESS INTERRUPTION, OR COST OF SUBSTITUTE SERVICES.</p>
              <p className="text-gray-600">PAYVE'S TOTAL CUMULATIVE LIABILITY TO YOU FOR ANY AND ALL CLAIMS ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE GREATER OF: (A) THE AMOUNTS PAID BY YOU TO PAYVE IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM; OR (B) ONE HUNDRED DOLLARS ($100).</p>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">11. Indemnification</h2>
            <p className="text-gray-600 mb-4">You agree to indemnify, defend, and hold harmless Payve, its affiliates, officers, directors, employees, agents, and licensors from and against any and all claims, damages, losses, liabilities, costs, and expenses (including reasonable attorneys' fees) arising out of or related to your use of the Service, your User Data, your violation of this Agreement, your violation of any applicable law or regulation, your infringement of any third-party rights, or any dispute between you and a third party.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">12. Term and Termination</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">12.1 Term</h3>
            <p className="text-gray-600 mb-4">This Agreement commences when you create an Account or first access the Service and continues until terminated.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">12.2 Termination by You</h3>
            <p className="text-gray-600 mb-4">You may terminate this Agreement at any time by closing your Account and discontinuing use of the Service.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">12.3 Termination by Payve</h3>
            <p className="text-gray-600 mb-4">Payve may terminate or suspend your access to the Service at any time, with or without cause, with or without notice, including if you breach this Agreement, we are required to do so by law, or we discontinue the Service.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">12.4 Effect of Termination</h3>
            <p className="text-gray-600 mb-4">Upon termination, your license to use the Service immediately terminates, you must cease all use of the Service, and we may delete your User Data after a reasonable retention period. Sections 7, 8, 9, 10, 11, 13, and 14 shall survive termination.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">13. Dispute Resolution</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">13.1 Informal Resolution</h3>
            <p className="text-gray-600 mb-4">Before initiating any formal dispute resolution, you agree to first contact Payve at legal@payve.com and attempt to resolve any dispute informally for at least sixty (60) days.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">13.2 Binding Arbitration</h3>
            <p className="text-gray-600 mb-4">If we cannot resolve a dispute informally, any dispute, controversy, or claim arising out of or relating to this Agreement shall be resolved by binding arbitration administered by the American Arbitration Association ("AAA") in accordance with its Commercial Arbitration Rules.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">13.3 Class Action Waiver</h3>
            <p className="text-gray-600 mb-4 font-medium">YOU AND PAYVE AGREE THAT EACH MAY BRING CLAIMS AGAINST THE OTHER ONLY IN YOUR OR ITS INDIVIDUAL CAPACITY AND NOT AS A PLAINTIFF OR CLASS MEMBER IN ANY PURPORTED CLASS OR REPRESENTATIVE PROCEEDING.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">13.4 Jury Trial Waiver</h3>
            <p className="text-gray-600 mb-4 font-medium">YOU AND PAYVE WAIVE ANY RIGHT TO A JURY TRIAL.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">14. General Provisions</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">14.1 Governing Law</h3>
            <p className="text-gray-600 mb-4">This Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law provisions.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">14.2 Entire Agreement</h3>
            <p className="text-gray-600 mb-4">This Agreement, together with the Privacy Policy and any other policies referenced herein, constitutes the entire agreement between you and Payve regarding the Service.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">14.3 Modifications</h3>
            <p className="text-gray-600 mb-4">Payve reserves the right to modify this Agreement at any time. We will notify you of material changes by posting the updated Agreement on our website or through the Service. Your continued use of the Service after such modifications constitutes acceptance of the updated Agreement.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">14.4 Severability</h3>
            <p className="text-gray-600 mb-4">If any provision of this Agreement is held to be invalid or unenforceable, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall remain in full force and effect.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">14.5 Assignment</h3>
            <p className="text-gray-600 mb-4">You may not assign or transfer this Agreement without Payve's prior written consent. Payve may assign this Agreement without restriction.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">14.6 Force Majeure</h3>
            <p className="text-gray-600 mb-4">Payve shall not be liable for any failure or delay in performance due to causes beyond its reasonable control, including but not limited to acts of God, natural disasters, war, terrorism, labor disputes, government actions, or internet service failures.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">15. Contact Information</h2>
            <p className="text-gray-600 mb-4">If you have any questions about this Agreement, please contact us:</p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-display text-lg text-[#505050] mb-4">Payve, Inc.</p>
              <ul className="text-gray-600 space-y-2">
                <li><span className="font-medium">Legal Inquiries:</span> legal@payve.com</li>
                <li><span className="font-medium">General Support:</span> support@payve.com</li>
              </ul>
            </div>
          </section>

          <p className="text-gray-500 text-sm italic mt-12 pt-8 border-t border-gray-200">
            By using the Service, you acknowledge that you have read and understood this Agreement and agree to be bound by its terms and conditions.
          </p>
        </div>
      </article>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 px-6 md:px-12 bg-gray-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            &copy; 2025 Payve, Inc. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-gray-500 hover:text-[#505050] transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-xs text-gray-500 hover:text-[#505050] transition-colors">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
