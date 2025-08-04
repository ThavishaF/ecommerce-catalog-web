'use client'

import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Github, Heart } from 'lucide-react'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {/* Company Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">E-Commerce Catalog</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Your trusted destination for high-quality products at unbeatable prices. 
                  We're committed to providing exceptional shopping experiences.
                </p>
              </div>
              
              {/* Contact Info */}
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 text-theme-primary" />
                  <span>thavishafdo@gmail.com</span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                  <Phone className="w-4 h-4 text-theme-primary" />
                  <span>+94 76 263-2433 </span>
                </div>
                <div className="flex items-center justify-center space-x-3 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4 text-theme-primary" />
                  <span>No 18, Upper Indibedda, Moratuwa</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-6">Quick Links</h4>
              <ul className="space-y-3">
                {[
                  { name: 'All Products', href: '/' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Customer Service */}
            <div>
              <h4 className="font-semibold text-foreground mb-6">Customer Service</h4>
              <ul className="space-y-3">
                {[
                  { name: 'Contact Us', href: '/' },
                  { name: 'FAQ', href: '/' },
                  { name: 'Shipping Info', href: '/' },
                  { name: 'Returns', href: '/' },
                  { name: 'Track Order', href: '/track-order' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company & Legal */}
            <div>
              <h4 className="font-semibold text-foreground mb-6">Company</h4>
              <ul className="space-y-3 mb-6">
                {[
                  { name: 'About Us', href: '/' },
                  { name: 'Careers', href: '/' },
                  { name: 'Press', href: '/' },
                  { name: 'Privacy Policy', href: '/' },
                  { name: 'Terms of Service', href: '/' },
                  { name: 'Cookie Policy', href: '/' }
                ].map((link) => (
                  <li key={link.name}>
                    <Link 
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-theme-primary transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>

              {/* Social Media */}
              <div>
                <h4 className="font-medium text-foreground mb-3 text-sm">Follow Us</h4>
                <div className="flex justify-center space-x-3">
                  {[
                    { icon: Facebook, href: 'https://facebook.com', label: 'Facebook' },
                    { icon: Twitter, href: 'https://twitter.com', label: 'Twitter' },
                    { icon: Instagram, href: 'https://instagram.com', label: 'Instagram' },
                    { icon: Github, href: 'https://github.com', label: 'GitHub' }
                  ].map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-8 h-8 bg-muted hover:bg-theme-primary rounded-lg flex items-center justify-center transition-colors duration-200 group"
                      aria-label={social.label}
                    >
                      <social.icon className="w-4 h-4 text-muted-foreground group-hover:text-white" />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>© {currentYear} ThavishaFdo. All rights reserved.</span>
            </div>
            
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <span>Made with</span>
              <Heart className="w-4 h-4 text-red-500 fill-current" />
              <span>using Next.js</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
