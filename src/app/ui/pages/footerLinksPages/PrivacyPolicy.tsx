import React from "react";
import { Shield } from "lucide-react";
import styles from "./shared.module.css";

const PrivacyPolicy: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <Shield size={32} />
        <h1 className={styles.pageH1}>Privacy Policy</h1>
      </div>

      <div className={styles.pageSection}>
        <p className={styles.contentText}>
          Last updated: {new Date().getFullYear()}
        </p>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>1. Information We Collect</h2>
          <p className={styles.contentText}>
            We collect information that you provide directly to us when you use
            our services, including:
          </p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              Personal identification information (name, email address, phone
              number)
            </li>
            <li className={styles.legalListItem}>
              Account credentials and preferences
            </li>
            <li className={styles.legalListItem}>
              Payment and transaction information
            </li>
            <li className={styles.legalListItem}>
              Communication and customer support data
            </li>
            <li className={styles.legalListItem}>Technical and usage data</li>
          </ul>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>2. How We Use Your Information</h2>
          <p className={styles.contentText}>
            We use the information we collect to:
          </p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              Provide, maintain, and improve our services
            </li>
            <li className={styles.legalListItem}>
              Process transactions and send related information
            </li>
            <li className={styles.legalListItem}>
              Send you technical notices and support messages
            </li>
            <li className={styles.legalListItem}>
              Respond to your comments and questions
            </li>
            <li className={styles.legalListItem}>
              Detect, prevent, and address technical issues
            </li>
          </ul>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>3. Information Sharing</h2>
          <p className={styles.contentText}>
            We do not sell, trade, or rent your personal identification
            information to others. We may share generic aggregated demographic
            information not linked to any personal identification information
            regarding visitors and users with our business partners and trusted
            affiliates.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>4. Data Security</h2>
          <p className={styles.contentText}>
            We implement appropriate security measures to protect your personal
            information against unauthorized access, alteration, disclosure, or
            destruction. However, no method of transmission over the Internet or
            electronic storage is 100% secure.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>5. Your Rights</h2>
          <p className={styles.contentText}>You have the right to:</p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              Access and receive a copy of your personal data
            </li>
            <li className={styles.legalListItem}>
              Rectify or update your personal data
            </li>
            <li className={styles.legalListItem}>
              Request deletion of your personal data
            </li>
            <li className={styles.legalListItem}>
              Object to processing of your personal data
            </li>
            <li className={styles.legalListItem}>Data portability</li>
          </ul>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>6. Contact Us</h2>
          <p className={styles.contentText}>
            If you have any questions about this Privacy Policy, please contact
            us at privacy@nervesystemsnetwork.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
