'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';
import PetalAnimation from '@/components/animations/PetalAnimation';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from '@/context/LanguageProvider';

export default function ContactPage() {
  const { toast } = useToast();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Thank you for contacting us! ✨",
      description: "We have received your message and will get back to you soon.",
      className: "bg-green-50 border-green-500 text-green-900",
    });
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen pt-16 relative overflow-x-hidden">
      <PetalAnimation />

      <div className="relative z-10 bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50 py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-3 sm:mb-4 px-2">
              {t('CONTACT_GET_IN_TOUCH')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-4 sm:px-6 leading-relaxed">
              {t('CONTACT_DESC')}
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 max-w-sm sm:max-w-md lg:max-w-none mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-golden-100">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                  {t('SEND_US_MESSAGE')}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('YOUR_NAME')}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t('YOUR_NAME')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('EMAIL_ADDRESS')}
                    </label>
                    <input
                      type="email"
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('SUBJECT')}
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500"
                      value={formData.subject}
                      onChange={(e) =>
                        setFormData({ ...formData, subject: e.target.value })
                      }
                      placeholder={t('SUBJECT')}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                      {t('MESSAGE')}
                    </label>
                    <textarea
                      required
                      rows={4}
                      className="w-full px-3 py-2 sm:px-4 sm:py-3 text-sm border border-golden-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-golden-500 resize-none"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      placeholder="Tell us more about your inquiry..."
                    />
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full bg-gradient-to-r from-golden-500 to-golden-500 text-white py-3 sm:py-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{t('SEND_MESSAGE')}</span>
                  </motion.button>
                </form>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl p-4 sm:p-6 lg:p-8 border border-golden-100">
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
                  {t('CONTACT_INFORMATION')}
                </h2>

                <div className="space-y-4 sm:space-y-6">
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-golden-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Mail className="w-5 h-5 sm:w-6 sm:h-6 text-golden-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                        {t('EMAIL_US')}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm break-words">support@kalyanautsava.com</p>
                      <p className="text-gray-600 text-xs sm:text-sm break-words">info@kalyanautsava.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-golden-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <Phone className="w-5 h-5 sm:w-6 sm:h-6 text-golden-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                        {t('CALL_US')}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">+1 (555) 123-4567</p>
                      <p className="text-gray-600 text-xs sm:text-sm">Mon-Fri, 9am-6pm EST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className="bg-golden-100 p-2 sm:p-3 rounded-full flex-shrink-0">
                      <MapPin className="w-5 h-5 sm:w-6 sm:h-6 text-golden-600" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-gray-800 mb-1 text-sm sm:text-base">
                        {t('VISIT_US')}
                      </h3>
                      <p className="text-gray-600 text-xs sm:text-sm">
                        123 Love Street, Suite 100
                        <br />
                        New York, NY 10001
                        <br />
                        United States
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
