import Icon from '@/components/Icon';
import { avatars } from '@/constants/avatar';
import {
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import useSessionStore from '@/store/useSessionStore';
import type { TransferState } from '@/store/useTransferStore';
import useTransferStore from '@/store/useTransferStore';
import useUserStore from '@/store/useUserStore';

const STATUS_COLORS: Record<TransferState['status'], string> = {
  pending: 'bg-gray-300',
  sending: 'bg-blue-400',
  receiving: 'bg-yellow-400',
  completed: 'bg-green-400',
  error: 'bg-red-400',
};

const Sharing = () => {
  const { connectedDevice, activeSocket, disconnect, myDeviceName } =
    useSessionStore();
  const { avatarId, userName } = useUserStore();
  const {
    pendingFiles,
    transfers,
    addFromImagePicker,
    addFromDocumentPicker,
    removeFile,
    sendAll,
    clearCompleted,
  } = useTransferStore();

  const isConnected = activeSocket != null;

  const myAvatar =
    avatarId != null
      ? (avatars.find((item) => item.id === avatarId) ?? avatars[0])
      : avatars[0];

  function getPeerAvatar() {
    if (!connectedDevice) return avatars[0].source;
    const id = parseInt(connectedDevice.avatar, 10);
    return (
      avatars.find((avatar) => avatar.id === id)?.source ?? avatars[0].source
    );
  }

  const handlePickMedia = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        'Permission required',
        'Permission to access the media library is required.',
      );
      return;
    }

    const results = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images', 'videos'],
      allowsEditing: false,
      quality: 1,
      allowsMultipleSelection: true,
      orderedSelection: true,
      videoQuality: ImagePicker.UIImagePickerControllerQualityType.High,
    });

    if (!results.canceled) {
      addFromImagePicker(results.assets);
    }
  };

  const handlePickFilesOrFolder = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        copyToCacheDirectory: true,
        multiple: true,
        type: '*/*',
      });
      if (!result.canceled) {
        addFromDocumentPicker(result.assets);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSend = () => {
    if (!isConnected) {
      Alert.alert('Not connected', 'Connect to a device before sending.');
      return;
    }
    sendAll(activeSocket);
  };

  const activeList = Object.values(transfers).filter(
    (item) => item.status !== 'completed' && item.status !== 'error',
  );
  const doneList = Object.values(transfers).filter(
    (item) => item.status === 'completed' || item.status === 'error',
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-6 h-full flex justify-between">
      {/* Connection Details */}
      <View className="flex flex-row justify-between items-center py-4">
        {/* Me */}
        <View className="items-center gap-1">
          <View className="p-2 aspect-square border-hairline rounded-full">
            <Image
              source={myAvatar.source}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
          </View>
          <Text className="font-poppins-medium text-sm">
            {userName || 'Me'}
          </Text>
          <Text className="text-xs font-sans text-gray-500">
            {myDeviceName}
          </Text>
        </View>

        {/* Connection status */}
        <TouchableOpacity onPress={disconnect}>
          {isConnected ? (
            <View className="flex flex-col items-center gap-1">
              <Icon name="Wifi" size={18} />
              <Text className="text-xs font-sans">Connected</Text>
            </View>
          ) : (
            <View className="flex flex-col items-center gap-1">
              <Icon name="WifiOff" size={18} />
              <Text className="text-xs font-sans">Disconnected</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Peer */}
        <View className="items-center gap-1">
          <View className="p-2 aspect-square border-hairline rounded-full">
            <Image
              source={getPeerAvatar()}
              className="w-10 h-10 rounded-full"
              resizeMode="cover"
            />
          </View>
          <Text className="font-poppins-medium text-sm">
            {connectedDevice?.userName ?? '—'}
          </Text>
          <Text className="text-xs font-sans text-gray-500">
            {connectedDevice?.deviceName ?? ''}
          </Text>
        </View>
      </View>

      {/* Pending queue */}
      {pendingFiles.length > 0 && (
        <View className="flex-1">
          <Text className="text-sm font-poppins-medium mb-2">
            Ready to send ({pendingFiles.length})
          </Text>
          <FlatList
            data={pendingFiles}
            keyExtractor={(item) => item.id}
            className="flex-1"
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between py-2 border-b border-gray-100">
                <View className="flex-1 mr-4">
                  <Text
                    className="text-sm font-poppins-medium"
                    numberOfLines={1}
                  >
                    {item.name}
                  </Text>
                  <Text className="text-xs font-sans text-gray-500">
                    {(item.size / 1024).toFixed(1)} KB · {item.type}
                  </Text>
                </View>
                <TouchableOpacity onPress={() => removeFile(item.id)}>
                  <Icon name="X" size={16} color="#9ca3af" />
                </TouchableOpacity>
              </View>
            )}
          />
          <TouchableOpacity
            onPress={handleSend}
            className="mt-3 bg-black rounded-xl py-3 items-center"
          >
            <Text className="text-white font-poppins-medium">Send All</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Active transfers */}
      {activeList.length > 0 && (
        <View className="mt-4">
          <Text className="text-sm font-poppins-medium mb-2">Transferring</Text>
          {activeList.map((item) => (
            <View key={item.file.id} className="mb-3">
              <View className="flex-row justify-between mb-1">
                <Text
                  className="text-xs font-poppins-medium flex-1 mr-4"
                  numberOfLines={1}
                >
                  {item.file.name}
                </Text>
                <Text className="text-xs font-sans text-gray-500">
                  {item.progress}%
                </Text>
              </View>
              <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <View
                  className={`h-full ${STATUS_COLORS[item.status]} rounded-full`}
                  style={{ width: `${item.progress}%` }}
                />
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Completed / errored */}
      {doneList.length > 0 && (
        <View className="mt-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-poppins-medium">Completed</Text>
            <TouchableOpacity onPress={clearCompleted}>
              <Text className="text-xs font-sans text-gray-400">Clear</Text>
            </TouchableOpacity>
          </View>
          {doneList.map((item) => (
            <View
              key={item.file.id}
              className="flex-row items-center justify-between py-2 border-b border-gray-100"
            >
              <Text
                className="text-xs font-poppins-medium flex-1 mr-4"
                numberOfLines={1}
              >
                {item.file.name}
              </Text>
              <View
                className={`w-2 h-2 rounded-full ${STATUS_COLORS[item.status]}`}
              />
            </View>
          ))}
        </View>
      )}

      {/* File Pickers */}
      <View className="flex-row items-center justify-end gap-4 mb-4 mt-4">
        <TouchableOpacity
          onPress={handlePickFilesOrFolder}
          className="bg-primary rounded-full p-4"
        >
          <Icon name="File" size={24} color="#000000" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handlePickMedia}
          className="bg-primary rounded-full p-4"
        >
          <Icon name="Image" size={24} color="#000000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Sharing;
