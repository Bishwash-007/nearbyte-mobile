import Icon from '@/components/Icon';
import PermissionModal from '@/components/Permission';
import { avatars } from '@/constants/avatar';
import {
  FlatList,
  Image,
  Modal,
  Platform,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';

import Button from '@/components/Button';
import useSessionStore from '@/store/useSessionStore';
import type { TransferState } from '@/store/useTransferStore';
import useTransferStore from '@/store/useTransferStore';
import useUserStore from '@/store/useUserStore';
import { useState } from 'react';
import TransferItem from '@/components/TransferItem';

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
    // sendAll,
    clearCompleted,
  } = useTransferStore();

  const isConnected = activeSocket != null;

  // states

  const [isModalVisible, setModalVisible] = useState(false);
  const [mediaPermissionVisible, setMediaPermissionVisible] = useState(false);

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
      setMediaPermissionVisible(true);
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

  let activeList = Object.values(transfers).filter(
    (item) => item.status !== 'completed' && item.status !== 'error',
  );

  const handleSend = () => {
    // if (!isConnected) {
    //   Alert.alert('Not connected', 'Connect to a device before sending.');
    //   return;
    // }
    // sendAll(activeSocket);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Preparing to send files...', ToastAndroid.SHORT);
    }

    // Just for testing UI, move pending files to active list without sending
    activeList = [
      ...activeList,
      ...pendingFiles.map((file) => ({
        file,
        progress: 0,
        status: 'pending' as const,
        timestamp: new Date(),
      })),
    ];
    pendingFiles.length = 0;
  };

  // const activeList = Object.values(transfers).filter(
  //   (item) => item.status !== 'completed' && item.status !== 'error',
  // );
  const doneList = Object.values(transfers).filter(
    (item) => item.status === 'completed' || item.status === 'error',
  );

  return (
    <SafeAreaView className="flex-1 bg-white px-6 h-full flex justify-start">
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

      <TransferItem
        fileName="vacation.jpg"
        fileSize={2_400_000}
        fileType="image"
        previewUrl="file:///path/to/vacation.jpg"
        progress={{
          percentage: 50,
          transferredBytes: 1_200_000,
          totalBytes: 2_400_000,
        }}
        status="sending"
      />

      <TransferItem
        fileName="recording.mp4"
        fileSize={85_000_000}
        fileType="video"
        progress={{
          percentage: 0,
          transferredBytes: 0,
          totalBytes: 85_000_000,
        }}
        status="pending"
      />

      <TransferItem
        fileName="track.mp3"
        fileSize={5_100_000}
        fileType="audio"
        progress={{
          percentage: 72,
          transferredBytes: 3_672_000,
          totalBytes: 5_100_000,
        }}
        status="receiving"
      />

      <TransferItem
        fileName="report.pdf"
        fileSize={1_024_000}
        fileType="document"
        progress={{
          percentage: 100,
          transferredBytes: 1_024_000,
          totalBytes: 1_024_000,
        }}
        status="done"
      />

      <TransferItem
        fileName="archive.zip"
        fileSize={45_000_000}
        fileType="other"
        progress={{
          percentage: 34,
          transferredBytes: 15_300_000,
          totalBytes: 45_000_000,
        }}
        status="failed"
      />

      {/* Pending files preview strip */}
      {pendingFiles.length > 0 && (
        <FlatList
          data={pendingFiles}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
          renderItem={({ item }) => (
            <View className="items-center gap-1 self-end" style={{ width: 72 }}>
              {/* Tile */}
              <View
                className="rounded-md overflow-hidden bg-gray-100"
                style={{ width: 72, height: 72 }}
              >
                {item.type === 'image' ? (
                  <Image
                    source={{ uri: item.uri }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                ) : item.type === 'video' ? (
                  <View className="flex-1 bg-gray-800 items-center justify-center">
                    <Icon name="Play" size={24} color="#ffffff" />
                  </View>
                ) : item.type === 'audio' ? (
                  <View className="flex-1 bg-gray-100 items-center justify-center">
                    <Icon name="Music" size={24} color="#6b7280" />
                  </View>
                ) : (
                  <View className="flex-1 bg-gray-100 items-center justify-center">
                    <Icon name="FileText" size={24} color="#6b7280" />
                  </View>
                )}
                {/* Remove button */}
                <TouchableOpacity
                  onPress={() => removeFile(item.id)}
                  className="absolute top-0 right-0 bg-black/50 rounded-full p-0.5 z-40"
                >
                  <Icon name="X" size={12} color="#ffffff" />
                </TouchableOpacity>
              </View>
              {/* File name */}
              <Text
                className="text-xs font-sans text-gray-500 text-center"
                numberOfLines={1}
                ellipsizeMode="middle"
              >
                {item.name}
              </Text>
            </View>
          )}
        />
      )}

      <PermissionModal
        permissionType="storage"
        visible={mediaPermissionVisible}
        title="Media Library Access"
        description="Permission to access your media library is required to pick images and videos."
        grantLabel="Allow"
        onGrant={() => {
          setMediaPermissionVisible(false);
          handlePickMedia();
        }}
        onDeny={() => setMediaPermissionVisible(false)}
      />

      <Modal
        visible={isModalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          {/* Backdrop */}
          <TouchableOpacity
            className="absolute inset-0 bg-black/40"
            activeOpacity={1}
            onPress={() => setModalVisible(false)}
          />
          {/* Bottom Sheet */}
          <View className="bg-white rounded-t-3xl px-6 pt-6 pb-8">
            {/* Drag Handle */}
            <View className="w-10 h-1 bg-gray-300  self-center mb-4" />
            <Text className="text-sm font-poppins-medium mb-4 text-gray-500">
              Pick files to send
            </Text>
            {/* File Pickers */}
            <View className="flex-row gap-8 py-4 justify-center">
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  handlePickFilesOrFolder();
                }}
                className="items-center gap-2"
              >
                <View className="bg-gray-50 rounded-2xl p-4">
                  <Icon name="Folder" size={24} color="#000000" />
                </View>
                <Text className="text-xs font-poppins-medium">Files</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  setModalVisible(false);
                  handlePickMedia();
                }}
                className="items-center gap-2"
              >
                <View className="bg-gray-50 rounded-2xl p-4">
                  <Icon name="Image" size={24} color="#000000" />
                </View>
                <Text className="text-xs font-poppins-medium">Media</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <View className="flex flex-row gap-4 mt-4 justify-between items-center w-full">
        <Button
          label="Pick files to send"
          onPress={() => setModalVisible(true)}
          variant="outline"
          className="border-hairline px-6 rounded-2xl flex-1"
        />
        {pendingFiles.length > 0 && (
          <Button
            label="Send"
            icon="Send"
            onPress={handleSend}
            className="bg-black rounded-2xl"
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default Sharing;

// {activeList.length > 0 && (
//   <View className="mt-4">
//     <Text className="text-sm font-poppins-medium mb-2">Transferring</Text>
//     {activeList.map((item) => (
//       <View key={item.file.id} className="mb-3">
//         <View className="flex-row justify-between mb-1">
//           <Text
//             className="text-xs font-poppins-medium flex-1 mr-4"
//             numberOfLines={1}
//           >
//             {item.file.name}
//           </Text>
//           <Text className="text-xs font-sans text-gray-500">
//             {item.progress}%
//           </Text>
//         </View>
//         <View className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
//           <View
//             className={`h-full ${STATUS_COLORS[item.status]} rounded-full`}
//             style={{ width: `${item.progress}%` }}
//           />
//         </View>
//       </View>
//     ))}
//   </View>
// )}

// {doneList.length > 0 && (
//   <View className="mt-4">
//     <View className="flex-row justify-between items-center mb-2">
//       <Text className="text-sm font-poppins-medium">Completed</Text>
//       <TouchableOpacity onPress={clearCompleted}>
//         <Text className="text-xs font-sans text-gray-400">Clear</Text>
//       </TouchableOpacity>
//     </View>
//     {doneList.map((item) => (
//       <View
//         key={item.file.id}
//         className="flex-row items-center justify-between py-2 border-b border-gray-100"
//       >
//         <Text
//           className="text-xs font-poppins-medium flex-1 mr-4"
//           numberOfLines={1}
//         >
//           {item.file.name}
//         </Text>
//         <View
//           className={`w-2 h-2 rounded-full ${STATUS_COLORS[item.status]}`}
//         />
//       </View>
//     ))}
//   </View>
// )}
