"use client";

import Link from "next/link";

export default function PrivacyPolicy() {
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
          <h1 className="font-display text-4xl md:text-5xl text-[#505050] mb-4">Privacy Policy</h1>
          <p className="text-gray-500">Last Updated: January 8, 2026</p>
        </header>

        <div className="prose prose-gray max-w-none legal-content">
          <p className="text-lg text-gray-600 mb-8">
            Payve, Inc. ("Payve," "Company," "we," "us," or "our") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services (collectively, the "Service").
          </p>

          <p className="text-gray-600 mb-8">
            Please read this Privacy Policy carefully. By accessing or using the Service, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with the terms of this Privacy Policy, please do not access or use the Service.
          </p>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">1. Information We Collect</h2>
            <p className="text-gray-600 mb-4">We collect information in several ways depending on how you interact with our Service.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">1.1 Information You Provide Directly</h3>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Account Information:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Name (first and last)</li>
              <li>Email address</li>
              <li>Password (stored in encrypted/hashed form)</li>
              <li>Phone number</li>
              <li>Job title and role</li>
              <li>Organization name and details</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Organization Information:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Company name and legal entity details</li>
              <li>Business address</li>
              <li>Organization subdomain</li>
              <li>Branding preferences (logos, colors)</li>
              <li>Subscription and billing information</li>
              <li>Tax identification numbers (when required)</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Business Contact Information:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Contact names and display names</li>
              <li>Email addresses and phone numbers</li>
              <li>Physical addresses</li>
              <li>Organization codes and identifiers</li>
              <li>Contact categories (vendors, customers, growers, carriers, inspectors)</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Financial and Transaction Data:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Invoices (numbers, amounts, dates, line items)</li>
              <li>Bills and purchase orders</li>
              <li>Payment amounts and due dates</li>
              <li>Bank account information (for payment processing)</li>
              <li>Routing and account numbers (encrypted)</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Documents and Content:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Uploaded documents (invoices, bills of lading, purchase orders, inspection reports)</li>
              <li>Extracted text and data from documents</li>
              <li>Quality inspection records and metrics</li>
              <li>Photos and attachments</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Communications:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Email content and attachments</li>
              <li>Messaging content</li>
              <li>Support inquiries and correspondence</li>
              <li>Notes and comments within the Service</li>
            </ul>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">1.2 Information Collected Automatically</h3>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Usage Data:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Features accessed and actions taken</li>
              <li>Date and time of access</li>
              <li>Duration of sessions</li>
              <li>Clickstream data</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Device Information:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Operating system</li>
              <li>Device identifiers</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Cookies and Tracking Technologies:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Session cookies (for authentication)</li>
              <li>Security cookies (for fraud prevention)</li>
            </ul>
            <p className="text-gray-600 mb-4 text-sm italic">Note: We do not use analytics or advertising cookies. We only use essential cookies required for the Service to function.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">1.3 Information from Third Parties</h3>
            <p className="text-gray-600 mb-4">When you connect third-party services to your Payve account, we receive information from those services, which may include:</p>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Accounting & ERP Systems:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Company information and identifiers</li>
              <li>Invoices, bills, and purchase orders</li>
              <li>Customer and vendor records</li>
              <li>Payment status and history</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Banking & Payment Services:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Bank account information</li>
              <li>Account and routing numbers</li>
              <li>Account balances and verification data</li>
              <li>Payment instrument details</li>
            </ul>

            <h4 className="font-medium text-[#505050] mt-4 mb-2">Email & Productivity Platforms:</h4>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Email addresses and display names</li>
              <li>OAuth tokens (encrypted)</li>
              <li>Email content (when authorized)</li>
            </ul>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">1.4 Sensitive Information</h3>
            <p className="text-gray-600 mb-4">We may collect certain sensitive information necessary for our financial services:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Bank account numbers and routing numbers</li>
              <li>Partial Social Security Number (last 4 digits only)</li>
              <li>Date of birth</li>
              <li>Tax identification numbers</li>
            </ul>
            <p className="text-gray-600 mb-4 text-sm italic">This sensitive information is collected solely for payment processing verification (KYC/KYB) through our payment partners. All sensitive information is encrypted at rest and in transit.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">2. How We Use Your Information</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">2.1 Service Delivery and Operations</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Creating and managing your account</li>
              <li>Processing documents and extracting data</li>
              <li>Facilitating payment processing and collections</li>
              <li>Synchronizing data with integrated third-party services</li>
              <li>Providing quality inspection tracking</li>
              <li>Managing workflows and automation</li>
              <li>Enabling communication features</li>
            </ul>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">2.2 Service Improvement</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Analyzing usage patterns to improve features</li>
              <li>Troubleshooting technical issues</li>
              <li>Developing new features and services</li>
            </ul>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">2.3 AI-Powered Document Processing</h3>
            <p className="text-gray-600 mb-4">We use artificial intelligence services to process and extract data from your documents. These AI services may be used for:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Document classification and categorization</li>
              <li>Text extraction and optical character recognition</li>
              <li>Structured data extraction from invoices, bills of lading, purchase orders, and inspection reports</li>
              <li>Document validation and data verification</li>
            </ul>
            <p className="text-gray-600 mb-4">Your documents are transmitted securely to these AI services for processing. We do not use your document data to train third-party AI models.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">2.4 Security and Compliance</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Detecting and preventing fraud</li>
              <li>Enforcing our terms of service</li>
              <li>Complying with legal obligations</li>
              <li>Protecting the rights and safety of users</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">3. How We Share Your Information</h2>
            <p className="text-gray-600 mb-4">We do not sell, rent, or lease your personal information to third parties. We share information only in the following circumstances:</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.1 With Your Consent</h3>
            <p className="text-gray-600 mb-4">We share information when you explicitly authorize us to do so, such as when you connect third-party integrations.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.2 Service Providers</h3>
            <p className="text-gray-600 mb-4">We share information with trusted service providers who assist in operating our Service, including:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Cloud infrastructure for data storage and hosting</li>
              <li>Payment processors for facilitating payments</li>
              <li>Communication services for email and messaging</li>
              <li>AI/ML services for document processing</li>
              <li>Customer support services</li>
            </ul>
            <p className="text-gray-600 mb-4">These providers are contractually obligated to protect your information and use it only for the purposes we specify. A list of our current sub-processors is available upon request.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.3 Third-Party Integrations</h3>
            <p className="text-gray-600 mb-4">When you connect third-party services (such as accounting systems, email platforms, or productivity tools), we share necessary data to enable the integration. These third parties have their own privacy policies governing their use of your data.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">3.4 Legal Requirements</h3>
            <p className="text-gray-600 mb-4">We may disclose information when required by law, including in response to lawful requests by public authorities, to comply with legal process, to protect our rights, or in connection with an investigation of suspected illegal activity.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">4. Data Retention</h2>
            <p className="text-gray-600 mb-4">We retain your information for as long as necessary to provide the Service to you, comply with legal and regulatory obligations, resolve disputes and enforce agreements, and maintain business records.</p>

            <div className="bg-gray-50 rounded-lg p-6 mb-4">
              <h4 className="font-medium text-[#505050] mb-3">Retention Periods:</h4>
              <ul className="text-gray-600 space-y-2 text-sm">
                <li><span className="font-medium">Account Information:</span> Duration of account + 3 years</li>
                <li><span className="font-medium">Financial Records:</span> 7 years (regulatory requirement)</li>
                <li><span className="font-medium">Transaction Data:</span> 7 years</li>
                <li><span className="font-medium">Communications:</span> 3 years</li>
                <li><span className="font-medium">Usage Logs:</span> 1 year</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">5. Data Security</h2>
            <p className="text-gray-600 mb-4">We implement comprehensive security measures to protect your information:</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">Technical Safeguards:</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Encryption in transit (TLS/SSL)</li>
              <li>Encryption at rest (AES-256-GCM for sensitive data)</li>
              <li>Secure password hashing</li>
              <li>OAuth token encryption</li>
              <li>Row-level security in databases</li>
              <li>Regular security assessments</li>
            </ul>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">Administrative Safeguards:</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Access controls and authentication</li>
              <li>Employee security training</li>
              <li>Incident response procedures</li>
              <li>Vendor security reviews</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">6. Your Rights and Choices</h2>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">6.1 Account Settings</h3>
            <p className="text-gray-600 mb-4">You can access and update your account information through the Service settings at any time.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">6.2 Data Portability</h3>
            <p className="text-gray-600 mb-4">You may request a copy of your data in a structured, commonly used format by contacting us at privacy@payve.com.</p>

            <h3 className="font-semibold text-lg text-[#505050] mt-6 mb-3">6.3 Account Deletion</h3>
            <p className="text-gray-600 mb-4">You may request deletion of your account by contacting us or through account settings. Note that we may retain certain information as required by law.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">7. State-Specific Privacy Rights</h2>
            <p className="text-gray-600 mb-4">If you are a California resident (CCPA/CPRA) or resident of Virginia, Colorado, Connecticut, Utah, or other states with comprehensive privacy laws, you have rights to:</p>
            <ul className="list-disc pl-6 text-gray-600 space-y-1 mb-4">
              <li>Know what personal information we collect about you</li>
              <li>Request deletion of your personal information</li>
              <li>Request correction of inaccurate personal information</li>
              <li>Opt out of the sale or sharing of your personal information (Note: We do not sell your personal information)</li>
              <li>Data portability</li>
              <li>Non-discrimination for exercising your privacy rights</li>
            </ul>
            <p className="text-gray-600 mb-4">To exercise these rights, contact us at privacy@payve.com.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">8. Children's Privacy</h2>
            <p className="text-gray-600 mb-4">The Service is not intended for individuals under the age of 18. We do not knowingly collect personal information from children under 18. If we learn that we have collected information from a child under 18, we will promptly delete that information.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">9. International Data Transfers</h2>
            <p className="text-gray-600 mb-4">Your information may be processed and stored in the United States or other countries where our service providers operate. When we transfer information internationally, we implement appropriate safeguards including standard contractual clauses and data processing agreements.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">10. Changes to This Privacy Policy</h2>
            <p className="text-gray-600 mb-4">We may update this Privacy Policy from time to time. When we make material changes, we will update the "Last Updated" date at the top of this policy and notify you through the Service or by email. Your continued use of the Service after changes constitutes acceptance of the updated policy.</p>
          </section>

          <section className="mb-12">
            <h2 className="font-display text-2xl text-[#505050] mb-6">11. Contact Us</h2>
            <p className="text-gray-600 mb-4">If you have questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:</p>
            <div className="bg-gray-50 rounded-lg p-6">
              <p className="font-display text-lg text-[#505050] mb-4">Payve, Inc.</p>
              <ul className="text-gray-600 space-y-2">
                <li><span className="font-medium">Privacy Inquiries:</span> privacy@payve.com</li>
                <li><span className="font-medium">General Support:</span> support@payve.com</li>
                <li><span className="font-medium">Legal Inquiries:</span> legal@payve.com</li>
              </ul>
            </div>
          </section>
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
