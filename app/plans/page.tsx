'use client';

import { motion } from 'framer-motion';
import { Check, Crown, Heart, Star, Sparkles } from 'lucide-react';
import Link from 'next/link';
import PetalAnimation from '@/components/animations/PetalAnimation';

export default function PlansPage() {
  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: '/month',
      description: 'Perfect for getting started',
      icon: Heart,
      features: [
        'Create Profile',
        'View 5 Profiles Daily',
        'Send 2 Interest Requests',
        'Basic Search Filters',
        'Email Support',
      ],
      color: 'from-gray-400 to-gray-500',
      popular: false,
    },
    {
      name: 'Silver',
      price: '$29',
      period: '/month',
      description: 'Best for serious seekers',
      icon: Star,
      features: [
        'Everything in Free',
        'View Unlimited Profiles',
        'Send 50 Interest Requests',
        'Advanced Search Filters',
        'Chat with Matches',
        'Priority Support',
        'Profile Highlighted',
      ],
      color: 'from-rose-400 to-golden-500',
      popular: true,
    },
    {
      name: 'Gold',
      price: '$49',
      period: '/month',
      description: 'Premium experience',
      icon: Crown,
      features: [
        'Everything in Silver',
        'Unlimited Interest Requests',
        'Video Call Feature',
        'Profile Verification Badge',
        'Top Profile Position',
        'Dedicated Relationship Manager',
        'Premium Support 24/7',
        'Exclusive Events Access',
      ],
      color: 'from-amber-400 to-yellow-500',
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen pt-16 relative">
      <PetalAnimation />

      <div className="relative z-10 bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center space-x-2 bg-red-50 px-4 py-2 rounded-full mb-6"
            >
              <Sparkles className="w-4 h-4 text-red-700" />
              <span className="text-red-700 text-sm font-medium">
                Choose Your Perfect Plan
              </span>
            </motion.div>

            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Find Love with the{' '}
              <span className="bg-gradient-to-r from-golden-500 to-golden-500 bg-clip-text text-transparent">
                Right Plan
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Select a plan that fits your needs and start your journey to finding your perfect match
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className={`relative bg-white rounded-3xl shadow-xl border-2 overflow-hidden ${
                  plan.popular ? 'border-rose-500 scale-105' : 'border-golden-100'
                }`}
              >
                {plan.popular && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-golden-500 to-golden-500 text-white px-6 py-2 text-sm font-semibold rounded-bl-2xl">
                    Most Popular
                  </div>
                )}

                <div className="p-8">
                  <div
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${plan.color} mb-6`}
                  >
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-800 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-800">
                      {plan.price}
                    </span>
                    <span className="text-gray-600">{plan.period}</span>
                  </div>

                  <Link href="/register">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-full font-semibold transition-all duration-200 ${
                        plan.popular
                          ? 'bg-gradient-to-r from-golden-500 to-golden-500 text-white shadow-lg hover:shadow-xl'
                          : 'bg-pink-100 text-golden-600 hover:bg-pink-200'
                      }`}
                    >
                      Get Started
                    </motion.button>
                  </Link>

                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-golden-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
