import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-[#121212] text-[#FAF9F6] border-t border-[#262626] pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-[#262626]">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <span className="font-serif text-2xl font-bold tracking-[0.25em] uppercase text-[#FAF9F6]">
              FITSYNC
            </span>
            <p className="text-xs text-[#9B9A93] leading-relaxed font-light">
              “Measure once. Find your size everywhere.”
            </p>
            <p className="text-xs text-[#6E6D68] leading-relaxed">
              Eliminating the ambiguity of vanity sizing through verified garment ease
              curves and body-data calibration.
            </p>
          </div>

          {/* Directory */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#FAF9F6] font-medium">
              Featured Brand Charts
            </h4>
            <ul className="space-y-2 text-xs text-[#9B9A93]">
              <li>
                <Link href="/finder?brand=zara" className="hover:text-white transition-colors">
                  Zara Size Calculator
                </Link>
              </li>
              <li>
                <Link href="/finder?brand=uniqlo" className="hover:text-white transition-colors">
                  Uniqlo LifeWear Charts
                </Link>
              </li>
              <li>
                <Link href="/finder?brand=levis" className="hover:text-white transition-colors">
                  Levi’s Denim Waist Engine
                </Link>
              </li>
              <li>
                <Link href="/finder?brand=hm" className="hover:text-white transition-colors">
                  H&M Standard Guide
                </Link>
              </li>
              <li>
                <Link href="/finder?brand=nike" className="hover:text-white transition-colors">
                  Nike Athletic Cut Matcher
                </Link>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div className="space-y-3">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#FAF9F6] font-medium">
              Platform & Science
            </h4>
            <ul className="space-y-2 text-xs text-[#9B9A93]">
              <li>
                <Link href="/onboarding" className="hover:text-white transition-colors">
                  Measurement Methodology
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-white transition-colors">
                  Garment Ease vs Body Tape
                </Link>
              </li>
              <li>
                <Link href="/brands" className="hover:text-white transition-colors">
                  Brand Discrepancy Index
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="hover:text-white transition-colors">
                  Private Profile Vault
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter / Integrity */}
          <div className="space-y-4">
            <h4 className="text-[11px] uppercase tracking-[0.2em] text-[#FAF9F6] font-medium">
              Data Integrity
            </h4>
            <p className="text-xs text-[#9B9A93] leading-relaxed">
              We never fabricate brand sizing. Recommendations are derived from verified
              dimensional grading charts and transparent garment ease calculations.
            </p>
            <div className="pt-2">
              <span className="inline-block text-[10px] uppercase tracking-[0.2em] px-2.5 py-1 border border-[#3A3A3A] text-[#D8D6CF]">
                Verified Fashion Engine 2.4
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#6E6D68] space-y-4 sm:space-y-0">
          <p>© 2026 FITSYNC Inc. All rights reserved.</p>
          <div className="flex space-x-6">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
            <span className="hover:text-white cursor-pointer transition-colors">Size Verification API</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
