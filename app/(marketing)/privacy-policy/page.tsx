export default function Page() {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="mb-8 text-sm text-gray-600">Last Updated: May 13, 2025</p>

        {/* Introduction */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Introduction
        </h2>
        <p className="mb-4 text-base text-gray-700">
          HOM operates the HOM software, a Software as a Service solution
          designed to help business owners manage the customer lifecycle,
          including appointments, sales, installations, and follow-ups. This
          Privacy Policy explains how we collect, use, store, and protect your
          personal information when you use our Service. It applies to all
          users, including business owners, their employees, and customers
          interacting with the Service.
        </p>
        <p className="mb-6 text-base text-gray-700">
          By using the Service, you consent to the practices described in this
          policy. If you do not agree, please do not use the Service.
        </p>

        {/* Information We Collect */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Information We Collect
        </h2>
        <p className="mb-4 text-base text-gray-700">
          We collect the following types of personal information to provide and
          improve the Service:
        </p>
        <ul className="mb-6 list-disc pl-6 text-base text-gray-700">
          <li className="mb-2">
            <strong>Information You Provide:</strong>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Account Information: Name, email address, phone number, and
                business address when you sign up or create an account.
              </li>
              <li>
                Customer Data: Information about your customers (e.g., name,
                email, phone, address, service details) entered into the Service
                for appointment scheduling, sales, or installation management.
              </li>
              <li>
                Payment Information: Credit card or bank account details for
                processing payments for services or subscriptions.
              </li>
              <li>
                Communications: Information you provide when contacting us
                (e.g., support requests, feedback).
              </li>
            </ul>
          </li>
          <li className="mb-2">
            <strong>Information Collected Automatically:</strong>
            <ul className="mt-2 list-disc pl-6">
              <li>
                Usage Data: Logs of your interactions with the Service, such as
                appointment bookings, sales activities, installation progress,
                and follow-up actions.
              </li>
              <li>
                Technical Data: IP address, device type, browser type, and
                session information to ensure the Service functions correctly.
              </li>
              <li>
                Cookies: We use minimal session cookies to maintain your login
                state. We do not use tracking or analytics cookies.
              </li>
            </ul>
          </li>
        </ul>

        {/* How We Use Your Information */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          How We Use Your Information
        </h2>
        <p className="mb-4 text-base text-gray-700">
          We use your information solely to:
        </p>
        <ul className="mb-6 list-disc pl-6 text-base text-gray-700">
          <li>
            Provide the Service, including scheduling appointments, managing
            sales, tracking installations, and sending follow-up communications.
          </li>
          <li>Process payments for subscriptions or customer transactions.</li>
          <li>
            Communicate with you, such as sending appointment reminders, service
            updates, or responding to support inquiries.
          </li>
          <li>
            Improve the Service by analyzing usage patterns (e.g., identifying
            popular features) using our internal analytics.
          </li>
          <li>
            Comply with legal obligations, such as tax reporting or responding
            to lawful requests.
          </li>
        </ul>

        {/* How We Share Your Information */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          How We Share Your Information
        </h2>
        <p className="mb-4 text-base text-gray-700">
          We do not share, sell, or disclose your personal information to third
          parties, except as required by law:
        </p>
        <ul className="mb-6 list-disc pl-6 text-base text-gray-700">
          <li>
            Legal Requirements: We may disclose data to comply with legal
            obligations, court orders, or to protect our rights, property, or
            safety (e.g., tax authorities, law enforcement).
          </li>
          <li>
            Business Transfers: If HOM is involved in a merger, acquisition, or
            asset sale, your data may be transferred to the new entity, subject
            to this policy.
          </li>
        </ul>
        <p className="mb-6 text-base text-gray-700">
          All data processing, including payment processing and analytics, is
          handled by HOM’s in-house systems.
        </p>

        {/* Data Storage and Security */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Data Storage and Security
        </h2>
        <p className="mb-4 text-base text-gray-700">
          Your data is stored on HOM’s secure servers located in the United
          States. We retain data for as long as your account is active or as
          needed to provide the Service, comply with legal obligations (e.g.,
          tax records), or resolve disputes. After account deletion, we retain
          minimal data for 90 days for backup purposes, then permanently delete
          it, unless required by law.
        </p>
        <p className="mb-4 text-base text-gray-700">
          We implement industry-standard security measures, including:
        </p>
        <ul className="mb-6 list-disc pl-6 text-base text-gray-700">
          <li>
            Encryption of data in transit (TLS 1.3) and at rest (AES-256).
          </li>
          <li>
            Access controls to limit data access to authorized HOM personnel.
          </li>
          <li>
            Regular security audits and penetration testing of our systems.
          </li>
          <li>
            Firewalls and intrusion detection systems to prevent unauthorized
            access.
          </li>
        </ul>
        <p className="mb-6 text-base text-gray-700">
          Despite these measures, no system is completely secure, and we cannot
          guarantee absolute security.
        </p>

        {/* Your Data Rights */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Your Data Rights
        </h2>
        <p className="mb-4 text-base text-gray-700">
          Depending on your location, you have the following rights regarding
          your personal information:
        </p>
        <ul className="mb-6 list-disc pl-6 text-base text-gray-700">
          <li>Access: Request a copy of your data.</li>
          <li>Correction: Update inaccurate data.</li>
          <li>
            Deletion: Request deletion of your data, subject to legal
            obligations.
          </li>
          <li>
            Portability: Receive your data in a structured, machine-readable
            format.
          </li>
          <li>
            Opt-Out: Opt out of non-essential communications (e.g., promotional
            emails).
          </li>
        </ul>
        <p className="mb-6 text-base text-gray-700">
          To exercise these rights, contact us at{" "}
          <a
            href="mailto:privacy@homplatform.com"
            className="text-blue-600 hover:underline"
          >
            privacy@homplatform.com
          </a>
          . We will respond within 30 days, as required by laws like GDPR and
          CCPA. California residents may request information about data
          collection under CalOPPA or opt out of data sharing (though we do not
          share data).
        </p>

        {/* Cookies */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">Cookies</h2>
        <p className="mb-6 text-base text-gray-700">
          We use only essential session cookies to maintain your login state and
          ensure the Service functions properly. These cookies are deleted when
          you log out or close your browser. We do not use cookies for tracking,
          advertising, or analytics, and we do not respond to “Do Not Track”
          signals, as no tracking occurs.
        </p>

        {/* Children’s Privacy */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Children’s Privacy
        </h2>
        <p className="mb-6 text-base text-gray-700">
          The Service is not directed to children under 13 (or 16 in the EU). We
          do not knowingly collect data from minors. If we learn we have
          collected such data without parental consent, we will delete it
          promptly. Contact us at{" "}
          <a
            href="mailto:privacy@homplatform.com"
            className="text-blue-600 hover:underline"
          >
            privacy@homplatform.com
          </a>{" "}
          to report concerns.
        </p>

        {/* International Data Transfers */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          International Data Transfers
        </h2>
        <p className="mb-6 text-base text-gray-700">
          If you are outside the US (e.g., in the EU), your data is transferred
          to and processed in the US, where our servers are located. For EU
          users, we implement safeguards like Standard Contractual Clauses to
          ensure GDPR compliance. By using the Service, you consent to this
          transfer.
        </p>

        {/* Policy Updates */}
        <h2 className="mb-4 text-xl font-semibold text-gray-800">
          Policy Updates
        </h2>
        <p className="mb-6 text-base text-gray-700">
          We may update this policy to reflect changes in our practices or legal
          requirements. We will notify you of material changes via email or a
          notice on our website at least 30 days before they take effect. Your
          continued use of the Service after updates constitutes acceptance of
          the revised policy.
        </p>
      </div>
    </div>
  );
}
