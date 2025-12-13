'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import api from '@/lib/api';
import { toast } from 'sonner';

// This tells Next.js to render this page dynamically
export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
  const params = useParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = params.token as string;
        
        // Log the token for debugging
        console.log('Verifying email with token:', token);
        
        const response = await api.get(`/auth/verify-email/${token}`);
        
        console.log('Verification response:', response.data);
        
        // Check if it's already verified or newly verified
        const isAlreadyVerified = response.data.message?.includes('already verified');
        
        setStatus('success');
        setMessage(response.data.message || 'Email verified successfully!');
        
        if (isAlreadyVerified) {
          toast.success('Email already verified! You can login now.');
        } else {
          toast.success('Email verified successfully! You can now login.');
        }
        
        // Don't auto-redirect, let user see the success message and click button
      } catch (error: any) {
        console.error('Verification error:', error);
        console.error('Error response:', error.response?.data);
        
        setStatus('error');
        const errorMessage = error.response?.data?.message || 'Email verification failed. The link may be invalid or expired.';
        setMessage(errorMessage);
        toast.error(errorMessage);
      }
    };

    if (params.token) {
      verifyEmail();
    }
  }, [params.token, router]);

  return (
    <div className="min-h-screen pt-16 flex items-center justify-center px-4 bg-gradient-to-br from-golden-50 via-lavender-50 to-golden-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-golden-100 text-center"
      >
        {status === 'loading' && (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <Loader2 className="w-16 h-16 text-golden-600" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Verifying your email...
            </h1>
            <p className="text-gray-600">
              Please wait while we verify your email address.
            </p>
          </>
        )}

        {status === 'success' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-block mb-6"
            >
              <CheckCircle className="w-16 h-16 text-green-500" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {message.includes('already verified') ? 'Already Verified!' : 'Email Verified!'}
            </h1>
            <p className="text-gray-600 mb-6">
              {message}
            </p>
            
            {/* Success tip box */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-green-800 font-semibold mb-2">✅ What's Next?</p>
              <ul className="text-sm text-green-700 space-y-1 list-disc list-inside">
                <li>Your email has been verified successfully</li>
                <li>You can now login with your credentials</li>
                <li>Complete your profile to find your perfect match</li>
              </ul>
            </div>
            
            <Link href="/login">
              <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                Go to Login
              </button>
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="inline-block mb-6"
            >
              <XCircle className="w-16 h-16 text-red-500" />
            </motion.div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-600 mb-6 whitespace-pre-line">
              {message}
            </p>
            
            {/* Show helpful tips based on error */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800 font-semibold mb-2">💡 Possible Solutions:</p>
              <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                {message.includes('expired') && (
                  <>
                    <li>The verification link expires after 24 hours</li>
                    <li>Register again to receive a new verification email</li>
                  </>
                )}
                {message.includes('Invalid') && (
                  <>
                    <li>Make sure you copied the complete link from your email</li>
                    <li>Check if you already verified this email</li>
                    <li>Try logging in if you already have an account</li>
                  </>
                )}
                {message.includes('already verified') && (
                  <li>Your email is already verified - you can login now!</li>
                )}
              </ul>
            </div>
            
            <div className="space-y-3">
              {message.includes('already verified') ? (
                <Link href="/login">
                  <button className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                    Go to Login
                  </button>
                </Link>
              ) : (
                <>
                  <Link href="/register">
                    <button className="w-full bg-gradient-to-r from-golden-500 to-golden-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200">
                      Register Again
                    </button>
                  </Link>
                  <Link href="/login">
                    <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200">
                      Back to Login
                    </button>
                  </Link>
                </>
              )}
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
