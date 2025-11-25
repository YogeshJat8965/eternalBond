'use client';

import Link from 'next/link';
import { Heart, Facebook, Twitter, Instagram, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useTranslation } from '@/context/LanguageProvider';

export default function Footer() {
  const { t } = (() => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const ctx = require('@/context/LanguageProvider');
      return ctx.useTranslation();
    } catch (e) {
      return { t: (k: string) => k } as any;
    }
  })();
  return (
    <footer className="bg-gradient-to-b from-golden-50 to-white border-t border-golden-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image 
                src="/images/logo.png" 
                alt="KalyanautsavaMat Logo" 
                width={96} 
                height={96}
                className="object-contain"
                priority
              />
              <span className="text-xl font-bold text-golden-500">
                {t('BRAND')}
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              {t('FIND_YOUR')}
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">{t('QUICK_LINKS')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-600 hover:text-golden-600 text-sm">
                  {t('HOME_LINK')}
                </Link>
              </li>
              <li>
                <Link href="/members" className="text-gray-600 hover:text-golden-600 text-sm">
                  {t('MEMBERS_LINK')}
                </Link>
              </li>
              <li>
                <Link href="/stories" className="text-gray-600 hover:text-golden-600 text-sm">
                  {t('SUCCESS_STORIES_LINK')}
                </Link>
              </li>
              <li>
                <Link href="/plans" className="text-gray-600 hover:text-golden-600 text-sm">
                  {t('PRICING_LINK')}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">{t('SUPPORT')}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-golden-600 text-sm">
                  {t('CONTACT_US_LINK')}
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-golden-600 text-sm">
                  {t('PRIVACY_POLICY_LINK')}
                </Link>
              </li>
              {/* <li>
                <Link href="/terms" className="text-gray-600 hover:text-golden-600 text-sm">
                  Terms of Service
                </Link>
              </li> */}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-gray-800 mb-4">{t('CONNECT_WITH_US')}</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-600 hover:text-golden-600 transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-golden-600 transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-golden-600 transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="text-gray-600 hover:text-golden-600 transition-colors">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-golden-100 mt-8 pt-8 text-center">
          <p className="text-gray-600 text-sm">
            {t('COPYRIGHT')}{' '}
            <a
              href="https://doitrocket.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-golden-600 hover:text-golden-700 font-semibold underline transition-colors"
            >
              {t('DOITROCKET')}
            </a>
            {' '}{t('FOR_YOU')}
          </p>
        </div>
      </div>
    </footer>
  );
}
