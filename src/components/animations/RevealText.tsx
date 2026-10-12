import React from 'react';
import { useMotionPreference } from './MotionPreferenceProvider';

interface RevealTextProps {
  text: string;
  className?: string;
  goldWords?: string[];
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
}

export const RevealText: React.FC<RevealTextProps> = ({
  text,
  className = '',
  goldWords = ['DISCIPLINE', 'CONSISTENCY', 'AMBITION', 'SUCCESS', 'FOCUS', 'UNSTOPPABLE', 'FUTURE', 'TODAY'],
  as: Component = 'span',
}) => {
  const { prefersReducedMotion } = useMotionPreference();

  const words = text.split(' ');

  if (prefersReducedMotion) {
    return (
      <Component className={className}>
        {words.map((word, index) => {
          const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
          const isGold = goldWords.includes(cleanWord);
          return (
            <span
              key={index}
              className={isGold ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFE08A] to-[#D4AF37]' : ''}
            >
              {word}{' '}
            </span>
          );
        })}
      </Component>
    );
  }

  return (
    <Component className={className}>
      {words.map((word, index) => {
        const cleanWord = word.replace(/[^a-zA-Z]/g, '').toUpperCase();
        const isGold = goldWords.includes(cleanWord);

        return (
          <span
            key={index}
            className={`inline-block transition-all duration-300 mr-[0.25em] ${
              isGold
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-[#FFF5CC] via-[#FFE08A] to-[#D4AF37] font-bold drop-shadow-[0_2px_18px_rgba(255,224,138,0.4)]'
                : 'text-white'
            }`}
          >
            {word}
          </span>
        );
      })}
    </Component>
  );
};
