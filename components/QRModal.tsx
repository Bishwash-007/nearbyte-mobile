import * as Clipboard from 'expo-clipboard';
import {
  Modal,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import Icon from './Icon';

interface QRModalProps {
  visible: boolean;
  qrURL: string;
  onClose: () => void;
  value: string;
}

const QRModal: React.FC<QRModalProps> = ({
  visible,
  onClose,
  value,
  qrURL,
}) => {
  // handlers
  const handleCopy = async (text: string) => {
    await Clipboard.setStringAsync(text);
  };

  const handleShare = async (text: string) => {
    await Share.share(
      {
        title: 'Share QR URL',
        message: text,
        url: text,
      },
      {
        dialogTitle: 'Share QR URL',
      },
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={onClose}
      >
        <Pressable
          className="flex flex-col justify-center items-center bg-white rounded-lg px-6 pt-6 pb-14 w-11/12"
          onPress={() => {}}
        >
          <Text className="text-2xl font-poppins-semibold mb-2">
            My QR Code
          </Text>
          <Text className="text-gray-500 text-sm font-sans mb-8">
            Let nearby devices scan this to connect with you..
          </Text>

          {/* QR code */}
          <View className="items-center py-4">
            <QRCode value={qrURL || value} size={220} />
          </View>

          <View className="flex flex-row items-center gap-2">
            <Text
              className="p-2 bg-gray-100 font-sans text-sm rounded-md w-2/4"
              numberOfLines={1}
              lineBreakMode="clip"
              ellipsizeMode="tail"
            >
              {qrURL || value}
            </Text>
            <TouchableOpacity
              className="bg-white p-2 rounded-2xl"
              onPress={() => handleCopy(qrURL || value)}
            >
              <Icon name="Copy" size={20} color="#000000" />
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-white p-2 rounded-2xl"
              onPress={() => handleShare(qrURL || value)}
            >
              <Icon name="Share" size={20} color="#000000" />
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default QRModal;
