import LottieView from 'lottie-react-native';
import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import QRModal from '@/components/QRModal';
import ScannerModal from '@/components/Scanner';
import { avatars } from '@/constants/avatar';
import { useRouter } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';

import useSessionStore from '@/store/useSessionStore';
import useUserStore from '@/store/useUserStore';

const Home = () => {
  const router = useRouter();
  const { avatarId, userName } = useUserStore();
  const {
    myIp,
    myDeviceName,
    devices,
    isScanning,
    setup,
    teardown,
    connectToDevice,
  } = useSessionStore();

  const [isQRVisible, setIsQRVisible] = useState<boolean>(false);
  const [isScannerModalVisible, setIsScannerModalVisible] =
    useState<boolean>(false);

  const myAvatar =
    avatarId != null
      ? (avatars.find((avatar) => avatar.id === avatarId) ?? avatars[0])
      : avatars[0];

  const init = useCallback(async () => {
    await setup(userName, String(avatarId ?? 1));
  }, [userName, avatarId, setup]);

  useEffect(() => {
    init();
    return () => teardown();
  }, [init, teardown]);

  function getDeviceAvatar(avatarStr: string) {
    const id = parseInt(avatarStr, 10);
    return (
      avatars.find((avatar) => avatar.id === id)?.source ?? avatars[0].source
    );
  }

  function handleConnectToDevice(device: (typeof devices)[number]) {
    connectToDevice(device);
    router.push({ pathname: '/sharing' });
  }

  return (
    <SafeAreaView className="flex-1 bg-white px-6 h-full justify-start">
      <ScannerModal
        description="Scan QR codes to connect with other users, share your profile, or access"
        modalVisible={isScannerModalVisible}
        onClose={() => setIsScannerModalVisible(false)}
      />
      <QRModal
        qrURL={`nearbyte://${myIp}:9876`}
        value={`nearbyte://${myIp}:9876`}
        visible={isQRVisible}
        onClose={() => setIsQRVisible(false)}
      />

      {/* User Details */}
      <View className="py-2 flex-row items-center gap-4">
        <TouchableOpacity
          className="p-2 border-hairline rounded-full"
          onPress={() => {}}
        >
          <Image
            source={myAvatar.source}
            className="w-10 h-10 rounded-full"
            resizeMode="cover"
          />
        </TouchableOpacity>

        <View className="flex flex-col">
          <Text className="font-poppins-medium">{userName || 'Me'}</Text>
          <Text className="font-sans text-sm">{myDeviceName}</Text>
        </View>
      </View>

      {/* Available Devices */}
      <View className="flex-col gap-2 items-start w-full mt-4">
        <Text className="text-sm font-poppins-medium mb-2">
          {isScanning ? 'Scanning...' : 'Nearby Devices'}
        </Text>

        <FlatList
          data={devices}
          keyExtractor={(item) => item.deviceName}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-6"
          className="w-full"
          ListEmptyComponent={
            <Text className="text-xs font-sans text-gray-400">
              No devices found yet
            </Text>
          }
          renderItem={({ item }) => (
            <View className="flex flex-col items-center gap-2">
              <TouchableOpacity
                className="p-2 aspect-square border-hairline rounded-full"
                onPress={() => handleConnectToDevice(item)}
              >
                <Image
                  source={getDeviceAvatar(item.avatar)}
                  className="w-10 h-10 rounded-full"
                  resizeMode="cover"
                />
              </TouchableOpacity>
              <View className="flex flex-col items-center">
                <Text className="text-sm font-poppins-medium">
                  {item.userName}
                </Text>
                <Text className="text-xs font-sans text-gray-600">
                  {item.deviceName}
                </Text>
              </View>
            </View>
          )}
        />
      </View>

      {/* Scanner */}
      <View className="flex items-center justify-start flex-1 pt-6">
        <Text className="font-sans text-sm text-center w-3/4 mt-6 text-gray-600">
          Make sure the other device has NearByte open and is nearby.
        </Text>
        {isScanning ? (
          <LottieView
            source={require('@/assets/animations/scanner.json')}
            style={{ width: 400, height: 400 }}
            autoPlay
            loop
          />
        ) : (
          <TouchableOpacity
            className="items-center justify-center"
            style={{ width: 400, height: 400 }}
            onPress={init}
          >
            <View className="bg-gray-50 h-72 aspect-square rounded-full items-center justify-center flex">
              <View className="bg-gray-100 h-44 aspect-square rounded-full items-center justify-center flex">
                <Text className="text-xl font-poppins-medium text-gray-600">
                  Scan
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      </View>

      {/* Modal Triggers */}
      <View className="flex-row items-center w-full justify-end gap-4 mb-4">
        <Button
          label="My QR"
          icon="QrCode"
          onPress={() => setIsQRVisible(true)}
          variant="outline"
        />
        <Button
          label="Scan"
          icon="Scan"
          onPress={() => setIsScannerModalVisible(true)}
          variant="outline"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
