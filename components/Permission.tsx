import { Checkbox } from 'expo-checkbox';
import { useState } from 'react';
import { Modal, Pressable, Text, TouchableOpacity, View } from 'react-native';

type PermissionTypes =
  | 'camera'
  | 'location'
  | 'storage'
  | 'notifications'
  | 'wifi'
  | 'bluetooth'
  | 'background'
  | 'pairing';

interface PermissionModalProps {
  permissionType: PermissionTypes;

  // generic props for all permissions
  visible: boolean;
  title: string;
  description: string;

  // for checkbox permissions like pairing
  prompt?: string;
  action?: () => void;

  // override the default "Allow" button label
  grantLabel?: string;

  onGrant: () => void;
  onDeny?: () => void;
}

const PermissionModal: React.FC<PermissionModalProps> = ({
  permissionType,
  visible,
  title,
  description,
  prompt,
  action,
  grantLabel = 'Allow',
  onGrant,
  onDeny,
}) => {
  const [checked, setChecked] = useState(false);
  const isPairing = permissionType === 'pairing';

  const handleGrant = () => {
    if (isPairing && checked) action?.();
    onGrant();
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <Pressable
        className="flex-1 justify-center items-center bg-black/50"
        onPress={onDeny}
      >
        <Pressable
          className="bg-white rounded-2xl p-6 w-11/12 gap-4"
          onPress={() => {}}
        >
          {/* Header  */}
          <View className="gap-1">
            <Text className="text-xl font-poppins-semibold text-gray-900">
              {title}
            </Text>
            <Text className="text-sm font-sans text-gray-500 leading-5">
              {description}
            </Text>
          </View>

          {/* Checkbox for pairing */}
          {isPairing && prompt ? (
            <TouchableOpacity
              className="flex-row items-center gap-3"
              onPress={() => setChecked((v) => !v)}
              activeOpacity={0.7}
            >
              <Checkbox
                value={checked}
                onValueChange={setChecked}
                color={checked ? '#1f2937' : undefined}
              />
              <Text className="flex-1 text-sm font-sans text-gray-700">
                {prompt}
              </Text>
            </TouchableOpacity>
          ) : null}

          {/* Actions */}
          <View className="flex-row gap-3 mt-2">
            {onDeny ? (
              <TouchableOpacity
                className="flex-1 border border-gray-300 py-3 rounded-xl items-center"
                onPress={onDeny}
              >
                <Text className="font-poppins-medium text-gray-600">Deny</Text>
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              className="flex-1 bg-gray-900 py-3 rounded-xl items-center"
              onPress={handleGrant}
              disabled={isPairing && !checked}
              style={{ opacity: isPairing && !checked ? 0.4 : 1 }}
            >
              <Text className="font-poppins-medium text-white">
                {grantLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default PermissionModal;
