import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '@/components/Button';
import Icon from '@/components/Icon';
import { type Avatar, avatars } from '@/constants/avatar';
import useUserStore from '@/store/useUserStore';

const flow = [{ step: 'username' }, { step: 'avatar' }] as const;

type FlowStep = (typeof flow)[number]['step'];

const chunkArray = <T,>(arr: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(arr.length / size) }, (_, i) =>
    arr.slice(i * size, i * size + size),
  );

interface AvatarItemProps {
  avatar: Avatar;
  selected: boolean;
  onSelect: (avatar: Avatar) => void;
}
const AvatarItem: React.FC<AvatarItemProps> = ({
  avatar,
  selected,
  onSelect,
}) => (
  <TouchableOpacity
    onPress={() => onSelect(avatar)}
    className={`${selected ? 'border border-gray-600' : ''} rounded-full p-2 flex items-center justify-center`}
  >
    <Image
      source={avatar.source}
      className="w-16 h-16 rounded-full"
      resizeMode="cover"
    />
  </TouchableOpacity>
);

interface AvatarGridPagerProps {
  value: Avatar | null;
  onChange: (avatar: Avatar) => void;
}

const AvatarGridPager: React.FC<AvatarGridPagerProps> = ({
  value,
  onChange,
}) => {
  const { width } = useWindowDimensions();
  const [pageIndex, setPageIndex] = useState(0);
  const pages = chunkArray(avatars, 6);

  return (
    <View>
      <FlatList
        data={pages}
        keyExtractor={(_, i) => i.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setPageIndex(index);
        }}
        className="-mx-8"
        renderItem={({ item: page }) => (
          <View style={{ width }} className="px-4">
            {chunkArray(page, 3).map((row, rowIndex) => (
              <View key={rowIndex} className="flex-row justify-between mb-4">
                {row.map((avatar) => (
                  <AvatarItem
                    key={avatar.id}
                    avatar={avatar}
                    selected={value?.id === avatar.id}
                    onSelect={onChange}
                  />
                ))}
              </View>
            ))}
          </View>
        )}
      />

      {/* Page dots */}
      {pages.length > 1 && (
        <View className="flex-row justify-center gap-2 mt-4">
          {pages.map((_, i) => (
            <View
              key={i}
              className={`rounded-full ${
                i === pageIndex ? 'w-4 h-2 bg-gray-900' : 'w-2 h-2 bg-gray-300'
              }`}
            />
          ))}
        </View>
      )}
    </View>
  );
};

interface UserNameSectionProps {
  value: string;
  onChange: (v: string) => void;
  onNext: () => void;
}

const UserNameSection: React.FC<UserNameSectionProps> = ({
  value,
  onChange,
  onNext,
}) => (
  <View className="mt-16 mb-12">
    <Image
      source={require('@/assets/images/nearbyte.png')}
      className="w-16 h-16 mb-8"
      resizeMode="contain"
    />
    <Text className="font-poppins-bold text-4xl text-gray-900 leading-tight mb-3">
      Welcome to{'\n'}NearByte
    </Text>
    <Text className="font-poppins-light text-gray-400 text-base leading-relaxed">
      Share files instantly with nearby devices —{'\n'}no internet needed.
    </Text>

    <View className="mb-6">
      <Text className="font-poppins-medium text-gray-500 text-xs uppercase tracking-widest mb-3">
        Your display name
      </Text>
      <TextInput
        placeholder="e.g. John Doe"
        placeholderTextColor="#d1d5db"
        value={value}
        onChangeText={onChange}
        autoFocus
        returnKeyType="done"
        onSubmitEditing={onNext}
        className="border-b-2 border-gray-900 pb-3 font-poppins-light text-gray-900 text-lg"
      />
      <Text className="font-poppins-light text-gray-400 text-xs mt-3">
        Shown to nearby devices when pairing.
      </Text>
    </View>
  </View>
);

interface AvatarSelectionSectionProps {
  value: Avatar | null;
  onChange: (avatar: Avatar) => void;
}

const AvatarSelectionSection: React.FC<AvatarSelectionSectionProps> = ({
  value,
  onChange,
}) => (
  <View className="mt-16 mb-12">
    <Image
      source={require('@/assets/images/nearbyte.png')}
      className="w-16 h-16 mb-8"
      resizeMode="contain"
    />
    <Text className="font-poppins-bold text-4xl text-gray-900 leading-tight mb-3">
      Pick an avatar
    </Text>
    <Text className="font-poppins-light text-gray-400 text-base leading-relaxed mb-8">
      This is how nearby devices will see you.
    </Text>

    <AvatarGridPager value={value} onChange={onChange} />
  </View>
);

export default function OnBoarding() {
  const router = useRouter();
  const { setUserName, setAvatarId } = useUserStore();

  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const currentStep: FlowStep = flow[currentStepIndex].step;
  const isLastStep = currentStepIndex === flow.length - 1;

  const canProceed =
    currentStep === 'username'
      ? username.trim().length > 0
      : currentStep === 'avatar'
        ? avatar !== null
        : true;

  const handleNext = () => {
    if (!canProceed) return;
    if (isLastStep) {
      setUserName(username);
      if (avatar) {
        setAvatarId(avatar.id);
      }
      router.push('/home');
    } else {
      setCurrentStepIndex((i) => i + 1);
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) setCurrentStepIndex((i) => i - 1);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View className="flex-1 px-8 flex-col flex">
            {currentStepIndex > 0 && (
              <TouchableOpacity
                onPress={handleBack}
                className="mt-4 self-start"
              >
                <Icon name="ArrowLeft" size={20} color="#4b5563" />
              </TouchableOpacity>
            )}

            {currentStep === 'username' && (
              <UserNameSection
                value={username}
                onChange={setUsername}
                onNext={handleNext}
              />
            )}

            {currentStep === 'avatar' && (
              <AvatarSelectionSection value={avatar} onChange={setAvatar} />
            )}

            <View className="mt-auto pb-10">
              <Button
                label={isLastStep ? 'Get Started' : 'Continue'}
                variant="outline"
                icon="ArrowRight"
                iconPosition="right"
                onPress={handleNext}
                disabled={!canProceed}
                className="self-end justify-between px-6 py-4 rounded-2xl"
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
