import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";

const footerConfig = {
  brand: {
    name: "TaxiLog UK ",
    description:
      "Professional vehicle inspection software trusted by drivers and fleet managers.",
    logo: { width: 144, height: 48 },
  },
  navigation: [
    {
      id: "product",
      title: "Product",
      links: [
        {
          name: "Features",
          href: "/features",
          ariaLabel: "View product features",
        },
        {
          id: "pricing",
          name: "Pricing",
          href: "#pricing",
          ariaLabel: "View pricing plans",
        },
        {
          id: "testimonials",
          name: "Testimonials",
          href: "#testimonials",
          ariaLabel: "View testimonials",
        },
      ],
    },
    {
      id: "company",
      title: "Company",
      links: [
        {
          id: "about",
          name: "About Us",
          href: "/about-us",
          ariaLabel: "About Us",
        },
        {
          id: "contact",
          name: "Contact Us",
          href: "/contact-us",
          ariaLabel: "Contact Us",
        },
      ],
    },
    {
      id: "support",
      title: "Support",
      links: [
        {
          id: "cookie",
          name: "Cookie Policy",
          href: "/taxiLog-cookieSystem",
          ariaLabel: "Cookie Policy",
        },
        {
          id: "privacy",
          name: "Privacy Policy",
          href: "/privacy-policy",
          ariaLabel: "Privacy Policy",
        },
        {
          id: "terms",
          name: "Terms of Service",
          href: "/termsOf-service",
          ariaLabel: "Terms of Service",
        },
      ],
    },
  ],
  copyright: {
    year: new Date().getFullYear(),
    company: "TaxiLog UK",
    text: "All rights reserved.",
  },
};

const FooterLink = React.memo(({ link, className = "" }) => {
  const isHash = link.href.startsWith("#");
  return isHash ? (
    <HashLink
      smooth
      to={`/${link.href}`}
      aria-label={link.ariaLabel}
      className={`focus:ring-opacity-50 inline-flex items-center rounded-sm px-0 py-2.5 text-base font-normal text-white transition-all duration-300 ease-in-out hover:translate-x-1 hover:text-gray-200 focus:ring-2 focus:ring-white focus:outline-none ${className}`}
    >
      {link.name}
    </HashLink>
  ) : (
    <Link
      to={link.href}
      aria-label={link.ariaLabel}
      className={`focus:ring-opacity-50 inline-flex items-center rounded-sm px-0 py-2.5 text-base font-normal text-white transition-all duration-300 ease-in-out hover:translate-x-1 hover:text-gray-200 focus:ring-2 focus:ring-white focus:outline-none ${className}`}
    >
      {link.name}
    </Link>
  );
});

FooterLink.displayName = "FooterLink";

const FooterColumn = React.memo(({ column }) => (
  <nav className="flex flex-col" aria-labelledby={`${column.id}-heading`}>
    <h3
      id={`${column.id}-heading`}
      className="mb-1 py-2.5 text-base font-semibold text-white"
    >
      {column.title}
    </h3>
    <ul className="m-0 list-none space-y-0 p-0">
      {column.links.map((link, idx) => (
        <li key={idx}>
          <FooterLink link={link} />
        </li>
      ))}
    </ul>
  </nav>
));
FooterColumn.displayName = "FooterColumn";

const BrandLogo = React.memo(({ brand }) => (
  <div className="flex w-full max-w-sm flex-col items-start justify-center gap-6 md:w-auto">
    <Link to="/" className="rounded-xl border border-white/20">
      <img
        className="h-12 w-36"
        src="/image/Logo.png"
        alt={`${brand.name} logo`}
      />
    </Link>
  </div>
));
BrandLogo.displayName = "BrandLogo";

const FooterStyle = React.memo(() => {
  const { brand, navigation, copyright } = footerConfig;
  return (
    <footer
      className="w-full bg-black"
      role="contentinfo"
      aria-label="Site footer"
    >
      <div id="features" className="absolute"></div>
      <div id="pricing" className="absolute"></div>
      <div id="testimonials" className="absolute"></div>

      <div className="mx-auto w-full max-w-screen-xl px-6 py-16 font-['Roboto'] sm:px-8 sm:py-20 lg:px-24 lg:py-24">
        <div className="mx-auto w-full max-w-[1129px]">
          <div className="mb-10 flex flex-col gap-4 md:gap-12 lg:flex-row lg:items-start lg:justify-between lg:gap-32">
            {/* Brand Section */}
            <div className="flex w-full flex-col items-start gap-6 md:gap-9 lg:w-72 lg:flex-shrink-0">
              <BrandLogo brand={brand} />
              <p className="text-left text-base leading-7 font-normal text-white">
                {brand.description}
              </p>
            </div>

            {/* Navigation */}
            <div className="flex w-full flex-col items-start justify-start gap-8 sm:flex-row sm:gap-12 lg:gap-28">
              {navigation.map((col) => (
                <div
                  key={col.id}
                  className="w-full min-w-[112px] text-base font-semibold sm:w-auto"
                >
                  <FooterColumn column={col} />
                </div>
              ))}
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-5">
            <p className="text-center text-base leading-normal font-normal text-white">
              © {copyright.year} {copyright.company}. {copyright.text}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
});
FooterStyle.displayName = "FooterStyle";

export default FooterStyle;
