import React from "react";
import { FileText } from "lucide-react";
import styles from "./shared.module.css";

const TermsAndConditions: React.FC = () => {
  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <FileText size={32} />
        <h1 className={styles.pageH1}>Terms and Conditions</h1>
      </div>

      <div className={styles.pageSection}>
        <p className={styles.contentText}>
          Last updated: {new Date().getFullYear()}
        </p>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>1. Acceptance of Terms</h2>
          <p className={styles.contentText}>
            By accessing and using Nerve Systems Network Ltd's services, you
            accept and agree to be bound by the terms and provisions of this
            agreement.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>2. Use License</h2>
          <p className={styles.contentText}>
            Permission is granted to temporarily use our services for personal,
            non-commercial transitory viewing only. This is the grant of a
            license, not a transfer of title.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>3. Account Registration</h2>
          <p className={styles.contentText}>
            When you create an account with us, you must provide accurate and
            complete information. You are responsible for safeguarding your
            account credentials.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>4. Products and Services</h2>
          <p className={styles.contentText}>
            All products and services are subject to availability. We reserve
            the right to discontinue any product or service at any time. Prices
            are subject to change without notice.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>5. Payments and Billing</h2>
          <p className={styles.contentText}>
            You agree to pay all charges at the prices then in effect for your
            purchases. We reserve the right to correct any errors in pricing.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>6. Returns and Refunds</h2>
          <p className={styles.contentText}>
            Please review our return policy which is part of these Terms.
            Certain products may have different return policies.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>7. User Conduct</h2>
          <p className={styles.contentText}>
            You agree not to use the service to:
          </p>
          <ul className={styles.legalList}>
            <li className={styles.legalListItem}>
              Violate any laws or regulations
            </li>
            <li className={styles.legalListItem}>
              Infringe upon the rights of others
            </li>
            <li className={styles.legalListItem}>
              Interfere with or disrupt the service
            </li>
            <li className={styles.legalListItem}>
              Upload malicious code or viruses
            </li>
          </ul>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>8. Limitation of Liability</h2>
          <p className={styles.contentText}>
            In no event shall Nerve Systems Network Ltd be liable for any
            indirect, incidental, special, consequential or punitive damages
            resulting from your use of our services.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>9. Changes to Terms</h2>
          <p className={styles.contentText}>
            We reserve the right to modify these terms at any time. We will
            notify users of any material changes through our website or via
            email.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>10. Governing Law</h2>
          <p className={styles.contentText}>
            These terms shall be governed by and construed in accordance with
            the laws of Nigeria, without regard to its conflict of law
            provisions.
          </p>
        </div>

        <div className={styles.legalSection}>
          <h2 className={styles.pageH2}>11. Contact Information</h2>
          <p className={styles.contentText}>
            Questions about these Terms should be sent to us at
            legal@nervesystemsnetwork.com.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
