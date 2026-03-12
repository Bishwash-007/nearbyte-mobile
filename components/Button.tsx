import * as icons from 'lucide-react-native/icons';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Icon from './Icon';

type ButtonVariant = 'filled' | 'outline' | 'ghost' | 'icon';
type IconPosition = 'left' | 'right';

interface CustomButtonProps extends TouchableOpacityProps {
  label?: string;
  variant?: ButtonVariant;
  icon?: keyof typeof icons;
  iconSize?: number;
  iconPosition?: IconPosition;
  iconColor?: string;
  labelClassName?: string;
}

// Layout only — never overridden by callers
const layoutClass: Record<ButtonVariant, string> = {
  filled: 'flex-row items-center justify-center gap-2 h-14 px-6 py-2',
  outline: 'flex-row items-center justify-center gap-2 h-14 px-4 py-2',
  ghost: 'flex-row items-center justify-center gap-2 h-14',
  icon: 'items-center justify-center w-12 h-12',
};

// Visual defaults — replaced entirely when className is provided
const defaultVisualClass: Record<ButtonVariant, string> = {
  filled: 'bg-gray-800 rounded-lg',
  outline: 'border border-gray-600 rounded-lg',
  ghost: '',
  icon: 'bg-gray-100 rounded-full',
};

const defaultLabelClass: Record<ButtonVariant, string> = {
  filled: 'text-white font-poppins-medium',
  outline: 'text-gray-600 font-poppins-medium',
  ghost: 'text-gray-600 font-poppins-medium',
  icon: '',
};

const defaultIconColor: Record<ButtonVariant, string> = {
  filled: '#FFFFFF',
  outline: '#000000',
  ghost: '#4B5563',
  icon: '#000000',
};

const Button: React.FC<CustomButtonProps> = ({
  label,
  variant = 'filled',
  icon,
  iconSize = 20,
  iconPosition = 'left',
  iconColor,
  labelClassName,
  className,
  ...props
}) => {
  const resolvedIconColor = iconColor ?? defaultIconColor[variant];
  const resolvedVisual = className ?? defaultVisualClass[variant];
  const resolvedLabelClass = labelClassName ?? defaultLabelClass[variant];

  const iconEl = icon ? (
    <Icon name={icon} size={iconSize} color={resolvedIconColor} />
  ) : null;

  if (variant === 'icon') {
    return (
      <TouchableOpacity
        className={`${layoutClass.icon} ${resolvedVisual}`}
        {...props}
      >
        {iconEl}
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={`${layoutClass[variant]} ${resolvedVisual}`}
      {...props}
    >
      {iconPosition === 'left' && iconEl}
      {label && <Text className={resolvedLabelClass}>{label}</Text>}
      {iconPosition === 'right' && iconEl}
    </TouchableOpacity>
  );
};

export default Button;
