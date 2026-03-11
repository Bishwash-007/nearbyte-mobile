import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmModalProps {
  visible: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = false,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={onCancel}
      >
        <Pressable
          className="bg-white rounded-2xl p-6 w-11/12 gap-4"
          onPress={() => {}}
        >
          {/* Header */}
          <View className="gap-1">
            <Text className="text-xl font-poppins-semibold text-gray-900">
              {title}
            </Text>
            <Text className="text-sm font-sans text-gray-500 leading-5">
              {description}
            </Text>
          </View>

          {/* Actions  */}
          <View className="flex-row gap-3 mt-2">
            <TouchableOpacity
              className="flex-1 border border-gray-300 py-3 rounded-xl items-center"
              onPress={onCancel}
            >
              <Text className="font-poppins-medium text-gray-600">
                {cancelLabel}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-1 py-3 rounded-xl items-center 
								bg-gray-900
							"
              onPress={onConfirm}
            >
              <Text className="font-poppins-medium text-white">
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default ConfirmModal;
