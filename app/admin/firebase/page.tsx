'use client';

import { motion } from 'framer-motion';
import { MessageCircle, Users, Shield, Settings, Check, X, Facebook, Twitter, Chrome } from 'lucide-react';
import { useState } from 'react';

export default function FirebaseSettings() {
  const [chatSettings, setChatSettings] = useState({
    enabled: true,
    realTimeSync: true,
    messageNotifications: true,
    fileSharing: true,
    maxFileSize: 10,
    messageHistory: 30
  });

  const [socialLogins, setSocialLogins] = useState([
    {
      id: 1,
      name: 'Google',
      icon: Chrome,
      enabled: true,
      color: 'from-red-500 to-orange-500',
      clientId: 'google-client-id-************************',
      clientSecret: '************************',
      callbackUrl: 'https://eternalbond.com/auth/google/callback'
    },
    {
      id: 2,
      name: 'Facebook',
      icon: Facebook,
      enabled: true,
      color: 'from-blue-600 to-blue-700',
      clientId: 'facebook-app-id-************************',
      clientSecret: '************************',
      callbackUrl: 'https://eternalbond.com/auth/facebook/callback'
    },
    {
      id: 3,
      name: 'Twitter',
      icon: Twitter,
      enabled: false,
      color: 'from-sky-400 to-blue-500',
      clientId: 'twitter-api-key-************************',
      clientSecret: '************************',
      callbackUrl: 'https://eternalbond.com/auth/twitter/callback'
    },
  ]);

  const toggleSocialLogin = (loginId: number) => {
    setSocialLogins(socialLogins.map(login =>
      login.id === loginId ? { ...login, enabled: !login.enabled } : login
    ));
  };

  const toggleChatSetting = (setting: string) => {
    setChatSettings({ ...chatSettings, [setting]: !chatSettings[setting as keyof typeof chatSettings] });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-800">Firebase Integration Settings</h1>
        <p className="text-gray-600 mt-2">Configure Firebase features (UI Only - No Backend)</p>
      </motion.div>

      {/* Chat Settings Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Chat Settings</h2>
              <p className="text-white/80">Configure real-time chat features</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Enable Chat */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Enable Chat System</h3>
              <p className="text-sm text-gray-600">Turn on/off the entire chat functionality</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleChatSetting('enabled')}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                chatSettings.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  chatSettings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </motion.button>
          </div>

          {/* Real-Time Sync */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Real-Time Synchronization</h3>
              <p className="text-sm text-gray-600">Instant message delivery across devices</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleChatSetting('realTimeSync')}
              disabled={!chatSettings.enabled}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                chatSettings.realTimeSync && chatSettings.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  chatSettings.realTimeSync && chatSettings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </motion.button>
          </div>

          {/* Message Notifications */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">Message Notifications</h3>
              <p className="text-sm text-gray-600">Push notifications for new messages</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleChatSetting('messageNotifications')}
              disabled={!chatSettings.enabled}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                chatSettings.messageNotifications && chatSettings.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  chatSettings.messageNotifications && chatSettings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </motion.button>
          </div>

          {/* File Sharing */}
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-semibold text-gray-800">File Sharing</h3>
              <p className="text-sm text-gray-600">Allow users to share images and files</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleChatSetting('fileSharing')}
              disabled={!chatSettings.enabled}
              className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                chatSettings.fileSharing && chatSettings.enabled ? 'bg-green-500' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                  chatSettings.fileSharing && chatSettings.enabled ? 'translate-x-7' : 'translate-x-1'
                }`}
              />
            </motion.button>
          </div>

          {/* Configuration Options */}
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max File Size (MB)
              </label>
              <input
                type="number"
                value={chatSettings.maxFileSize}
                onChange={(e) => setChatSettings({ ...chatSettings, maxFileSize: parseInt(e.target.value) })}
                disabled={!chatSettings.enabled || !chatSettings.fileSharing}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message History (Days)
              </label>
              <input
                type="number"
                value={chatSettings.messageHistory}
                onChange={(e) => setChatSettings({ ...chatSettings, messageHistory: parseInt(e.target.value) })}
                disabled={!chatSettings.enabled}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 disabled:bg-gray-100"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Social Login Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
      >
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-6">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Social Login Settings</h2>
              <p className="text-white/80">Configure third-party authentication</p>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {socialLogins.map((login, index) => (
            <motion.div
              key={login.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <div className={`h-1 bg-gradient-to-r ${login.color}`}></div>
              <div className="p-6">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-12 h-12 bg-gradient-to-r ${login.color} rounded-lg flex items-center justify-center`}>
                      <login.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{login.name} Login</h3>
                      <p className="text-sm text-gray-600">
                        {login.enabled ? 'Active' : 'Inactive'}
                      </p>
                    </div>
                  </div>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    onClick={() => toggleSocialLogin(login.id)}
                    className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${
                      login.enabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        login.enabled ? 'translate-x-7' : 'translate-x-1'
                      }`}
                    />
                  </motion.button>
                </div>

                {/* Configuration */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client ID / App ID
                    </label>
                    <input
                      type="text"
                      value={login.clientId}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Client Secret
                    </label>
                    <input
                      type="password"
                      value={login.clientSecret}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Callback URL
                    </label>
                    <input
                      type="text"
                      value={login.callbackUrl}
                      readOnly
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
                    />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex space-x-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 text-sm"
                  >
                    Edit Configuration
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex-1 px-4 py-2 rounded-lg font-medium text-white text-sm bg-gradient-to-r ${login.color} hover:shadow-lg`}
                  >
                    Test Connection
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Firebase Configuration */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-400 to-red-500 rounded-lg flex items-center justify-center">
            <Settings className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">Firebase Configuration</h3>
        </div>

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">API Key</label>
            <input
              type="text"
              value="AIza************************"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Auth Domain</label>
            <input
              type="text"
              value="eternalbond-app.firebaseapp.com"
              readOnly
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Project ID</label>
              <input
                type="text"
                value="eternalbond-app"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Storage Bucket</label>
              <input
                type="text"
                value="eternalbond-app.appspot.com"
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm"
              />
            </div>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg font-semibold hover:shadow-lg"
        >
          Update Firebase Configuration
        </motion.button>
      </motion.div>

      {/* Info Notice */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-blue-50 border border-blue-200 rounded-xl p-6"
      >
        <div className="flex items-start space-x-3">
          <Shield className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
          <div>
            <h4 className="font-bold text-blue-900 mb-2">Important Notice</h4>
            <p className="text-blue-800 text-sm">
              This is a UI-only demonstration. In production, Firebase configuration should be stored securely 
              in environment variables and never exposed in client-side code. Always use Firebase Security Rules 
              to protect your data and implement proper authentication flows.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
