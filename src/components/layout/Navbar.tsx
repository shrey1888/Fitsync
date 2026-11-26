'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useFitSync } from '@/lib/store/useFitStore';
import { ArrowRight } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { measurements, isLoaded } = useFitSync();

  const navLinks = [
    { label: 'Size Finder', href: '/finder' },
    { label: 'Translate', href: '/translate' },
    { label: 'Brand Directory', href: '/brands' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'Dashboard', href: '/dashboard' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#E8E6DF] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo */}
          <Link href="/" className="group flex items-center space-x-3">
            <span className="w-8 h-8 rounded-none border border-[#121212] flex items-center justify-center font-serif text-sm font-semibold tracking-tighter bg-[#121212] text-[#FAF9F6] group-hover:bg-transparent group-hover:text-[#121212] transition-colors duration-300">
              FS
            </span>
            <div className="flex flex-col">
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-[0.22em] text-[#121212] uppercase leading-none">
                FITSYNC
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] text-[#6E6D68] mt-1 hidden sm:block">
                Universal Size Engine
              </span>
            </div>
          </Link>

          {/* Nav links (desktop) */}
          <nav className="hidden xl:flex items-center space-x-7" aria-label="Primary">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  className={`text-xs uppercase tracking-[0.18em] whitespace-nowrap transition-all duration-200 py-1 relative ${
                    isActive
                      ? 'text-[#121212] font-semibold'
                      : 'text-[#6E6D68] hover:text-[#121212]'
                  }`}
                >
                  {link.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-[#121212]" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action buttons */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            {isLoaded && measurements ? (
              <Link
                href="/dashboard"
                title="Chest / waist on your saved profile"
                className="hidden sm:inline-flex items-center space-x-2 text-xs border border-[#E8E6DF] bg-white px-3 py-2 text-[#121212] hover:border-[#121212] transition-colors"
              >
                <span className="w-2 h-2 rounded-full bg-emerald-700 animate-pulse" />
                <span className="font-mono text-[11px] text-[#6E6D68] whitespace-nowrap">
                  {measurements.chest}cm / {measurements.waist}cm
                </span>
                <span className="hidden 2xl:inline text-[#121212] font-medium pl-1 border-l border-[#E8E6DF]">
                  Profile Ready
                </span>
              </Link>
            ) : null}

            <Link
              href="/onboarding"
              className="inline-flex items-center justify-center whitespace-nowrap px-4 py-2.5 sm:px-5 sm:py-2.5 text-xs uppercase tracking-[0.16em] bg-[#121212] text-[#FAF9F6] border border-[#121212] hover:bg-[#2B2B2B] transition-all duration-200 shadow-sm group"
            >
              <span>{measurements ? 'Edit Profile' : 'Measure Once'}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-2 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Nav links (phones & tablets): a scrollable strip instead of hiding navigation entirely */}
      <nav
        className="xl:hidden border-t border-[#E8E6DF] overflow-x-auto"
        aria-label="Primary"
      >
        <div className="flex items-center gap-6 px-4 sm:px-6 py-2.5 min-w-max">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[11px] uppercase tracking-[0.16em] whitespace-nowrap py-0.5 border-b ${
                  isActive ? 'text-[#121212] font-semibold border-[#121212]' : 'text-[#6E6D68] border-transparent'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </nav>
    </header>
  );
}

