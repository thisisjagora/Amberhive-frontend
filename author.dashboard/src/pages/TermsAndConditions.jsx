import React from "react";
import { useNavigate } from "react-router";
import Herobg from "@/assets/hero-bg.png";

const TermsAndConditions = () => {
  const navigate = useNavigate();

  return (
    <div className="relative font-gilroy">
      <div className="hidden md:block absolute top-0 left-0 z-[-1]">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline mb-6 cursor-pointer"
        >
          &larr; Back
        </button>

        {/* Header */}
        <h1 className="text-3xl font-bold mb-2">
          AmberHive Terms & Conditions
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Effective Date: June 19, 2025
        </p>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <p>
            <strong>Operating Entity:</strong> Sophos Books Nig Ltd <br />
            <strong>Jurisdiction:</strong> Nigeria
          </p>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing or using the AmberHive platform, you agree to be
              bound by these Terms & Conditions.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">2. About AmberHive</h2>
            <p>
              AmberHive is a digital platform operated by Sophos Books Nig Ltd,
              aimed at connecting African authors with global readers.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">3. User Eligibility</h2>
            <p>
              Users must be at least 18 years old, provide accurate registration
              info, and keep credentials secure.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              4. User Responsibilities
            </h2>
            <p>
              Use the platform lawfully, respect others’ rights, and comply with
              applicable laws.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              5. Author Content & Intellectual Property
            </h2>
            <p>
              Authors retain rights to their work. By uploading content, you
              grant us a license to display and distribute it.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              6. Reader Content & Reviews
            </h2>
            <p>
              Readers may submit honest reviews. We reserve the right to
              moderate such content.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              7. Payments and Transactions
            </h2>
            <p>
              Some services require payment. Transactions are handled securely
              via third-party providers.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              8. Prohibited Activities
            </h2>
            <p>Do not hack, impersonate, spam, or post harmful content.</p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              9. Termination of Use
            </h2>
            <p>
              We may suspend or terminate accounts for breaches or harmful
              conduct.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              10. Limitation of Liability
            </h2>
            <p>
              We are not liable for data loss, content accuracy, or third-party
              misconduct.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">11. Indemnification</h2>
            <p>
              Users agree to indemnify Sophos Books Nig Ltd for any claims
              arising from misuse.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">12. Governing Law</h2>
            <p>
              These Terms are governed by Nigerian law. Disputes fall under
              Nigerian jurisdiction.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">13. Changes to Terms</h2>
            <p>
              We may update these Terms. Continued use constitutes acceptance.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">14. Contact Us</h2>
            <p>
              📧 support@sophosbooks.com <br />
              📍 Sophos Books Nig Ltd, Sophos House, 11 Aba Agbopa, Ido, Ibadan,
              Oyo State, Nigeria
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              15. Publishing Packages and Subscription Levels
            </h2>
            <p>
              AmberHive offers a variety of publishing and platform subscription
              packages. The features and pricing for each package are displayed
              on the platform and may be updated periodically. Users are
              encouraged to review package details before purchasing.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              16. Author Royalties and Revenue Sharing
            </h2>
            <p>
              Authors may be eligible to earn royalties or revenue from books
              sold or content monetized through AmberHive. The applicable
              royalty rate or revenue share will be determined and published by
              the AmberHive administration and may be revised from time to time.
              Any changes to royalty terms will be communicated to authors in
              advance. Authors are responsible for ensuring their payment and
              tax information is up to date.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              17. Refund and Cancellation Policy
            </h2>
            <p>
              AmberHive’s refund and cancellation policy is applicable only
              where explicitly stated for a specific service or package. Due to
              the nature of digital services, most purchases are non-refundable
              once accessed or delivered. Users are encouraged to read product
              or service details carefully before making a purchase.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              18. Plagiarism and Author Obligations
            </h2>
            <p>
              Authors are solely responsible for ensuring that the work they
              upload or publish on AmberHive is original and does not infringe
              on any third-party rights. Submitting plagiarised or unlawful
              content may result in account suspension, removal of content, and
              legal liability. AmberHive reserves the right to investigate and
              take appropriate action.
            </p>
          </div>

          <div>
            <h2 className="font-semibold text-lg mb-1">
              19. Third-Party Integrations
            </h2>
            <p>
              AmberHive may integrate with third-party services (e.g., payment
              gateways, ebook readers, analytics providers). While we strive to
              work only with trusted partners, AmberHive is not responsible for
              the privacy practices or terms of use of third-party platforms.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
