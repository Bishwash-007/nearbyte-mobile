import { type LucideIcon as LucideIconType } from 'lucide-react-native';
import * as icons from 'lucide-react-native/icons';

interface IconProps {
  name: keyof typeof icons;
  color?: string;
  size?: number;
}

const iconsMap = icons as Record<keyof typeof icons, LucideIconType>;

const Icon: React.FC<IconProps> = ({ name, color, size }) => {
  const LucideIcon = iconsMap[name];

  return <LucideIcon color={color} size={size} />;
};

export default Icon;
