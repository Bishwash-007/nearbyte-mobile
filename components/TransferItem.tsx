import { View } from 'lucide-react-native';

interface TransferItemProps {
  fileName: string;
  fileSize: number;
  fileType: string;
  previewUrl?: string;

  progress: {
    percentage: number;
    transferredBytes: number;
    totalBytes: number;
  };

  status: 'pending' | 'sending' | 'receiving' | 'done' | 'failed';
}

const TransferItem: React.FC<TransferItemProps> = ({
  fileName,
  fileSize,
  fileType,
  progress,
  status,
}) => {
  return <View></View>;
};

export default TransferItem;
