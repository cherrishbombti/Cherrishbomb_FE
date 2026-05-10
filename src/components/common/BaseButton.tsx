import React from 'react';

type Variant = 'primary' | 'secondary' | 'text';
type Size = 'small' | 'medium' | 'large';
type BtnType = 'button' | 'submit' | 'reset';
type IconPosition = 'left' | 'right';

interface BaseButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  type?: BtnType;
  iconOnly?: boolean;
  iconPosition?: IconPosition;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-blue-500 text-white hover:bg-blue-600',
  secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
  text: 'bg-transparent text-blue-500 hover:underline',
};

const sizeStyles: Record<Size, string> = {
  small: 'px-3 py-1 text-sm',
  medium: 'px-4 py-2 text-base',
  large: 'px-6 py-3 text-lg',
};

const BaseButton: React.FC<BaseButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  className = '',
  type = 'button',
  iconOnly = false,
  iconPosition = 'left',
}) => {
  const handleClick = () => {
    if (loading || disabled) return;
    onClick?.();
  };

  const iconOnlyStyle = iconOnly ? 'p-2' : sizeStyles[size];

  const baseStyle = [
    'inline-flex items-center justify-center',
    'rounded-md font-medium',
    'transition-colors duration-200',
    'focus:outline-none',
    variantStyles[variant],
    iconOnlyStyle,
    disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
    className,
  ].filter(Boolean).join(' ');

  return (
    <button
      type={type}
      className={baseStyle}
      onClick={handleClick}
      disabled={disabled || loading}
    >
      {loading ? (
        <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
      ) : iconPosition === 'left' ? (
        <>{children}</>
      ) : (
        <span className="flex flex-row-reverse items-center gap-2">{children}</span>
      )}
    </button>
  );
};

export default BaseButton;
