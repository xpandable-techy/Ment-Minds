import React from 'react';

export type AnimateVariant = 'fade' | 'pop' | 'success';

interface AnimateProps {
  variant?: AnimateVariant;
  className?: string;
  children?: React.ReactNode;
}

const VARIANT_CLASS: Record<AnimateVariant, string> = {
  fade: 'animate-fadeIn',
  pop: 'animate-pop',
  success: 'animate-success',
};

export const Animate: React.FC<AnimateProps> = ({ variant = 'fade', className = '', children }) => {
  const v = VARIANT_CLASS[variant];
  return <div className={`${v} ${className}`.trim()}>{children}</div>;
};

export default Animate;
