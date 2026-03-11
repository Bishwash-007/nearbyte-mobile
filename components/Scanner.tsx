import { CameraView } from 'expo-camera';
import { useRef } from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';
import Icon from './Icon';

export interface ScannerModalProps {
  description: string;
  modalVisible: boolean;
  onClose?: () => void;
  onScanComplete?: (data: string) => void;
}

const ScannerModal: React.FC<ScannerModalProps> = ({
  description,
  modalVisible,
  onClose,
  onScanComplete,
}) => {
  const scanned = useRef(false);

  const handleClose = () => {
    scanned.current = false;
    onClose?.();
  };

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    if (scanned.current) return;
    scanned.current = true;
    console.log('[scanner] QR scanned:', data);
    onClose?.();
    onScanComplete?.(data);
  };

  return (
    <Modal
      visible={modalVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black">
        {/* Camera View with overlay and close button */}
        <CameraView
          facing="back"
          style={{ flex: 1 }}
          barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          onBarcodeScanned={handleBarCodeScanned}
        />

        <TouchableOpacity
          className="absolute top-12 right-6 p-2 bg-black/50 rounded-full"
          onPress={handleClose}
        >
          <Icon name="X" size={24} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Viewfinder overlay */}
        <View className="absolute inset-0 items-center justify-center">
          {/* Corner brackets */}
          <View className="w-56 h-56 relative">
            <View className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-white rounded-tl-md" />
            <View className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-white rounded-tr-md" />
            <View className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-white rounded-bl-md" />
            <View className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-white rounded-br-md" />
          </View>
          <Text
            className="text-white font-poppins-medium text-sm mt-6 opacity-80 text-center px-12"
            numberOfLines={3}
            lineBreakMode="head"
            ellipsizeMode="clip"
          >
            {description}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default ScannerModal;
