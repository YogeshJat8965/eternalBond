'use client';

import { motion } from 'framer-motion';
import { CreditCard, DollarSign, Shield, Settings, Check } from 'lucide-react';
import { useState } from 'react';

export default function PaymentGatewaySettings() {
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: 1,
      name: 'Stripe',
      icon: '💳',
      enabled: true,
      color: 'from-purple-500 to-indigo-500',
      features: ['Credit Cards', 'Debit Cards', 'Digital Wallets'],
      testMode: true,
      apiKey: 'sk_test_************************',
      publishableKey: 'pk_test_************************'
    },
    {
      id: 2,
      name: 'PayPal',
      icon: '🅿️',
      enabled: true,
      color: 'from-blue-500 to-cyan-500',
      features: ['PayPal Balance', 'Credit Cards', 'Bank Transfer'],
      testMode: false,
      clientId: 'AZDxjDScFp**********************',
      clientSecret: 'EM8OBP**********************'
    },
    {
      id: 3,
      name: 'Razorpay',
      icon: '💰',
      enabled: false,
      color: 'from-blue-600 to-blue-700',
      features: ['UPI', 'Cards', 'Net Banking', 'Wallets'],
      testMode: true,
      keyId: 'rzp_test_************************',
      keySecret: '************************'
    },
    {
      id: 4,
      name: 'Bank Transfer',
      icon: '🏦',
      enabled: true,
      color: 'from-green-500 to-emerald-500',
      features: ['Direct Bank Transfer', 'Wire Transfer'],
      testMode: false,
      accountNumber: '****-****-****-1234',
      bankName: 'Bank of America'
    },
  ]);

  const togglePaymentMethod = (methodId: number) => {
    setPaymentMethods(paymentMethods.map(method =>
      method.id === methodId ? { ...method, enabled: !method.enabled } : method
    ));
  };

  const toggleTestMode = (methodId: number) => {
    setPaymentMethods(paymentMethods.map(method =>
      method.id === methodId ? { ...method, testMode: !method.testMode } : method
    ));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Payment Gateway Integration</h1>
        <p className="text-gray-600 mt-2">Configure payment methods and settings (UI Only - No Backend)</p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Active Payment Methods</p>
              <p className="text-3xl font-bold text-gray-800">
                {paymentMethods.filter(m => m.enabled).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Check className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Test Mode Active</p>
              <p className="text-3xl font-bold text-gray-800">
                {paymentMethods.filter(m => m.testMode).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <Settings className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm mb-1">Secure Connections</p>
              <p className="text-3xl font-bold text-gray-800">100%</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-500 rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Payment Methods */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paymentMethods.map((method, index) => (
          <motion.div
            key={method.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 + index * 0.1 }}
            className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
          >
            <div className={`h-2 bg-gradient-to-r ${method.color}`}></div>
            <div className="p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-12 h-12 bg-gradient-to-r ${method.color} rounded-lg flex items-center justify-center text-2xl`}>
                    {method.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">{method.name}</h3>
                    <p className="text-sm text-gray-600">
                      {method.enabled ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => togglePaymentMethod(method.id)}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                    method.enabled ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                      method.enabled ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </motion.button>
              </div>

              {/* Features */}
              <div className="mb-4">
                <p className="text-sm font-semibold text-gray-700 mb-2">Supported Features:</p>
                <div className="flex flex-wrap gap-2">
                  {method.features.map((feature, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>

              {/* Configuration */}
              <div className="space-y-3 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {method.name === 'Bank Transfer' ? 'Account Number' : 'API Key / Client ID'}
                  </label>
                  <input
                    type="text"
                    value={method.apiKey || method.clientId || method.keyId || method.accountNumber}
                    readOnly
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                  />
                </div>
                {method.publishableKey && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Publishable Key
                    </label>
                    <input
                      type="text"
                      value={method.publishableKey}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Test Mode Toggle */}
              {method.name !== 'Bank Transfer' && (
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <Settings className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-700">Test Mode</span>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleTestMode(method.id)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      method.testMode ? 'bg-yellow-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        method.testMode ? 'translate-x-6' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>
              )}

              {/* Actions */}
              <div className="flex space-x-2 mt-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 text-sm"
                >
                  Configure
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex-1 px-4 py-2 rounded-lg font-medium text-white text-sm bg-gradient-to-r ${method.color} hover:shadow-lg`}
                >
                  Test Connection
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Security Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Security & Compliance</h4>
            <p className="text-blue-800 text-sm">
              All payment transactions are encrypted with SSL/TLS. This is a UI-only demonstration. 
              In production, ensure PCI DSS compliance and never store sensitive payment information on your servers. 
              Always use payment gateway webhooks and secure backend validation.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
