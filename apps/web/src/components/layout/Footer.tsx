import Link from 'next/link';
import { Github, Twitter, Linkedin, Youtube, Sparkles } from 'lucide-react';

const footerLinks = {
  platform: [
    { label: 'Browse Courses', href: '/courses' },
    { label: 'Free Courses', href: '/courses?pricing=free' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'For Recruiters', href: '#' },
  ],
  resources: [
    { label: 'Blog', href: '#' },
    { label: 'Help Center', href: '#' },
    { label: 'Community', href: '#' },
    { label: 'Become an Instructor', href: '#' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '#' },
    { label: 'Contact', href: '#' },
    { label: 'Press', href: '#' },
  ],
  legal: [
    { label: 'Terms of Service', href: '#' },
    { label: 'Privacy Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' },
  ],
};

const socialLinks = [
  { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
  { icon: Linkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: Youtube, href: 'https://youtube.com', label: 'YouTube' },
  { icon: Github, href: 'https://github.com', label: 'GitHub' },
];

export function Footer() {
  return (
    <footer className="bg-[#FAF8F5] border-t-2 border-[#1a1a1a]">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-5">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center space-x-1">
              <Sparkles className="h-6 w-6 text-[#F5C94C]" />
              <span className="text-xl font-bold text-[#1a1a1a]" style={{ fontFamily: "'Comic Neue', cursive" }}>
                DXTalent
              </span>
              <Sparkles className="h-4 w-4 text-[#F5C94C]" />
            </Link>
            <p className="mt-4 text-sm text-gray-600">
              Level up your digital skills through gamified learning. Earn recognition, get noticed by recruiters.
            </p>
            <div className="mt-4 flex space-x-3">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#1a1a1a] bg-white text-[#1a1a1a] transition-all hover:-translate-y-0.5 hover:shadow-[2px_2px_0_#1a1a1a]"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Platform Links */}
          <div>
            <h3 className="font-bold text-[#1a1a1a]" style={{ fontFamily: "'Comic Neue', cursive" }}>Platform</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.platform.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#F5C94C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h3 className="font-bold text-[#1a1a1a]" style={{ fontFamily: "'Comic Neue', cursive" }}>Resources</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.resources.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#F5C94C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-bold text-[#1a1a1a]" style={{ fontFamily: "'Comic Neue', cursive" }}>Company</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#F5C94C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-bold text-[#1a1a1a]" style={{ fontFamily: "'Comic Neue', cursive" }}>Legal</h3>
            <ul className="mt-4 space-y-2">
              {footerLinks.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 hover:text-[#F5C94C] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t-2 border-[#1a1a1a] pt-8">
          <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
            <p className="text-sm text-gray-600">
              &copy; {new Date().getFullYear()} DXTalent. All rights reserved.
            </p>
            <p className="text-sm text-gray-600">
              Made with 💛 for learners worldwide
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
