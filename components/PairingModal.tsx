import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface PairingModalProps {
  title: string;
  description: string;
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
  onCancelPress: () => void;
  onAllowPress: () => void;
}

const PairingModal: React.FC<PairingModalProps> = ({
  title,
  description,
  onCancelPress,
  onAllowPress,
  modalVisible,
  setModalVisible,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View className="flex-1 justify-end bg-black/40">
        <View
          className="bg-white rounded-t-3xl px-6 pt-6 pb-10 mx-4
                "
        >
          <Text className="text-2xl font-poppins-bold mb-4">{title}</Text>
          <Text className="text-gray-600 mb-6 font-poppins-sans">
            {description}
          </Text>

          <View className="w-full h-px bg-gray-300 mb-6" />

          <View className="flex-row items-center justify-between">
            <TouchableOpacity onPress={onCancelPress}>
              <Text className="text-gray-600 font-poppins-medium">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="bg-gray-800 px-6 py-2 rounded-full"
              onPress={onAllowPress}
            >
              <Text className="text-white font-poppins-medium">Pair</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default PairingModal;
