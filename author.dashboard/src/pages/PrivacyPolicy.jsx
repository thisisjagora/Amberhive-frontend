import React from "react";
import { useNavigate } from "react-router";
import Herobg from "@/assets/hero-bg.png";

const PrivacyPolicy = () => {
  const navigate = useNavigate();
  return (
    <div className="relative">
      <div className="hidden md:block absolute top-0 left-0 z-[-1]">
        <img
          src={Herobg}
          alt="Bottom decorative graphic"
          className="w-[450px] object-contain"
        />
      </div>
      <div className="max-w-3xl mx-auto px-4 py-8 text-gray-800 font-gilroy">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:underline mb-6 cursor-pointer"
        >
          &larr; Back
        </button>

        <h1 className="text-3xl font-bold mb-2">AmberHive Privacy Notice</h1>
        <p className="text-sm text-gray-500 mb-6">
          Effective Date: June 19, 2025
        </p>

        <div className="space-y-6 text-[15px] leading-relaxed">
          <section>
            <h2 className="font-semibold text-lg mb-1">1. Who We Are</h2>
            <p>
              AmberHive is a digital platform operated by Sophos Books Nigeria
              Ltd, designed to empower African writers and connect them with a
              global audience of readers. We are committed to protecting your
              privacy and handling your personal data in accordance with the
              Nigeria Data Protection Regulation (NDPR) and other applicable
              laws.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              2. What Information We Collect
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>
                Personal Identifiers: Full name, email address, phone number,
                gender, etc.
              </li>
              <li>
                Account Information: Username, profile picture, bio, books
                written/read, preferences
              </li>
              <li>
                Transactional Data: Payment information for services and product
                purchases
              </li>
              <li>
                Communication Data: Messages, support tickets, newsletters,
                surveys
              </li>
              <li>
                Technical Data: IP address, device type, browser type, cookies,
                usage data
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              3. How We Use Your Information
            </h2>
            <p>Your data helps us to:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Create and manage user accounts</li>
              <li>
                Deliver services such as book publishing, purchases, and
                subscriptions
              </li>
              <li>
                Facilitate author-reader engagement and platform interactions
              </li>
              <li>Improve our platform, features, and user experience</li>
              <li>Provide customer service and resolve issues</li>
              <li>
                Send platform updates, news, and promotional offers (if opted
                in)
              </li>
              <li>Comply with regulatory or legal obligations</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              4. Legal Basis for Processing
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Consent</li>
              <li>Contractual necessity</li>
              <li>Legal compliance</li>
              <li>Legitimate interest</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              5. Who We Share Your Information With
            </h2>
            <p>We do not sell your data to anyone. We may share it with:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Trusted service providers</li>
              <li>Regulators or law enforcement</li>
              <li>Internal staff</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              6. Cross-Border Transfers
            </h2>
            <p>
              Where personal data is transferred outside Nigeria, we ensure
              adequate safeguards are in place.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              7. Your Rights Under NDPR
            </h2>
            <ul className="list-disc list-inside space-y-1">
              <li>Access your personal data</li>
              <li>Correct or update inaccurate data</li>
              <li>Request deletion</li>
              <li>Withdraw consent</li>
              <li>Object to processing</li>
              <li>Lodge a complaint with NITDA</li>
            </ul>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">8. Data Security</h2>
            <p>
              We apply reasonable measures to protect your personal data from
              loss, misuse, or unauthorised access.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">9. Data Retention</h2>
            <p>
              We retain data only as long as necessary for the purposes
              collected or required by law.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              10. Cookies and Tracking
            </h2>
            <p>
              We may use cookies to enhance your experience. Cookie settings can
              be managed via your browser.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">
              11. Changes to This Privacy Notice
            </h2>
            <p>
              We may update this Privacy Notice and will notify users of
              significant changes.
            </p>
          </section>

          <section>
            <h2 className="font-semibold text-lg mb-1">12. Contact Us</h2>
            <p>
              📧{" "}
              <a
                href="mailto:privacy@sophosbooks.com"
                className="text-blue-600 underline"
              >
                privacy@sophosbooks.com
              </a>
              <br />
              📍 Sophos Books Nig Ltd
              <br />
              Sophos House, 11 Aba Agbopa, Ido, Ibadan, Oyo State
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
