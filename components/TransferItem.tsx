import Icon from '@/components/Icon';
import { Image, Text, TouchableOpacity, View } from 'react-native';

interface TransferItemProps {
  fileName: string;
  fileSize: number;
  fileType: 'image' | 'video' | 'audio' | 'document' | 'other';
  previewUrl?: string;

  progress: {
    percentage: number;
    transferredBytes: number;
    totalBytes: number;
  };

  status: 'pending' | 'sending' | 'receiving' | 'done' | 'failed';
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024)
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
}

const TransferItem: React.FC<TransferItemProps> = ({
  fileName,
  fileSize,
  fileType,
  previewUrl,
  progress,
  status,
}) => {
  const isActive = status === 'sending' || status === 'receiving';
  const isDone = status === 'done';
  const isFailed = status === 'failed';
  const showProgress = isActive || isDone;

  return (
    <View className="flex-row items-center gap-3 py-3 border-b border-gray-100">
      {/* Thumbnail / Type icon */}

      <View>
        <TouchableOpacity>
          {fileType === 'image' && previewUrl && (
            <Image
              source={{ uri: previewUrl }}
              className="w-28 aspect-square rounded-lg bg-gray-200"
            />
          )}

          {fileType === 'video' && (
            <View className="w-28 aspect-square rounded-lg bg-black/90 items-center justify-center">
              <View className="items-center justify-center bg-white/15 p-4 rounded-full">
                <Icon name="Play" size={28} color="#ffffff" />
              </View>
            </View>
          )}

          {fileType === 'audio' && (
            <View className="flex flex-row gap-2 items-start">
              <View className="w-14 aspect-square rounded-lg bg-red-400 items-center justify-center">
                <Icon name="Music" size={18} color="#ffffff" />
              </View>

              <Text className="text font-sans">{fileName}</Text>
              <Text className="text-xs text-gray-500">
                {formatBytes(fileSize)}
              </Text>
            </View>
          )}

          {fileType === 'document' && (
            <View className="w-28 aspect-square rounded-lg bg-black/90 items-center justify-center">
              <View className="items-center justify-center bg-white/15 p-4 rounded-full">
                <Icon name="File" size={28} color="#ffffff" />
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TransferItem;
