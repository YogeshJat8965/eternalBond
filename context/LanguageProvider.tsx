'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { tamilTranslations } from './translations/tamil';
import { teluguTranslations } from './translations/telugu';

type Lang = 'en' | 'hi' | 'ta' | 'te';

type LangContextType = {
  language: Lang;
  setLanguage: (l: Lang) => void;
  t: (key: string) => string;
};

const translations: Record<Lang, Record<string, string>> = {
  en: {
    BRAND: 'Kalyanautsava',
    HOME: 'Home',
    MEMBERS: 'Members',
    STORIES: 'Success Stories',
    PLANS: 'Plans',
    CONTACT: 'Contact',
    DASHBOARD: 'Dashboard',
    LOGIN: 'Login',
    REGISTER: 'Register',
    FIND_YOUR: 'Find your',
    AND_START_JOURNEY: 'and start your journey to eternal happiness.',
    QUICK_LINKS: 'Quick Links',
    SUPPORT: 'Support',
    CONNECT_WITH_US: 'Connect With Us',
    COPYRIGHT: '© 2025 Kalyanautsava. All rights reserved. Made with',
    DOITROCKET: 'doitrocket',
    
    // Footer links
    HOME_LINK: 'Home',
    MEMBERS_LINK: 'Members',
    SUCCESS_STORIES_LINK: 'Success Stories',
    PRICING_LINK: 'Pricing',
    CONTACT_US_LINK: 'Contact Us',
    PRIVACY_POLICY_LINK: 'Privacy Policy',
    FOR_YOU: 'for you.',
    
    // Home page
    HERO_TAG: 'Trusted by Thousands of Happy Couples',
    PERFECT_MATCH: 'Perfect Match',
    TRUE_LOVE: 'True Love',
    SOULMATE: 'Soulmate',
    FOREVER_PARTNER: 'Forever Partner',
    HERO_SUB: 'Discover meaningful connections and begin your journey to eternal happiness with someone special.',
    QUICK_PARTNER_SEARCH: 'Quick Partner Search',
    SELECT_GENDER: 'Select Gender',
    SELECT_RELIGION: 'Select Religion',
    AGE_FROM: 'Age From',
    AGE_TO: 'Age To',
    SEARCH_NOW: 'Search Now',
    ABOUT_TITLE: 'About Kalyanautsava',
    WHERE_TRUE_LOVE: 'Where True Love Begins',
    ABOUT_DESC: "We're not just a matrimonial platform - we're your trusted partner in finding lifelong happiness",
    FEATURED_PROFILES: 'Featured Profiles',
    MEET_MEMBERS: 'Meet some of our amazing members',
    VIEW_PROFILE: 'View Profile',
    VIEW_ALL_MEMBERS: 'View All Members',
    SUCCESS_STORIES: 'Success Stories',
    REAL_COUPLES: 'Real couples, real happiness',
    STATS_ACTIVE_MEMBERS: 'Active Members',
    STATS_SUCCESS_STORIES: 'Success Stories',
    STATS_YEARS_TRUST: 'Years of Trust',
    
    // Homepage additional
    ABOUT_FOUNDED: 'Founded with a vision to revolutionize the way people find their life partners,',
    ABOUT_COMBINES: 'combines cutting-edge technology with traditional values to create meaningful connections.',
    ABOUT_WITH_OVER: 'With over',
    YEARS_EXPERIENCE: '15 years of experience',
    ABOUT_HELPED: ", we've helped thousands of individuals discover their perfect match. Our advanced matching algorithms, verified profiles, and dedicated support team ensure your journey to finding love is safe, secure, and successful.",
    
    PRIVACY_SECURITY: 'Privacy & Security',
    PRIVACY_DESC: 'Your data is protected with bank-level encryption and strict privacy controls.',
    VERIFIED_PROFILES_TITLE: 'Verified Profiles',
    VERIFIED_DESC: 'All profiles are thoroughly verified to ensure authenticity and genuine connections.',
    SUCCESS_STORIES_TITLE: 'Success Stories',
    SUCCESS_DESC: 'Join thousands of happy couples who found their perfect match through our platform.',
    
    WHAT_MEMBERS_SAY: 'What Our Members Say',
    HEAR_FROM_MEMBERS: 'Hear from thousands of happy members who found their perfect match',
    
    READY_FIND_SOULMATE: 'Ready to Find Your Soulmate?',
    JOIN_HAPPY_COUPLES: 'Join thousands of happy couples who found love through Kalyanautsava',
    GET_STARTED_NOW: 'Get Started Now',
    
    FAQ_TITLE: 'Frequently Asked Questions',
    FAQ_SUBTITLE: 'Everything you need to know about Kalyanautsava',
    STILL_HAVE_QUESTIONS: 'Still have questions?',
    CONTACT_SUPPORT: 'Contact Support',
    FAQ_Q1: 'How does Kalyanautsava work?',
    FAQ_Q2: 'Is Kalyanautsava free to use?',
    FAQ_Q3: 'How do I ensure my profile stands out?',
    FAQ_Q4: 'Is my information safe and secure?',
    FAQ_Q5: 'How long does it take to find a match?',
    FAQ_Q6: 'Can I cancel my subscription anytime?',
    FAQ_Q7: 'What makes Kalyanautsava different from other platforms?',
    FAQ_Q8: 'How do I verify my profile?',
    
    // Testimonials
    TESTIMONIAL_1_NAME: 'Sarah Mitchell',
    TESTIMONIAL_1_CONTENT: 'Kalyanautsava changed my life! The platform is so easy to use, and the matches were spot-on. I met my husband within 3 months of joining. The verification process made me feel safe throughout my journey.',
    TESTIMONIAL_1_ROLE: 'Marketing Manager',
    
    TESTIMONIAL_2_NAME: 'Rahul Sharma',
    TESTIMONIAL_2_CONTENT: 'After trying several matrimonial sites, Kalyanautsava stood out with its genuine profiles and excellent customer support. The video call feature helped us connect before meeting in person. Highly recommended!',
    TESTIMONIAL_2_ROLE: 'Software Engineer',
    
    TESTIMONIAL_3_NAME: 'Maria Garcia',
    TESTIMONIAL_3_CONTENT: 'I was skeptical at first, but the detailed personality matching and compatibility tests really work! Found someone who shares my values and dreams. Thank you for making the search so meaningful and stress-free.',
    TESTIMONIAL_3_ROLE: 'Teacher',
    
    TESTIMONIAL_4_NAME: 'Ahmed Hassan',
    TESTIMONIAL_4_CONTENT: 'The privacy features and family involvement options made this the perfect platform for our community. My parents were able to participate in the process, which was very important to us. Excellent service!',
    TESTIMONIAL_4_ROLE: 'Business Owner',
    
    TESTIMONIAL_5_NAME: 'Emily Chen',
    TESTIMONIAL_5_CONTENT: 'Best investment I ever made! The premium features are worth every penny. The personalized matchmaking service understood exactly what I was looking for. Met my soulmate and couldn\'t be happier!',
    TESTIMONIAL_5_ROLE: 'Doctor',
    
    TESTIMONIAL_6_NAME: 'James Wilson',
    TESTIMONIAL_6_CONTENT: 'Clean interface, real people, and great success rate. What more could you ask for? The team is responsive and genuinely cares about helping people find love. This platform exceeded all my expectations!',
    TESTIMONIAL_6_ROLE: 'Architect',
    
    // Success Stories
    STORY_1_COUPLE: 'Emma & David',
    STORY_1_TEXT: 'We met through Kalyanautsava and it was love at first sight!',
    STORY_1_DATE: 'Married: June 2024',
    STORY_1_LOCATION: 'New York, USA',
    STORY_1_FULL: 'We met on Kalyanautsava in early 2023, and from our very first conversation, we knew there was something special. David\'s sense of humor and Emma\'s warm personality clicked instantly. After months of video calls and meeting in person, we realized we had found our soulmate. Thank you Kalyanautsava for bringing us together!',
    
    STORY_2_COUPLE: 'Sophia & Ryan',
    STORY_2_TEXT: 'Thanks for bringing us together. Best decision ever!',
    STORY_2_DATE: 'Married: March 2024',
    STORY_2_LOCATION: 'Los Angeles, USA',
    STORY_2_FULL: 'Finding love felt impossible until we found Kalyanautsava. The platform\'s detailed matching system helped us discover each other despite living in different cities. Our first date was magical, and we haven\'t looked back since. We\'re now happily married and expecting our first child!',
    
    STORY_3_COUPLE: 'Aisha & Omar',
    STORY_3_TEXT: 'A perfect match made through perfect service. Highly recommended!',
    STORY_3_DATE: 'Married: December 2023',
    STORY_3_LOCATION: 'Dubai, UAE',
    STORY_3_FULL: 'As busy professionals, we struggled to find time for dating. Kalyanautsava made it easy to connect with like-minded individuals. Omar\'s profile stood out immediately, and after our first coffee date, we knew we were meant to be. The journey from strangers to soulmates was beautiful.',
    
    STORY_4_COUPLE: 'Priya & Arjun',
    STORY_4_TEXT: 'Our families are thrilled! We found our perfect match through Kalyanautsava.',
    STORY_4_DATE: 'Married: August 2024',
    STORY_4_LOCATION: 'Mumbai, India',
    STORY_4_FULL: 'Our families had been searching for the perfect match for us for years. When we both joined Kalyanautsava independently, we found each other within weeks. It felt like destiny. Our similar values, dreams, and aspirations aligned perfectly. We couldn\'t be happier!',
    
    STORY_5_COUPLE: 'Isabella & Lucas',
    STORY_5_TEXT: 'Distance was no barrier with Kalyanautsava. Now we\'re building our future together!',
    STORY_5_DATE: 'Married: February 2024',
    STORY_5_LOCATION: 'Barcelona, Spain',
    STORY_5_FULL: 'Long-distance relationships are challenging, but Kalyanautsava gave us the tools to make it work. We video chatted for months before meeting in person, and when we finally did, it exceeded all expectations. Now we\'re building our life together in the same city!',
    
    STORY_6_COUPLE: 'Yuki & Takeshi',
    STORY_6_TEXT: 'From skeptics to believers! Kalyanautsava gave us our happily ever after.',
    STORY_6_DATE: 'Married: May 2024',
    STORY_6_LOCATION: 'Tokyo, Japan',
    STORY_6_FULL: 'Both of us were skeptical about online matrimonial services, but Kalyanautsava changed our minds. The platform\'s emphasis on compatibility and shared values helped us find each other. Our wedding was a beautiful blend of tradition and modern love. Thank you for everything!',
    
    PROFILE_1_NAME: 'Sarah Johnson',
    PROFILE_1_PROFESSION: 'Software Engineer',
    PROFILE_1_LOCATION: 'New York, USA',
    PROFILE_2_NAME: 'Michael Chen',
    PROFILE_2_PROFESSION: 'Doctor',
    PROFILE_2_LOCATION: 'Los Angeles, USA',
    PROFILE_3_NAME: 'Priya Sharma',
    PROFILE_3_PROFESSION: 'Teacher',
    PROFILE_3_LOCATION: 'Mumbai, India',
    PROFILE_4_NAME: 'James Wilson',
    PROFILE_4_PROFESSION: 'Architect',
    PROFILE_4_LOCATION: 'London, UK',
    PROFILE_5_NAME: 'Emily Rodriguez',
    PROFILE_5_PROFESSION: 'Marketing Manager',
    PROFILE_5_LOCATION: 'Toronto, Canada',
    PROFILE_6_NAME: 'David Kim',
    PROFILE_6_PROFESSION: 'Business Analyst',
    PROFILE_6_LOCATION: 'Singapore',
    PROFILE_7_NAME: 'Yuki Tanaka',
    PROFILE_7_PROFESSION: 'Graphic Designer',
    PROFILE_7_LOCATION: 'Tokyo, Japan',
    PROFILE_8_NAME: 'Omar Hassan',
    PROFILE_8_PROFESSION: 'Civil Engineer',
    PROFILE_8_LOCATION: 'Cairo, Egypt',
    RELIGION_CHRISTIANITY: 'Christianity',
    RELIGION_BUDDHISM: 'Buddhism',
    RELIGION_HINDUISM: 'Hinduism',
    RELIGION_ISLAM: 'Islam',
    PREVIOUS: 'Previous',
    NEXT: 'Next',
    VERIFIED_PROFILES: 'Verified Profiles',
    SUPPORT_AVAILABLE: 'Support Available',
    
    // Contact
    CONTACT_GET_IN_TOUCH: 'Get In Touch',
    CONTACT_DESC: 'Have questions or need assistance? We are here to help you find your perfect match.',
    SEND_US_MESSAGE: 'Send Us a Message',
    YOUR_NAME: 'Your Name',
    EMAIL_ADDRESS: 'Email Address',
    SUBJECT: 'Subject',
    MESSAGE: 'Message',
    SEND_MESSAGE: 'Send Message',
    CONTACT_INFORMATION: 'Contact Information',
    EMAIL_US: 'Email Us',
    CALL_US: 'Call Us',
    VISIT_US: 'Visit Us',

    // Find partner
    ADVANCED_PARTNER_SEARCH: 'Advanced Partner Search',
    FIND_YOUR_PERFECT_PARTNER: 'Find Your Perfect Partner',
    SEARCH_FILTERS: 'Search Filters',
    LOOKING_FOR: 'Looking For',
    LOCATION: 'Location',
    PROFESSION: 'Profession',
    MARITAL_STATUS: 'Marital Status',
    EDUCATION_LEVEL: 'Education Level',
    ANNUAL_INCOME: 'Annual Income',
    SEARCH_PARTNERS: 'Search Partners',
    CLEAR_FILTERS: 'Clear Filters',
    SEARCH_RESULTS: 'Search Results',

    // Auth
    WELCOME_BACK: 'Welcome Back',
    SIGN_IN_SUB: 'Sign in to continue your journey to finding love',
    REMEMBER_ME: 'Remember me',
    FORGOT_PASSWORD: 'Forgot password?',
    SIGN_IN: 'Sign In',
    OR_CONTINUE_WITH: 'Or continue with',
    CONTINUE_WITH_GOOGLE: 'Continue with Google',
    DONT_HAVE_ACCOUNT: "Don't have an account?",
    SIGN_UP: 'Sign up',
    
    // Register
    BEGIN_JOURNEY: 'Begin Your Journey',
    CREATE_PROFILE_FIND_MATCH: 'Create your profile and find your perfect match',
    BASIC_INFORMATION: 'Basic Information',
    FULL_NAME: 'Full Name',
    GENDER: 'Gender',
    DATE_OF_BIRTH: 'Date of Birth',
    SELECT: 'Select',
    MALE: 'Male',
    FEMALE: 'Female',
    SECURE_YOUR_ACCOUNT: 'Secure Your Account',
    PASSWORD: 'Password',
    PASSWORD_HINT: 'At least 8 characters with uppercase, lowercase, and numbers',
    CONFIRM_PASSWORD: 'Confirm Password',
    SECURITY_TIPS: 'Security Tips:',
    SECURITY_TIP_1: '• Use a unique password you don\'t use elsewhere',
    SECURITY_TIP_2: '• Enable two-factor authentication after signing up',
    SECURITY_TIP_3: '• Never share your password with anyone',
    VERIFY_YOUR_EMAIL: 'Verify Your Email',
    VERIFICATION_CODE_SENT: 'We\'ve sent a verification code to',
    ENTER_6_DIGIT_CODE: 'Enter 6-Digit Code',
    DIDNT_RECEIVE_CODE: 'Didn\'t receive the code?',
    RESEND: 'Resend',
    BACK: 'Back',
    CONTINUE: 'Continue',
    COMPLETE_REGISTRATION: 'Complete Registration',
    ALREADY_HAVE_ACCOUNT: 'Already have an account?',
    REGISTRATION_SUCCESSFUL: 'Registration Successful!',
    WELCOME_TO: 'Welcome to Kalyanautsava',
    JOURNEY_BEGINS: 'Your journey begins now',

    // Members
    BROWSE_MEMBERS: 'Browse Members',
    FIND_PROFILES_COUNT: 'Find your perfect match from {count} amazing profiles',
    FILTERS: 'Filters',
    AGE_RANGE: 'Age Range',
    FROM: 'From',
    TO: 'To',
    ALL: 'All',
    RELIGION: 'Religion',
    HEIGHT: 'Height',
    APPLY_FILTERS: 'Apply Filters',
    CLEAR_ALL_FILTERS: 'Clear All',
    SHOW_FILTERS: 'Show Filters',
    YOU_LIKED: 'You liked',
    INTEREST_SENT_SUCCESSFULLY: 'Interest sent successfully',
    NEVER_MARRIED: 'Never Married',
    DIVORCED: 'Divorced',
    WIDOWED: 'Widowed',
    CITY_COUNTRY: 'City, Country',
    EG_ENGINEER: 'e.g., Engineer',

    // Plans
    CHOOSE_PLAN_TAG: 'Choose Your Perfect Plan',
    FIND_LOVE_RIGHT_PLAN: 'Find Love with the Right Plan',
    SELECT_PLAN_DESC: 'Select a plan that fits your needs and start your journey to finding your perfect match',
    MOST_POPULAR: 'Most Popular',
    GET_STARTED: 'Get Started',
    
    // Stories
    LOVE_STORIES_THAT: 'Love Stories That',
    INSPIRE_US: 'Inspire Us',
    STORIES_SUBTITLE: 'Real couples, real love stories. Discover how Kalyanautsava helped thousands find their perfect match and begin their journey to eternal happiness.',
    MARRIED: 'Married:',
    READ_MORE: 'Read More',

    // Plans page
    PLAN_FREE_NAME: 'Free',
    PLAN_FREE_DESC: 'Perfect for getting started',
    PLAN_FREE_FEATURE_1: 'Create Profile',
    PLAN_FREE_FEATURE_2: 'View 5 Profiles Daily',
    PLAN_FREE_FEATURE_3: 'Send 2 Interest Requests',
    PLAN_FREE_FEATURE_4: 'Basic Search Filters',
    PLAN_FREE_FEATURE_5: 'Email Support',
    
    PLAN_SILVER_NAME: 'Silver',
    PLAN_SILVER_DESC: 'Best for serious seekers',
    PLAN_SILVER_FEATURE_1: 'Everything in Free',
    PLAN_SILVER_FEATURE_2: 'View Unlimited Profiles',
    PLAN_SILVER_FEATURE_3: 'Send 50 Interest Requests',
    PLAN_SILVER_FEATURE_4: 'Advanced Search Filters',
    PLAN_SILVER_FEATURE_5: 'Chat with Matches',
    PLAN_SILVER_FEATURE_6: 'Priority Support',
    PLAN_SILVER_FEATURE_7: 'Profile Highlighted',
    
    PLAN_GOLD_NAME: 'Gold',
    PLAN_GOLD_DESC: 'Premium experience',
    PLAN_GOLD_FEATURE_1: 'Everything in Silver',
    PLAN_GOLD_FEATURE_2: 'Unlimited Interest Requests',
    PLAN_GOLD_FEATURE_3: 'Video Call Feature',
    PLAN_GOLD_FEATURE_4: 'Profile Verification Badge',
    PLAN_GOLD_FEATURE_5: 'Top Profile Position',
    PLAN_GOLD_FEATURE_6: 'Dedicated Relationship Manager',
    PLAN_GOLD_FEATURE_7: 'Premium Support 24/7',
    PLAN_GOLD_FEATURE_8: 'Exclusive Events Access',
    PLAN_MONTH: '/month',

    // Privacy
    PRIVACY_POLICY_TITLE: 'Privacy Policy',
    LAST_UPDATED: 'Last updated: January 2025',
    INFORMATION_WE_COLLECT: 'Information We Collect',
    HOW_WE_USE: 'How We Use Your Information',
    DATA_SECURITY: 'Data Security',
    INFORMATION_SHARING: 'Information Sharing',
    YOUR_RIGHTS: 'Your Rights',
    COOKIES_TRACKING: 'Cookies and Tracking',
    CHANGES_POLICY: 'Changes to This Policy',
    CONTACT_US_TITLE: 'Contact Us',

    // Dashboard
    STATS_TOTAL_SHORTLISTED: 'Total Shortlisted',
    STATS_INTEREST_SENT: 'Interest Sent',
    STATS_INTEREST_REQUESTS: 'Interest Requests',
    MENU_DASHBOARD: 'Dashboard',
    MENU_PURCHASE_HISTORY: 'Purchase History',
    MENU_GALLERY: 'Gallery',
    MENU_SHORTLIST: 'Shortlist',
    MENU_MY_INTEREST: 'My Interest',
    MENU_INTEREST_REQUEST: 'Interest Request',
    MENU_IGNORED_LISTS: 'Ignored Lists',
    MENU_MESSAGE: 'Message',
    MENU_PROFILE_SETTING: 'Profile Setting',
    MENU_SIGN_OUT: 'Sign Out',
    
    COMPLETE_YOUR_PROFILE: 'Complete Your Profile',
    STEP_OF: 'Step {step} of {total}',
    BASIC_DETAILS: 'Basic Details',
    ENTER_YOUR_FULL_NAME: 'Enter your full name',
    ENTER_YOUR_PHONE_NUMBER: 'Enter your phone number',
    EDUCATIONAL_QUALIFICATION: 'Educational Qualification',
    PARTNER_EXPECTATIONS: 'Partner Expectations',
    DESCRIBE_IDEAL_PARTNER: 'Describe your ideal partner',
    UPLOAD_PROFILE_PHOTO: 'Upload Profile Photo',
    COMPLETE: 'Complete',
    SKIP_FOR_NOW: 'Skip for now',
    
    ACCEPT: 'Accept',
    DECLINE: 'Decline',
    UNIGNORE: 'Unignore',
    UPLOAD_IMAGES: 'Upload Images',
    DELETE: 'Delete',
    UPDATE_PHOTO: 'Update Photo',
    
    NO_INTEREST_REQUESTS: 'No interest requests',
    NO_INTEREST_REQUESTS_DESC: 'You haven\'t received any interest requests yet',
    NO_IGNORED_MEMBERS: 'No ignored members',
    NO_MESSAGES: 'No messages yet',
    NO_IMAGES: 'Click "Upload Images" to add photos to your gallery',
    
    HOURS_AGO: '{hours} hours ago',
    DAYS_AGO: '{days} days ago',
    MINS_AGO: '{mins} mins ago',
    JUST_NOW: 'Just now',
    YEARS_OLD: '{age} years',
    
    STATUS_PENDING: 'Pending',
    STATUS_ACCEPTED: 'Accepted',
    STATUS_DECLINED: 'Declined',
    
    BUSINESS_ANALYST: 'Business Analyst',
    CIVIL_ENGINEER: 'Civil Engineer',
    ARCHITECT: 'Architect',
    SOFTWARE_ENGINEER: 'Software Engineer',
    TEACHER: 'Teacher',
    
    // Sample profile names
    NAME_PRIYA_SHARMA: 'Priya Sharma',
    NAME_ANJALI_PATEL: 'Anjali Patel',
    NAME_SNEHA_KUMAR: 'Sneha Kumar',
    NAME_RAHUL_VERMA: 'Rahul Verma',
    NAME_AMIT_SINGH: 'Amit Singh',
    NAME_VIKRAM_JOSHI: 'Vikram Joshi',
    NAME_KARAN_MEHTA: 'Karan Mehta',
    NAME_ROHAN_GUPTA: 'Rohan Gupta',
    NAME_NEHA_REDDY: 'Neha Reddy',
    
    // Locations
    LOCATION_MUMBAI: 'Mumbai',
    LOCATION_DELHI: 'Delhi',
    LOCATION_BANGALORE: 'Bangalore',
    LOCATION_PUNE: 'Pune',
    LOCATION_JAIPUR: 'Jaipur',
    LOCATION_CHENNAI: 'Chennai',
    LOCATION_HYDERABAD: 'Hyderabad',
    LOCATION_KOLKATA: 'Kolkata',
    
    // Age format
    AGE_YEARS: '{age} years',
    MANAGER: 'Manager',
    CONSULTANT: 'Consultant',
    DOCTOR: 'Doctor',
    MARKETING_MANAGER: 'Marketing Manager',
    
    CURRENT_PACKAGE: 'Current Package',
    EXPRESS_INTERESTS: '{count} Express Interests',
    CONTACT_VIEW: '{count} Contact View',
    IMAGE_UPLOAD: '{count} Image Upload',
    PACKAGE_EXPIRY_DATE: 'Package expiry date : {date}',
    UPGRADE_PACKAGE: 'Upgrade Package',
    
    LATEST_INTERESTS: 'Latest Interests',
    NO_INTERESTS_YET: 'No interests yet',
    START_BROWSING_MEMBERS: 'Start browsing members to send interests',
    
    // Purchase History
    PURCHASE_DATE: 'Purchase Date',
    PURCHASE_TIME: 'Purchase Time',
    TRANSACTION_ID: 'Transaction ID',
    AMOUNT_PAID: 'Amount Paid',
    DURATION: 'Duration',
    FEATURES_INCLUDED: 'Features Included:',
    MONTHS: '{count} Months',
    MONTH: '{count} Month',
    ACTIVE: 'Active',
    EXPIRED: 'Expired',
    NO_PURCHASE_HISTORY: 'No purchase history',
    NO_PURCHASES_YET: 'You haven\'t made any purchases yet',
    GOLD_PLAN: 'Gold Plan',
    SILVER_PLAN: 'Silver Plan',
    FEATURE_EXPRESS_INTERESTS_100: '100 Express Interests',
    FEATURE_CONTACT_VIEWS_50: '50 Contact Views',
    FEATURE_UNLIMITED_IMAGE_UPLOAD: 'Unlimited Image Upload',
    FEATURE_EXPRESS_INTERESTS_50: '50 Express Interests',
    FEATURE_CONTACT_VIEWS_25: '25 Contact Views',
    FEATURE_IMAGE_UPLOAD_50: '50 Image Upload',
    
    // Gallery
    MY_GALLERY: 'My Gallery',
    YOU_HAVE_UPLOADED: 'You have uploaded',
    IMAGES: 'images',
    REMAINING_UPLOADS: 'Remaining uploads:',
    NO_IMAGES_UPLOADED: 'No images uploaded yet',
    CLICK_UPLOAD_IMAGES: 'Click "Upload Images" to add photos to your gallery',
    UPLOAD_GUIDELINES: 'Upload Guidelines',
    GUIDELINE_CLEAR_PHOTOS: 'Upload clear, recent photos for better profile visibility',
    GUIDELINE_FORMATS: 'Supported formats: JPG, PNG, JPEG (Max size: 5MB per image)',
    GUIDELINE_AVOID: 'Avoid group photos, blurry images, or inappropriate content',
    GUIDELINE_VISIBILITY: 'Profile photos with face clearly visible get 3x more responses',
    
    // My Interest
    MY_INTERESTS: 'My Interests',
    INTERESTS_SENT_DESC: 'Interests you have sent to other members',
    NO_INTERESTS_SENT: 'No interests sent yet',
    
    // Interest Request
    INTEREST_REQUESTS: 'Interest Requests',
    INTEREST_REQUESTS_DESC: 'Members who have shown interest in your profile',
    
    // Ignored Lists
    IGNORED_MEMBERS: 'Ignored Members',
    IGNORED_MEMBERS_DESC: 'Members you have chosen to ignore',
    IGNORED_ON: 'Ignored on: {date}',
    NO_IGNORED_DESC: 'You haven\'t ignored anyone yet',
    
    // Messages
    MESSAGES: 'Messages',
    YOUR_CONVERSATIONS: 'Your conversations',
    SELECT_CONVERSATION: 'Select a conversation',
    CHOOSE_CHAT: 'Choose a chat from the list to start messaging',
    TYPE_MESSAGE: 'Type a message...',
    ONLINE: 'Online',
    OFFLINE: 'Offline',
    
    // Profile Settings
    PROFILE_SETTINGS: 'Profile Settings',
    MANAGE_PROFILE_DESC: 'Manage your profile information and preferences',
    PERSONAL_INFORMATION: 'Personal Information',
    TELL_ABOUT_YOURSELF: 'Tell us about yourself...',
    PRIVACY_SETTINGS: 'Privacy Settings',
    SHOW_PROFILE_ALL: 'Show my profile to all members',
    ALLOW_CONTACT: 'Allow members to contact me',
    SHOW_ONLINE: 'Show when I\'m online',
    CHANGE_PASSWORD: 'Change Password',
    CURRENT_PASSWORD: 'Current Password',
    NEW_PASSWORD: 'New Password',
    CONFIRM_NEW_PASSWORD: 'Confirm New Password',
    ENTER_CURRENT_PASSWORD: 'Enter current password',
    ENTER_NEW_PASSWORD: 'Enter new password',
    REENTER_NEW_PASSWORD: 'Re-enter new password',
    
    // Profile Setting Placeholders
    PLACEHOLDER_EMAIL: 'your.email@example.com',
    PLACEHOLDER_PHONE: '+91 98765 43210',
    PLACEHOLDER_OCCUPATION: 'Software Engineer',
    PLACEHOLDER_INCOME: '₹ 8-10 Lakhs',
    PLACEHOLDER_EDUCATION: 'B.Tech in Computer Science',
    PLACEHOLDER_COMPANY: 'ABC Technologies',
    
    // Shortlist (placeholder for future)
    SHORTLIST: 'Shortlist',
    MY_SHORTLIST: 'My Shortlist',
    
    // Actions
    SAVE_CHANGES: 'Save Changes',
    CANCEL: 'Cancel',
    CHANGES_SAVED: 'Changes Saved!',
    PROFILE_UPDATED_SUCCESSFULLY: 'Your profile has been updated successfully.',
    LANGUAGE: 'Language',
    LOGOUT: 'Logout',
  },
  hi: {
    BRAND: 'कल्याणोत्सवमेट',
    HOME: 'होम',
    MEMBERS: 'सदस्य',
    STORIES: 'सफलता की कहानियाँ',
    PLANS: 'पैकेज',
    CONTACT: 'संपर्क करें',
    DASHBOARD: 'डैशबोर्ड',
    LOGIN: 'लॉगिन',
    REGISTER: 'रजिस्टर',
    FIND_YOUR: 'अपना',
    AND_START_JOURNEY: 'खोजें और शाश्वत सुख की यात्रा शुरू करें।',
    QUICK_LINKS: 'त्वरित लिंक्स',
    SUPPORT: 'समर्थन',
    CONNECT_WITH_US: 'हमसे जुड़ें',
    COPYRIGHT: '© 2025 कल्याणोत्सवमेट। सर्वाधिकार सुरक्षित। बना हुआ',
    DOITROCKET: 'doitrocket',
    
    // Footer links
    HOME_LINK: 'होम',
    MEMBERS_LINK: 'सदस्य',
    SUCCESS_STORIES_LINK: 'सफलता की कहानियाँ',
    PRICING_LINK: 'पैकेज',
    CONTACT_US_LINK: 'संपर्क करें',
    PRIVACY_POLICY_LINK: 'गोपनीयता नीति',
    FOR_YOU: 'आपके लिए।',
    
    // Home page
    HERO_TAG: 'हजारों खुश जोड़ों द्वारा भरोसा',
    PERFECT_MATCH: 'परफ़ेक्ट मैच',
    TRUE_LOVE: 'सच्चा प्यार',
    SOULMATE: 'सोलमेट',
    FOREVER_PARTNER: 'हमेशा के लिए साथी',
    HERO_SUB: 'अर्थपूर्ण सम्बन्ध खोजें और किसी खास के साथ अपनी खुशहाल यात्रा शुरू करें।',
    QUICK_PARTNER_SEARCH: 'त्वरित साथी खोजें',
    SELECT_GENDER: 'लिंग चुनें',
    SELECT_RELIGION: 'धर्म चुनें',
    AGE_FROM: 'आयु से',
    AGE_TO: 'आयु तक',
    SEARCH_NOW: 'खोजें',
    ABOUT_TITLE: 'कल्याणोत्सवमेट के बारे में',
    WHERE_TRUE_LOVE: 'जहाँ सच्चा प्यार शुरू होता है',
    ABOUT_DESC: 'हम केवल एक मंच नहीं हैं - हम आजीवन खुशी खोजने में आपके विश्वसनीय साथी हैं',
    FEATURED_PROFILES: 'विशेष प्रोफाइल',
    MEET_MEMBERS: 'हमारे कुछ अद्भुत सदस्यों से मिलें',
    VIEW_PROFILE: 'प्रोफ़ाइल देखें',
    VIEW_ALL_MEMBERS: 'सभी सदस्यों को देखें',
    SUCCESS_STORIES: 'सफलता की कहानियाँ',
    REAL_COUPLES: 'वास्तविक जोड़े, वास्तविक खुशी',
    STATS_ACTIVE_MEMBERS: 'सक्रिय सदस्य',
    STATS_SUCCESS_STORIES: 'सफलता की कहानियाँ',
    STATS_YEARS_TRUST: 'भरोसे के वर्ष',
    
    // Homepage additional
    ABOUT_FOUNDED: 'लोगों को उनके जीवन साथी खोजने के तरीके में क्रांति लाने के दृष्टिकोण के साथ स्थापित,',
    ABOUT_COMBINES: 'अर्थपूर्ण संबंध बनाने के लिए अत्याधुनिक तकनीक को पारंपरिक मूल्यों के साथ जोड़ता है।',
    ABOUT_WITH_OVER: 'से अधिक',
    YEARS_EXPERIENCE: '15 वर्षों के अनुभव',
    ABOUT_HELPED: ' के साथ, हमने हजारों व्यक्तियों को उनका परफ़ेक्ट मैच खोजने में मदद की है। हमारे उन्नत मैचिंग एल्गोरिदम, सत्यापित प्रोफाइल और समर्पित सहायता टीम सुनिश्चित करती है कि प्यार खोजने की आपकी यात्रा सुरक्षित और सफल हो।',
    
    PRIVACY_SECURITY: 'गोपनीयता और सुरक्षा',
    PRIVACY_DESC: 'आपका डेटा बैंक-स्तरीय एन्क्रिप्शन और सख्त गोपनीयता नियंत्रण से सुरक्षित है।',
    VERIFIED_PROFILES_TITLE: 'सत्यापित प्रोफाइल',
    VERIFIED_DESC: 'सभी प्रोफाइल को प्रामाणिकता और वास्तविक संबंध सुनिश्चित करने के लिए अच्छी तरह से सत्यापित किया जाता है।',
    SUCCESS_STORIES_TITLE: 'सफलता की कहानियाँ',
    SUCCESS_DESC: 'हजारों खुश जोड़ों में शामिल हों जिन्होंने हमारे प्लेटफॉर्म के माध्यम से अपना परफ़ेक्ट मैच पाया।',
    
    WHAT_MEMBERS_SAY: 'हमारे सदस्य क्या कहते हैं',
    HEAR_FROM_MEMBERS: 'हजारों खुश सदस्यों से सुनें जिन्होंने अपना परफ़ेक्ट मैच पाया',
    
    READY_FIND_SOULMATE: 'अपना सोलमेट खोजने के लिए तैयार हैं?',
    JOIN_HAPPY_COUPLES: 'हजारों खुश जोड़ों में शामिल हों जिन्होंने कल्याणोत्सवमेट के माध्यम से प्यार पाया',
    GET_STARTED_NOW: 'अभी शुरू करें',
    
    FAQ_TITLE: 'अक्सर पूछे जाने वाले प्रश्न',
    FAQ_SUBTITLE: 'कल्याणोत्सवमेट के बारे में जानने के लिए आवश्यक सब कुछ',
    STILL_HAVE_QUESTIONS: 'अभी भी सवाल हैं?',
    CONTACT_SUPPORT: 'समर्थन से संपर्क करें',
    FAQ_Q1: 'कल्याणोत्सवमेट कैसे काम करता है?',
    FAQ_Q2: 'क्या कल्याणोत्सवमेट उपयोग करने के लिए मुफ्त है?',
    FAQ_Q3: 'मैं अपनी प्रोफ़ाइल को कैसे अलग बना सकता हूँ?',
    FAQ_Q4: 'क्या मेरी जानकारी सुरक्षित है?',
    FAQ_Q5: 'मैच खोजने में कितना समय लगता है?',
    FAQ_Q6: 'क्या मैं कभी भी अपनी सदस्यता रद्द कर सकता हूँ?',
    FAQ_Q7: 'कल्याणोत्सवमेट को अन्य प्लेटफ़ॉर्म से क्या अलग बनाता है?',
    FAQ_Q8: 'मैं अपनी प्रोफ़ाइल को कैसे सत्यापित करूं?',
    
    // Testimonials
    TESTIMONIAL_1_NAME: 'सारा मिशेल',
    TESTIMONIAL_1_CONTENT: 'कल्याणोत्सवमेट ने मेरी ज़िंदगी बदल दी! प्लेटफ़ॉर्म उपयोग करने में बहुत आसान है, और मिलान बिल्कुल सटीक थे। मैंने शामिल होने के 3 महीनों के भीतर अपने पति से मुलाकात की। सत्यापन प्रक्रिया ने मुझे पूरी यात्रा के दौरान सुरक्षित महसूस कराया।',
    TESTIMONIAL_1_ROLE: 'मार्केटिंग मैनेजर',
    
    TESTIMONIAL_2_NAME: 'राहुल शर्मा',
    TESTIMONIAL_2_CONTENT: 'कई मैट्रिमोनियल साइट्स को आज़माने के बाद, कल्याणोत्सवमेट अपने वास्तविक प्रोफाइल और उत्कृष्ट ग्राहक सहायता के साथ अलग दिखाई दिया। वीडियो कॉल सुविधा ने हमें व्यक्तिगत रूप से मिलने से पहले जुड़ने में मदद की। अत्यधिक अनुशंसित!',
    TESTIMONIAL_2_ROLE: 'सॉफ्टवेयर इंजीनियर',
    
    TESTIMONIAL_3_NAME: 'मारिया गार्सिया',
    TESTIMONIAL_3_CONTENT: 'मैं पहले संशय में था, लेकिन विस्तृत व्यक्तित्व मिलान और संगतता परीक्षण वास्तव में काम करते हैं! किसी ऐसे व्यक्ति को पाया जो मेरे मूल्यों और सपनों को साझा करता है। खोज को इतना सार्थक और तनाव मुक्त बनाने के लिए धन्यवाद।',
    TESTIMONIAL_3_ROLE: 'शिक्षिका',
    
    TESTIMONIAL_4_NAME: 'अहमद हसन',
    TESTIMONIAL_4_CONTENT: 'गोपनीयता सुविधाओं और परिवार की भागीदारी के विकल्पों ने इसे हमारे समुदाय के लिए सही प्लेटफॉर्म बनाया। मेरे माता-पिता प्रक्रिया में भाग ले सके, जो हमारे लिए बहुत महत्वपूर्ण था। उत्कृष्ट सेवा!',
    TESTIMONIAL_4_ROLE: 'व्यवसाय स्वामी',
    
    TESTIMONIAL_5_NAME: 'एमिली चेन',
    TESTIMONIAL_5_CONTENT: 'मेरा अब तक का सबसे अच्छा निवेश! प्रीमियम सुविधाएं हर पैसे के लायक हैं। व्यक्तिगत मैचमेकिंग सेवा ने बिल्कुल समझा कि मैं क्या खोज रही थी। अपनी सोलमेट से मिली और खुश नहीं हो सकती!',
    TESTIMONIAL_5_ROLE: 'डॉक्टर',
    
    TESTIMONIAL_6_NAME: 'जेम्स विल्सन',
    TESTIMONIAL_6_CONTENT: 'स्वच्छ इंटरफ़ेस, वास्तविक लोग, और शानदार सफलता दर। आप और क्या मांग सकते हैं? टीम जवाबदेह है और वास्तव में लोगों को प्यार खोजने में मदद करने की परवाह करती है। इस प्लेटफ़ॉर्म ने मेरी सभी अपेक्षाओं को पार कर लिया!',
    TESTIMONIAL_6_ROLE: 'वास्तुकार',
    
    // Success Stories
    STORY_1_COUPLE: 'एम्मा और डेविड',
    STORY_1_TEXT: 'हमने कल्याणोत्सवमेट के माध्यम से एक-दूसरे को पाया और यह पहली नज़र में प्यार था!',
    STORY_1_DATE: 'विवाह: जून 2024',
    STORY_1_LOCATION: 'न्यूयॉर्क, यूएसए',
    STORY_1_FULL: 'हम 2023 की शुरुआत में कल्याणोत्सवमेट पर मिले, और हमारी पहली बातचीत से ही, हमें पता था कि कुछ खास था। डेविड का हास्य का सेंस और एम्मा का गर्मजोशी से भरा व्यक्तित्व तुरंत जुड़ गया। वीडियो कॉल और व्यक्तिगत रूप से मिलने के महीनों के बाद, हमें एहसास हुआ कि हमने अपने जीवनसाथी को पा लिया है। हमें एक साथ लाने के लिए कल्याणोत्सवमेट का धन्यवाद!',
    
    STORY_2_COUPLE: 'सोफिया और रयान',
    STORY_2_TEXT: 'हमें एक साथ लाने के लिए धन्यवाद। अब तक का सबसे अच्छा निर्णय!',
    STORY_2_DATE: 'विवाह: मार्च 2024',
    STORY_2_LOCATION: 'लॉस एंजिल्स, यूएसए',
    STORY_2_FULL: 'प्यार खोजना असंभव लग रहा था जब तक हमने कल्याणोत्सवमेट नहीं पाया। प्लेटफ़ॉर्म की विस्तृत मैचिंग सिस्टम ने अलग-अलग शहरों में रहने के बावजूद हमें एक-दूसरे को खोजने में मदद की। हमारी पहली डेट जादुई थी, और हमने पीछे मुड़कर नहीं देखा। हम अब खुशी-खुशी विवाहित हैं और अपने पहले बच्चे की उम्मीद कर रहे हैं!',
    
    STORY_3_COUPLE: 'आइशा और उमर',
    STORY_3_TEXT: 'परब़ेक्ट सेवा के माध्यम से बनाया गया एक परफ़ेक्ट मैच। अत्यधिक अनुशंसित!',
    STORY_3_DATE: 'विवाह: दिसंबर 2023',
    STORY_3_LOCATION: 'दुबई, यूएई',
    STORY_3_FULL: 'व्यस्त पेशेवरों के रूप में, हमें डेटिंग के लिए समय निकालने में संघर्ष करना पड़ा। कल्याणोत्सवमेट ने समान विचारधारा वाले लोगों से जुड़ना आसान बना दिया। उमर की प्रोफाइल तुरंत अलग दिखी, और हमारी पहली कॉफी डेट के बाद, हमें पता था कि हम एक-दूसरे के लिए बने थे। अजनबियों से जीवनसाथी तक की यात्रा सुंदर थी।',
    
    STORY_4_COUPLE: 'प्रिया और अर्जुन',
    STORY_4_TEXT: 'हमारे परिवार रोमांचित हैं! हमने कल्याणोत्सवमेट के माध्यम से अपना परफ़ेक्ट मैच पाया।',
    STORY_4_DATE: 'विवाह: अगस्त 2024',
    STORY_4_LOCATION: 'मुंबई, भारत',
    STORY_4_FULL: 'हमारे परिवार वर्षों से हमारे लिए सही मैच खोज रहे थे। जब हम दोनों ने स्वतंत्र रूप से कल्याणोत्सवमेट ज्वाइन किया, तो हमने हफ्तों के भीतर एक-दूसरे को पा लिया। यह नियति जैसा लगा। हमारे समान मूल्य, सपने और आकांक्षाएं पूरी तरह से मेल खाती थीं। हम इससे अधिक खुश नहीं हो सकते!',
    
    STORY_5_COUPLE: 'इसाबेला और लुकास',
    STORY_5_TEXT: 'कल्याणोत्सवमेट के साथ दूरी कोई बाधा नहीं थी। अब हम अपना भविष्य एक साथ बना रहे हैं!',
    STORY_5_DATE: 'विवाह: फरवरी 2024',
    STORY_5_LOCATION: 'बार्सिलोना, स्पेन',
    STORY_5_FULL: 'लंबी दूरी के रिश्ते चुनौतीपूर्ण होते हैं, लेकिन कल्याणोत्सवमेट ने हमें इसे काम करने के लिए उपकरण दिए। हमने व्यक्तिगत रूप से मिलने से पहले महीनों तक वीडियो चैट की, और जब हम आखिरकार मिले, तो यह सभी उम्मीदों से अधिक था। अब हम एक ही शहर में अपना जीवन एक साथ बना रहे हैं!',
    
    STORY_6_COUPLE: 'युकी और ताकेशी',
    STORY_6_TEXT: 'संदेहियों से विश्वासियों तक! कल्याणोत्सवमेट ने हमें हमारी खुशहाल कहानी दी।',
    STORY_6_DATE: 'विवाह: मई 2024',
    STORY_6_LOCATION: 'टोक्यो, जापान',
    STORY_6_FULL: 'हम दोनों ऑनलाइन विवाह सेवाओं के बारे में संदिग्ध थे, लेकिन कल्याणोत्सवमेट ने हमारे विचार बदल दिए। प्लेटफॉर्म का संगतता और साझा मूल्यों पर जोर ने हमें एक-दूसरे को खोजने में मदद की। हमारी शादी परंपरा और आधुनिक प्रेम का एक सुंदर मिश्रण थी। सब कुछ के लिए धन्यवाद!',
    
    PROFILE_1_NAME: 'सारा जॉनसन',
    PROFILE_1_PROFESSION: 'सॉफ्टवेयर इंजीनियर',
    PROFILE_1_LOCATION: 'न्यूयॉर्क, यूएसए',
    PROFILE_2_NAME: 'माइकल चेन',
    PROFILE_2_PROFESSION: 'डॉक्टर',
    PROFILE_2_LOCATION: 'लॉस एंजिल्स, यूएसए',
    PROFILE_3_NAME: 'प्रिया शर्मा',
    PROFILE_3_PROFESSION: 'शिक्षिका',
    PROFILE_3_LOCATION: 'मुंबई, भारत',
    PROFILE_4_NAME: 'जेम्स विल्सन',
    PROFILE_4_PROFESSION: 'वास्तुकार',
    PROFILE_4_LOCATION: 'लंदन, यूके',
    PROFILE_5_NAME: 'एमिली रोड्रिगेज',
    PROFILE_5_PROFESSION: 'मार्केटिंग मैनेजर',
    PROFILE_5_LOCATION: 'टोरंटो, कनाडा',
    PROFILE_6_NAME: 'डेविड किम',
    PROFILE_6_PROFESSION: 'व्यवसाय विश्लेषक',
    PROFILE_6_LOCATION: 'सिंगापुर',
    PROFILE_7_NAME: 'युकी तनाका',
    PROFILE_7_PROFESSION: 'ग्राफिक डिजाइनर',
    PROFILE_7_LOCATION: 'टोक्यो, जापान',
    PROFILE_8_NAME: 'उमर हसन',
    PROFILE_8_PROFESSION: 'सिविल इंजीनियर',
    PROFILE_8_LOCATION: 'काहिरा, मिस्र',
    RELIGION_CHRISTIANITY: 'ईसाई धर्म',
    RELIGION_BUDDHISM: 'बौद्ध धर्म',
    RELIGION_HINDUISM: 'हिंदू धर्म',
    RELIGION_ISLAM: 'इस्लाम',
    PREVIOUS: 'पिछला',
    NEXT: 'अगला',
    VERIFIED_PROFILES: 'सत्यापित प्रोफ़ाइल',
    SUPPORT_AVAILABLE: 'समर्थन उपलब्ध',
    
    // Contact
    CONTACT_GET_IN_TOUCH: 'संपर्क में आएँ',
    CONTACT_DESC: 'प्रश्न हैं या सहायता चाहिए? हम आपको अपना परफ़ेक्ट मैच खोजने में मदद करने के लिए यहां हैं।',
    SEND_US_MESSAGE: 'हमें संदेश भेजें',
    YOUR_NAME: 'आपका नाम',
    EMAIL_ADDRESS: 'ईमेल पता',
    SUBJECT: 'विषय',
    MESSAGE: 'संदेश',
    SEND_MESSAGE: 'संदेश भेजें',
    CONTACT_INFORMATION: 'संपर्क जानकारी',
    EMAIL_US: 'हमें मेल करें',
    CALL_US: 'हमें कॉल करें',
    VISIT_US: 'हमें मिलें',

    // Find partner
    ADVANCED_PARTNER_SEARCH: 'उन्नत साथी खोज',
    FIND_YOUR_PERFECT_PARTNER: 'अपना परफ़ेक्ट साथी खोजें',
    SEARCH_FILTERS: 'खोज फ़िल्टर',
    LOOKING_FOR: 'खोज रहे हैं',
    LOCATION: 'स्थान',
    PROFESSION: 'पेशा',
    MARITAL_STATUS: 'वैवाहिक स्थिति',
    EDUCATION_LEVEL: 'शिक्षा स्तर',
    ANNUAL_INCOME: 'वार्षिक आय',
    SEARCH_PARTNERS: 'साथी खोजें',
    CLEAR_FILTERS: 'फ़िल्टर साफ करें',
    SEARCH_RESULTS: 'खोज परिणाम',

    // Auth
    WELCOME_BACK: 'वापसी पर स्वागत है',
    SIGN_IN_SUB: 'लव खोजने की अपनी यात्रा जारी रखने के लिए साइन इन करें',
    REMEMBER_ME: 'मुझे याद रखें',
    FORGOT_PASSWORD: 'पासवर्ड भूल गए?',
    SIGN_IN: 'साइन इन',
    OR_CONTINUE_WITH: 'या जारी रखें',
    CONTINUE_WITH_GOOGLE: 'Google के साथ जारी रखें',
    DONT_HAVE_ACCOUNT: 'क्या आपके पास खाता नहीं है?',
    SIGN_UP: 'साइन अप',
    
    // Register
    BEGIN_JOURNEY: 'अपनी यात्रा शुरू करें',
    CREATE_PROFILE_FIND_MATCH: 'अपनी प्रोफ़ाइल बनाएं और अपना परफ़ेक्ट मैच खोजें',
    BASIC_INFORMATION: 'मूल जानकारी',
    FULL_NAME: 'पूरा नाम',
    GENDER: 'लिंग',
    DATE_OF_BIRTH: 'जन्म तिथि',
    SELECT: 'चुनें',
    MALE: 'पुरुष',
    FEMALE: 'महिला',
    SECURE_YOUR_ACCOUNT: 'अपना खाता सुरक्षित करें',
    PASSWORD: 'पासवर्ड',
    PASSWORD_HINT: 'कम से कम 8 अक्षर बड़े अक्षर, छोटे अक्षर और संख्याओं के साथ',
    CONFIRM_PASSWORD: 'पासवर्ड की पुष्टि करें',
    SECURITY_TIPS: 'सुरक्षा युक्तियाँ:',
    SECURITY_TIP_1: '• एक अनूठा पासवर्ड उपयोग करें जिसे आप कहीं और उपयोग नहीं करते',
    SECURITY_TIP_2: '• साइन अप के बाद दो-कारक प्रमाणीकरण सक्षम करें',
    SECURITY_TIP_3: '• कभी भी किसी के साथ अपना पासवर्ड साझा न करें',
    VERIFY_YOUR_EMAIL: 'अपना ईमेल सत्यापित करें',
    VERIFICATION_CODE_SENT: 'हमने एक सत्यापन कोड भेजा है',
    ENTER_6_DIGIT_CODE: '6-अंकों का कोड दर्ज करें',
    DIDNT_RECEIVE_CODE: 'कोड प्राप्त नहीं हुआ?',
    RESEND: 'फिर से भेजें',
    BACK: 'वापस',
    CONTINUE: 'जारी रखें',
    COMPLETE_REGISTRATION: 'रजिस्ट्रेशन पूर्ण करें',
    ALREADY_HAVE_ACCOUNT: 'पहले से खाता है?',
    REGISTRATION_SUCCESSFUL: 'रजिस्ट्रेशन सफल!',
    WELCOME_TO: 'कल्याणोत्सवमेट में आपका स्वागत है',
    JOURNEY_BEGINS: 'आपकी यात्रा अब शुरू होती है',

    // Members
    BROWSE_MEMBERS: 'सदस्य खोजें',
    FIND_PROFILES_COUNT: '{count} अद्भुत प्रोफाइल में से अपना परफ़ेक्ट मैच खोजें',
    FILTERS: 'फ़िल्टर',
    AGE_RANGE: 'आयु सीमा',
    FROM: 'से',
    TO: 'तक',
    ALL: 'सभी',
    RELIGION: 'धर्म',
    HEIGHT: 'ऊंचाई',
    APPLY_FILTERS: 'फ़िल्टर लागू करें',
    CLEAR_ALL_FILTERS: 'सभी साफ़ करें',
    SHOW_FILTERS: 'फ़िल्टर दिखाएं',
    YOU_LIKED: 'आपने पसंद किया',
    INTEREST_SENT_SUCCESSFULLY: 'रुचि सफलतापूर्वक भेजी गई',
    NEVER_MARRIED: 'कभी शादी नहीं की',
    DIVORCED: 'तलाकशुदा',
    WIDOWED: 'विधवा/विधुर',
    CITY_COUNTRY: 'शहर, देश',
    EG_ENGINEER: 'उदा., इंजीनियर',

    // Plans
    CHOOSE_PLAN_TAG: 'अपना परफ़ेक्ट प्लान चुनें',
    FIND_LOVE_RIGHT_PLAN: 'सही प्लान के साथ प्यार पाएं',
    SELECT_PLAN_DESC: 'अपनी आवश्यकताओं के अनुसार एक योजना चुनें और अपना परफ़ेक्ट मैच खोजने की यात्रा शुरू करें',
    MOST_POPULAR: 'अधिकतम लोकप्रिय',
    GET_STARTED: 'शुरू करें',
    
    PLAN_FREE_NAME: 'मुफ्त',
    PLAN_FREE_DESC: 'शुरुआत करने के लिए परफ़ेक्ट',
    PLAN_FREE_FEATURE_1: 'प्रोफाइल बनाएं',
    PLAN_FREE_FEATURE_2: 'दैनिक 5 प्रोफाइल देखें',
    PLAN_FREE_FEATURE_3: '2 रुचि अनुरोध भेजें',
    PLAN_FREE_FEATURE_4: 'बेसिक खोज फ़िल्टर',
    PLAN_FREE_FEATURE_5: 'ईमेल समर्थन',
    
    PLAN_SILVER_NAME: 'सिल्वर',
    PLAN_SILVER_DESC: 'गंभीर खोजकर्ताओं के लिए सर्वोत्तम',
    PLAN_SILVER_FEATURE_1: 'मुफ्त में सब कुछ',
    PLAN_SILVER_FEATURE_2: 'असीमित प्रोफाइल देखें',
    PLAN_SILVER_FEATURE_3: '50 रुचि अनुरोध भेजें',
    PLAN_SILVER_FEATURE_4: 'एडवांस खोज फ़िल्टर',
    PLAN_SILVER_FEATURE_5: 'मैच के साथ चैट करें',
    PLAN_SILVER_FEATURE_6: 'प्राथमिकता समर्थन',
    PLAN_SILVER_FEATURE_7: 'प्रोफाइल हाइलाइट',
    
    PLAN_GOLD_NAME: 'गोल्ड',
    PLAN_GOLD_DESC: 'प्रीमियम अनुभव',
    PLAN_GOLD_FEATURE_1: 'सिल्वर में सब कुछ',
    PLAN_GOLD_FEATURE_2: 'असीमित रुचि अनुरोध',
    PLAN_GOLD_FEATURE_3: 'वीडियो कॉल सुविधा',
    PLAN_GOLD_FEATURE_4: 'प्रोफाइल सत्यापन बैज',
    PLAN_GOLD_FEATURE_5: 'शीर्ष प्रोफाइल स्थिति',
    PLAN_GOLD_FEATURE_6: 'समर्पित रिश्ता प्रबंधक',
    PLAN_GOLD_FEATURE_7: 'प्रीमियम समर्थन 24/7',
    PLAN_GOLD_FEATURE_8: 'विशेष इवेंट एक्सेस',
    PLAN_MONTH: '/माह',
    
    // Stories
    LOVE_STORIES_THAT: 'प्रेम कहानियाँ जो',
    INSPIRE_US: 'हमें प्रेरित करती हैं',
    STORIES_SUBTITLE: 'वास्तविक जोड़े, वास्तविक प्रेम कहानियाँ। जानें कैसे कल्याणोत्सवमेट ने हज़ारों लोगों को उनका परफ़ेक्ट मैच खोजने और अपनी खुशहाल यात्रा शुरू करने में मदद की।',
    MARRIED: 'विवाह:',
    READ_MORE: 'और पढ़ें',

    // Privacy
    PRIVACY_POLICY_TITLE: 'गोपनीयता नीति',
    LAST_UPDATED: 'अंतिम अद्यतन: जनवरी 2025',
    INFORMATION_WE_COLLECT: 'हम जो जानकारी एकत्र करते हैं',
    HOW_WE_USE: 'हम अपनी जानकारी का उपयोग कैसे करते हैं',
    DATA_SECURITY: 'डेटा सुरक्षा',
    INFORMATION_SHARING: 'जानकारी साझा करना',
    YOUR_RIGHTS: 'आपके अधिकार',
    COOKIES_TRACKING: 'कुकीज़ और ट्रैकिंग',
    CHANGES_POLICY: 'इस नीति में परिवर्तन',
    CONTACT_US_TITLE: 'संपर्क करें',

    // Dashboard
    STATS_TOTAL_SHORTLISTED: 'कुल शॉर्टलिस्ट किए',
    STATS_INTEREST_SENT: 'रुचि भेजी',
    STATS_INTEREST_REQUESTS: 'रुचि अनुरोध',
    MENU_DASHBOARD: 'डैशबोर्ड',
    MENU_PURCHASE_HISTORY: 'खरीद इतिहास',
    MENU_GALLERY: 'गैलरी',
    MENU_SHORTLIST: 'शॉर्टलिस्ट',
    MENU_MY_INTEREST: 'मेरी रुचि',
    MENU_INTEREST_REQUEST: 'रुचि अनुरोध',
    MENU_IGNORED_LISTS: 'नजरअंदाज सूची',
    MENU_MESSAGE: 'संदेश',
    MENU_PROFILE_SETTING: 'प्रोफाइल सेटिंग',
    MENU_SIGN_OUT: 'साइन आउट',
    
    COMPLETE_YOUR_PROFILE: 'अपनी प्रोफाइल पूरी करें',
    STEP_OF: 'स्टेप {step} / {total}',
    BASIC_DETAILS: 'बुनियादी विवरण',
    ENTER_YOUR_FULL_NAME: 'अपना पूरा नाम दर्ज करें',
    ENTER_YOUR_PHONE_NUMBER: 'अपना फोन नंबर दर्ज करें',
    EDUCATIONAL_QUALIFICATION: 'शैक्षिक योग्यता',
    PARTNER_EXPECTATIONS: 'साथी की उम्मीदें',
    DESCRIBE_IDEAL_PARTNER: 'अपने आदर्श साथी का वर्णन करें',
    UPLOAD_PROFILE_PHOTO: 'प्रोफाइल फोटो अपलोड करें',
    COMPLETE: 'पूरा करें',
    SKIP_FOR_NOW: 'अभी छोड़ें',
    
    ACCEPT: 'स्वीकार करें',
    DECLINE: 'अस्वीकार करें',
    UNIGNORE: 'अनिग्नोर करें',
    UPLOAD_IMAGES: 'छवियां अपलोड करें',
    DELETE: 'हटाएं',
    UPDATE_PHOTO: 'फोटो अपडेट करें',
    
    NO_INTEREST_REQUESTS: 'कोई रुचि अनुरोध नहीं',
    NO_INTEREST_REQUESTS_DESC: 'आपको अभी तक कोई रुचि अनुरोध प्राप्त नहीं हुआ',
    NO_IGNORED_MEMBERS: 'कोई नजरअंदाज सदस्य नहीं',
    NO_MESSAGES: 'अभी तक कोई संदेश नहीं',
    NO_IMAGES: '"छवियां अपलोड करें" पर क्लिक करें अपनी गैलरी में फोटो जोड़ने के लिए',
    
    HOURS_AGO: '{hours} घंटे पहले',
    DAYS_AGO: '{days} दिन पहले',
    MINS_AGO: '{mins} मिनट पहले',
    JUST_NOW: 'अभी-अभी',
    YEARS_OLD: '{age} वर्ष',
    
    STATUS_PENDING: 'लंबित',
    STATUS_ACCEPTED: 'स्वीकृत',
    STATUS_DECLINED: 'अस्वीकृत',
    
    BUSINESS_ANALYST: 'व्यवसाय विश्लेषक',
    CIVIL_ENGINEER: 'सिविल इंजीनियर',
    ARCHITECT: 'वास्तुकार',
    SOFTWARE_ENGINEER: 'सॉफ्टवेयर इंजीनियर',
    TEACHER: 'शिक्षक',
    
    // Sample profile names
    NAME_PRIYA_SHARMA: 'प्रिया शर्मा',
    NAME_ANJALI_PATEL: 'अंजलि पटेल',
    NAME_SNEHA_KUMAR: 'स्नेहा कुमार',
    NAME_RAHUL_VERMA: 'राहुल वर्मा',
    NAME_AMIT_SINGH: 'अमित सिंह',
    NAME_VIKRAM_JOSHI: 'विक्रम जोशी',
    NAME_KARAN_MEHTA: 'करण मेहता',
    NAME_ROHAN_GUPTA: 'रोहन गुप्ता',
    NAME_NEHA_REDDY: 'नेहा रेड्डी',
    
    // Locations
    LOCATION_MUMBAI: 'मुंबई',
    LOCATION_DELHI: 'दिल्ली',
    LOCATION_BANGALORE: 'बैंगलोर',
    LOCATION_PUNE: 'पुणे',
    LOCATION_JAIPUR: 'जयपुर',
    LOCATION_CHENNAI: 'चेन्नई',
    LOCATION_HYDERABAD: 'हैदराबाद',
    LOCATION_KOLKATA: 'कोलकाता',
    
    // Age format
    AGE_YEARS: '{age} वर्ष',
    MANAGER: 'प्रबंधक',
    CONSULTANT: 'सलाहकार',
    DOCTOR: 'डॉक्टर',
    MARKETING_MANAGER: 'मार्केटिंग मैनेजर',
    
    CURRENT_PACKAGE: 'वर्तमान पैकेज',
    EXPRESS_INTERESTS: '{count} एक्सप्रेस रुचियां',
    CONTACT_VIEW: '{count} संपर्क दृश्य',
    IMAGE_UPLOAD: '{count} छवि अपलोड',
    PACKAGE_EXPIRY_DATE: 'पैकेज समाप्ति तिथि : {date}',
    UPGRADE_PACKAGE: 'पैकेज अपग्रेड करें',
    
    LATEST_INTERESTS: 'नवीनतम रुचियां',
    NO_INTERESTS_YET: 'अभी तक कोई रुचि नहीं',
    START_BROWSING_MEMBERS: 'रुचि भेजने के लिए सदस्यों को देखना शुरू करें',
    
    // Purchase History
    PURCHASE_DATE: 'खरीद की तारीख',
    PURCHASE_TIME: 'खरीद का समय',
    TRANSACTION_ID: 'लेनदेन आईडी',
    AMOUNT_PAID: 'भुगतान की गई राशि',
    DURATION: 'अवधि',
    FEATURES_INCLUDED: 'शामिल सुविधाएं:',
    MONTHS: '{count} महीने',
    MONTH: '{count} महीना',
    ACTIVE: 'सक्रिय',
    EXPIRED: 'समाप्त',
    NO_PURCHASE_HISTORY: 'कोई खरीद इतिहास नहीं',
    NO_PURCHASES_YET: 'आपने अभी तक कोई खरीदारी नहीं की है',
    GOLD_PLAN: 'गोल्ड प्लान',
    SILVER_PLAN: 'सिल्वर प्लान',
    FEATURE_EXPRESS_INTERESTS_100: '100 एक्सप्रेस रुचियां',
    FEATURE_CONTACT_VIEWS_50: '50 संपर्क दृश्य',
    FEATURE_UNLIMITED_IMAGE_UPLOAD: 'असीमित छवि अपलोड',
    FEATURE_EXPRESS_INTERESTS_50: '50 एक्सप्रेस रुचियां',
    FEATURE_CONTACT_VIEWS_25: '25 संपर्क दृश्य',
    FEATURE_IMAGE_UPLOAD_50: '50 छवि अपलोड',
    
    // Gallery
    MY_GALLERY: 'मेरी गैलरी',
    YOU_HAVE_UPLOADED: 'आपने अपलोड किया है',
    IMAGES: 'छवियां',
    REMAINING_UPLOADS: 'शेष अपलोड:',
    NO_IMAGES_UPLOADED: 'अभी तक कोई छवि अपलोड नहीं की गई',
    CLICK_UPLOAD_IMAGES: 'अपनी गैलरी में फ़ोटो जोड़ने के लिए "छवियां अपलोड करें" पर क्लिक करें',
    UPLOAD_GUIDELINES: 'अपलोड दिशानिर्देश',
    GUIDELINE_CLEAR_PHOTOS: 'बेहतर प्रोफ़ाइल दृश्यता के लिए स्पष्ट, हाल की तस्वीरें अपलोड करें',
    GUIDELINE_FORMATS: 'समर्थित प्रारूप: JPG, PNG, JPEG (अधिकतम आकार: प्रति छवि 5MB)',
    GUIDELINE_AVOID: 'समूह फ़ोटो, धुंधली छवियों या अनुचित सामग्री से बचें',
    GUIDELINE_VISIBILITY: 'चेहरा स्पष्ट रूप से दिखने वाली प्रोफ़ाइल तस्वीरों को 3 गुना अधिक प्रतिक्रिया मिलती है',
    
    // My Interest
    MY_INTERESTS: 'मेरी रुचियां',
    INTERESTS_SENT_DESC: 'आपने अन्य सदस्यों को भेजी गई रुचियां',
    NO_INTERESTS_SENT: 'अभी तक कोई रुचि नहीं भेजी गई',
    
    // Interest Request
    INTEREST_REQUESTS: 'रुचि अनुरोध',
    INTEREST_REQUESTS_DESC: 'सदस्य जिन्होंने आपकी प्रोफ़ाइल में रुचि दिखाई है',
    
    // Ignored Lists
    IGNORED_MEMBERS: 'नजरअंदाज सदस्य',
    IGNORED_MEMBERS_DESC: 'सदस्य जिन्हें आपने नजरअंदाज करना चुना है',
    IGNORED_ON: 'नजरअंदाज किया गया: {date}',
    NO_IGNORED_DESC: 'आपने अभी तक किसी को नजरअंदाज नहीं किया है',
    
    // Messages
    MESSAGES: 'संदेश',
    YOUR_CONVERSATIONS: 'आपकी बातचीत',
    SELECT_CONVERSATION: 'एक बातचीत चुनें',
    CHOOSE_CHAT: 'संदेश भेजना शुरू करने के लिए सूची से एक चैट चुनें',
    TYPE_MESSAGE: 'एक संदेश लिखें...',
    ONLINE: 'ऑनलाइन',
    OFFLINE: 'ऑफलाइन',
    
    // Profile Settings
    PROFILE_SETTINGS: 'प्रोफ़ाइल सेटिंग्स',
    MANAGE_PROFILE_DESC: 'अपनी प्रोफ़ाइल जानकारी और प्राथमिकताएं प्रबंधित करें',
    PERSONAL_INFORMATION: 'व्यक्तिगत जानकारी',
    TELL_ABOUT_YOURSELF: 'हमें अपने बारे में बताएं...',
    PRIVACY_SETTINGS: 'गोपनीयता सेटिंग्स',
    SHOW_PROFILE_ALL: 'सभी सदस्यों को मेरी प्रोफ़ाइल दिखाएं',
    ALLOW_CONTACT: 'सदस्यों को मुझसे संपर्क करने की अनुमति दें',
    SHOW_ONLINE: 'दिखाएं जब मैं ऑनलाइन हूं',
    CHANGE_PASSWORD: 'पासवर्ड बदलें',
    CURRENT_PASSWORD: 'वर्तमान पासवर्ड',
    NEW_PASSWORD: 'नया पासवर्ड',
    CONFIRM_NEW_PASSWORD: 'नए पासवर्ड की पुष्टि करें',
    ENTER_CURRENT_PASSWORD: 'वर्तमान पासवर्ड दर्ज करें',
    ENTER_NEW_PASSWORD: 'नया पासवर्ड दर्ज करें',
    REENTER_NEW_PASSWORD: 'नया पासवर्ड फिर से दर्ज करें',
    
    // Profile Setting Placeholders
    PLACEHOLDER_EMAIL: 'your.email@example.com',
    PLACEHOLDER_PHONE: '+91 98765 43210',
    PLACEHOLDER_OCCUPATION: 'सॉफ्टवेयर इंजीनियर',
    PLACEHOLDER_INCOME: '₹ 8-10 लाख',
    PLACEHOLDER_EDUCATION: 'कंप्यूटर विज्ञान में B.Tech',
    PLACEHOLDER_COMPANY: 'ABC Technologies',
    
    // Shortlist (placeholder for future)
    SHORTLIST: 'शॉर्टलिस्ट',
    MY_SHORTLIST: 'मेरी शॉर्टलिस्ट',
    
    // Actions
    SAVE_CHANGES: 'परिवर्तन सहेजें',
    CANCEL: 'रद्द करें',
    CHANGES_SAVED: 'परिवर्तन सहेजे गए!',
    PROFILE_UPDATED_SUCCESSFULLY: 'आपकी प्रोफ़ाइल सफलतापूर्वक अपडेट की गई है।',
    LANGUAGE: 'भाषा',
    LOGOUT: 'लॉगआउट',
  },
  ta: tamilTranslations,
  te: teluguTranslations,
};

const LanguageContext = createContext<LangContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguageState] = useState<Lang>('en');

  useEffect(() => {
    try {
      const stored = localStorage.getItem('lang') as Lang | null;
      if (stored === 'en' || stored === 'hi' || stored === 'ta' || stored === 'te') setLanguageState(stored);
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Update HTML lang attribute when language changes
    if (typeof document !== 'undefined') {
      document.documentElement.setAttribute('lang', language);
    }
  }, [language]);

  const setLanguage = (l: Lang) => {
    setLanguageState(l);
    try {
      localStorage.setItem('lang', l);
    } catch (e) {
      // ignore
    }
  };

  const t = (key: string) => {
    return translations[language]?.[key] ?? translations['en'][key] ?? key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useTranslation must be used within LanguageProvider');
  return ctx;
};

export default LanguageProvider;
