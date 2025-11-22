'use client';

import React, { useEffect, useState } from 'react';

type Props = {
  words?: string[];
  typingSpeed?: number;
  deletingSpeed?: number;
  pauseAfterTyped?: number;
  className?: string;
};

export default function RotatingWords({
  words = ['Perfect Match', 'True Love', 'Soulmate', 'Forever Partner'],
  typingSpeed = 100,
  deletingSpeed = 50,
  pauseAfterTyped = 1500,
  className = '',
}: Props) {
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];

    const timeout = setTimeout(() => {
      if (!isDeleting && charIndex < currentWord.length) {
        // Typing
        setCharIndex(charIndex + 1);
      } else if (!isDeleting && charIndex === currentWord.length) {
        // Pause after typing complete
        setTimeout(() => setIsDeleting(true), pauseAfterTyped);
      } else if (isDeleting && charIndex > 0) {
        // Deleting
        setCharIndex(charIndex - 1);
      } else if (isDeleting && charIndex === 0) {
        // Move to next word
        setIsDeleting(false);
        setWordIndex((wordIndex + 1) % words.length);
      }
    }, isDeleting ? deletingSpeed : typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseAfterTyped]);

  const displayText = words[wordIndex].slice(0, charIndex);
  
  // Calculate the longest word to reserve space and prevent layout shift
  const longestWord = words.reduce((a, b) => a.length > b.length ? a : b, '');

  return (
    <span className={`inline-block ${className}`} style={{ minWidth: `${longestWord.length * 0.6}em` }}>
      <span className="inline-block">{displayText}</span>
      <span className="inline-block w-0.5 h-[0.8em] ml-1 bg-current animate-pulse align-middle" />
    </span>
  );
}
