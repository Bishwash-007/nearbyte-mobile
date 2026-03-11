import * as icons from 'lucide-react-native/icons';
import { Text, TouchableOpacity, TouchableOpacityProps } from 'react-native';
import Icon from './Icon';

type ButtonVariant = 'filled' | 'outline' | 'ghost';
type IconPosition = 'left' | 'right';

interface CustomButtonProps extends TouchableOpacityProps {
  label: string;
  variant?: ButtonVariant;
  icon?: keyof typeof icons;
  iconSize?: number;
  iconPosition?: IconPosition;
}

const containerClass: Record<ButtonVariant, string> = {
  filled: 'bg-gray-800 px-6 py-2 rounded-lg flex-row items-center gap-2 h-12',
  outline:
    'border border-gray-600 px-4 py-2 rounded-lg flex-row items-center gap-2 h-12',
  ghost: 'flex-row items-center gap-2 h-12',
};

const labelClass: Record<ButtonVariant, string> = {
  filled: 'text-white font-poppins-medium',
  outline: 'text-gray-600 font-poppins-medium',
  ghost: 'text-gray-600 font-poppins-medium',
};

const iconColor: Record<ButtonVariant, string> = {
  filled: '#FFFFFF',
  outline: '#000000',
  ghost: '#4B5563',
};

const Button: React.FC<CustomButtonProps> = ({
  label,
  variant = 'filled',
  icon,
  iconSize = 20,
  iconPosition = 'left',
  className,
  ...props
}) => {
  const iconEl = icon ? (
    <Icon name={icon} size={iconSize} color={iconColor[variant]} />
  ) : null;

  return (
    <TouchableOpacity
      className={`${containerClass[variant]}${className ? ` ${className}` : ''}`}
      {...props}
    >
      {iconPosition === 'left' && iconEl}
      <Text className={labelClass[variant]}>{label}</Text>
      {iconPosition === 'right' && iconEl}
    </TouchableOpacity>
  );
};

export default Button;
