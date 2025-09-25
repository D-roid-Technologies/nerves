import React from "react";
import { HelpCircle } from "lucide-react";
import styles from "./shared.module.css";

const FAQ: React.FC = () => {
  const faqs = [
    {
      question: "How do I create an account?",
      answer:
        "Click on the 'Sign Up' button in the top right corner, fill in your details, and verify your email address to get started.",
    },
    {
      question: "What payment methods do you accept?",
      answer:
        "We accept various payment methods including credit/debit cards, bank transfers, and mobile money payments.",
    },
    {
      question: "How can I track my order?",
      answer:
        "You can track your order from your account dashboard under the 'Order Status' section. You'll receive regular updates via email and SMS.",
    },
    {
      question: "What is your return policy?",
      answer:
        "We offer a 30-day return policy for most items. Products must be in original condition with all tags attached. Some items may have specific return conditions.",
    },
    {
      question: "How long does shipping take?",
      answer:
        "Shipping times vary based on your location and the shipping method chosen. Standard shipping takes 5-7 business days, express takes 2-3 days, and overnight shipping delivers the next business day.",
    },
    {
      question: "Do you ship internationally?",
      answer:
        "Currently, we ship within Nigeria only. We're working on expanding our shipping services to other countries in the near future.",
    },
    {
      question: "How can I contact customer support?",
      answer:
        "You can reach our customer support team through the contact form on this page, via email at support@nervesystemsnetwork.com, or by phone at +234-XXX-XXXX.",
    },
    {
      question: "Are my personal details secure?",
      answer:
        "Yes, we take data security seriously. All personal information is encrypted and stored securely. We never share your data with third parties without your consent.",
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <HelpCircle size={32} />
        <h1 className={styles.pageH1}>Frequently Asked Questions</h1>
      </div>

      <div className={styles.pageSection}>
        <p className={styles.contentText}>
          Find answers to common questions about our services, orders, payments,
          and more. If you can't find what you're looking for, please don't
          hesitate to contact us.
        </p>

        <div className={styles.faqList}>
          {faqs.map((faq, index) => (
            <div key={index} className={styles.faqItem}>
              <h3 className={styles.faqQuestion}>{faq.question}</h3>
              <p className={styles.faqAnswer}>{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.pageSection}>
        <h2 className={styles.pageH2}>Still Need Help?</h2>
        <p className={styles.contentText}>
          Can't find the answer you're looking for? Our customer support team is
          here to help you.
        </p>
        <a
          href="/contact"
          className={styles.submitButton}
          style={{ display: "inline-block", textDecoration: "none" }}
        >
          Contact Support
        </a>
      </div>
    </div>
  );
};

export default FAQ;
