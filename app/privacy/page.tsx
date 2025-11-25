'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, CheckCircle } from 'lucide-react';
import { useTranslation } from '@/context/LanguageProvider';

export default function PrivacyPage() {
  const { t } = useTranslation();
  return (
    <div className="min-h-screen pt-16 bg-gradient-to-b from-golden-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-golden-500 to-golden-500 rounded-full mb-6"
          >
            <Shield className="w-8 h-8 text-white" />
          </motion.div>

          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent">
              {t('PRIVACY_POLICY_TITLE')}
            </span>
          </h1>
          <p className="text-gray-600">{t('LAST_UPDATED')}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-golden-100"
        >
          <div className="prose prose-lg max-w-none">
            <div className="mb-8">
              <p className="text-gray-700 leading-relaxed">
                At Kalyanautsava, we take your privacy seriously. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use
                our matrimonial service. Please read this privacy policy carefully.
              </p>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-golden-100 p-2 rounded-full">
                    <Eye className="w-5 h-5 text-golden-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t('INFORMATION_WE_COLLECT')}
                  </h2>
                </div>
                <div className="ml-12">
                  <p className="text-gray-700 mb-4">
                    We collect information that you provide directly to us, including:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Personal details (name, age, gender, contact information)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Profile information (photos, bio, preferences)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Educational and professional background</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Communication data (messages, interactions)</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Payment and billing information</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="bg-golden-100 p-2 rounded-full">
                    <Lock className="w-5 h-5 text-golden-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {t('HOW_WE_USE')}
                  </h2>
                </div>
                <div className="ml-12">
                  <p className="text-gray-700 mb-4">
                    We use the information we collect to:
                  </p>
                  <ul className="space-y-2 text-gray-700">
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Provide, maintain, and improve our services</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Match you with compatible partners</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Process your transactions and subscriptions</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Send you updates, notifications, and promotional materials</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Respond to your inquiries and provide customer support</span>
                    </li>
                    <li className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                      <span>Ensure security and prevent fraud</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('DATA_SECURITY')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We implement appropriate technical and organizational security measures
                  to protect your personal information against unauthorized access,
                  alteration, disclosure, or destruction. However, no method of
                  transmission over the Internet is 100% secure, and we cannot guarantee
                  absolute security.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('INFORMATION_SHARING')}
                </h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  We do not sell your personal information to third parties. We may share
                  your information only in the following circumstances:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>With your explicit consent</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>With service providers who assist us in operations</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>When required by law or legal process</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>To protect the rights and safety of our users</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('YOUR_RIGHTS')}</h2>
                <p className="text-gray-700 leading-relaxed mb-4">
                  You have the right to:
                </p>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>Access and update your personal information</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>Request deletion of your account and data</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>Opt-out of marketing communications</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                    <span>Request a copy of your data</span>
                  </li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('COOKIES_TRACKING')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We use cookies and similar tracking technologies to enhance your
                  experience on our platform. You can control cookies through your browser
                  settings, but disabling them may affect the functionality of our
                  services.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                  {t('CHANGES_POLICY')}
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you
                  of any changes by posting the new Privacy Policy on this page and
                  updating the "Last updated" date.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('CONTACT_US_TITLE')}</h2>
                <p className="text-gray-700 leading-relaxed">
                  If you have any questions about this Privacy Policy, please contact us
                  at:
                </p>
                <div className="mt-4 p-4 bg-rose-50 rounded-lg">
                  <p className="text-gray-700">
                    <strong>Email:</strong> privacy@kalyanautsava.com
                    <br />
                    <strong>Phone:</strong> +1 (555) 123-4567
                    <br />
                    <strong>Address:</strong> 123 Love Street, Suite 100, New York, NY
                    10001
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
