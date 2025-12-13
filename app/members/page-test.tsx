'use client';

import { useTranslation } from '@/context/LanguageProvider';

export default function MembersPage() {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen pt-16">
      <h1>Members Page</h1>
      <p>{t('MEMBERS')}</p>
    </div>
  );
}
