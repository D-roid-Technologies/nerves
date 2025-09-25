// Footer.tsx
import React from "react";
import "./Footer.css";
import {
  FaFacebook,
  FaGithub,
  FaInstagramSquare,
  FaLinkedin,
} from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { con_stants } from "../../../utils/constants";

interface FooterLink {
  name: string;
  href: string;
}

interface FooterLinkGroup {
  title: string;
  links: FooterLink[];
}

interface SocialLink {
  name: string;
  href: string;
  icon: React.ReactNode;
}

const Footer: React.FC = () => {
  const footerLinks: FooterLinkGroup[] = [
    {
      title: "Company",
      links: [
        { name: "About", href: "/aboutus" },
        { name: "Twitter", href: "https://x.com/technologi73683" },
      ],
    },
    {
      title: "Help Center",
      links: [
        { name: "FAQ", href: "/faq" },
        { name: "Contact Us", href: "/contact" },
      ],
    },
    {
      title: "Legal",
      links: [
        { name: "Privacy Policy", href: "/privacy-policy" },
        { name: "Terms", href: "/terms-and-conditions" },
      ],
    },
  ];

  const socialLinks: SocialLink[] = [
    {
      name: "Facebook",
      href: "https://www.facebook.com/droidtechltd/?locale=eo_EO",
      icon: <FaFacebook />,
    },
    {
      name: "Twitter",
      href: "https://x.com/technologi73683",
      icon: <FaXTwitter />,
    },
    {
      name: "Instagram",
      href: "https://www.instagram.com/droidtechn/",
      icon: <FaInstagramSquare />,
    },
    {
      name: "LinkedIn",
      href: "https://www.linkedin.com/company/d-roid-technologies-international/",
      icon: <FaLinkedin />,
    },
    {
      name: "GitHub",
      href: "https://github.com/D-roid-Technologies",
      icon: <FaGithub />,
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-brand">
          <h2 className="footer-logo">Nerve Systems Network Ltd</h2>
          <p className="footer-description">All you need when you need it.</p>
          <div className="footer-social">
            {socialLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="social-link"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-links">
          {footerLinks.map((group, index) => (
            <div key={index} className="link-group">
              <h3 className="link-group-title">{group.title}</h3>
              <ul className="link-list">
                {group.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a href={link.href} className="footer-link">
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">
          &copy; {new Date().getFullYear()} Nerve Systems Network Ltd. All
          rights reserved. Version {con_stants.app_version}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
