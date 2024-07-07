import { StatusBar } from "expo-status-bar";

import { View, Image, Text, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { icons } from "../../constants";
import { CustomButton } from "../../components";
import { useGlobalContext } from "../../context/GlobalProvider";

const Profile = () => {
  const { user, setUser, setIsLogged } = useGlobalContext();
  const submit = () => {
    setUser(null);
    setIsLogged(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView
        contentContainerStyle={{
          height: "100%",
        }}
      >
        <View className="w-full flex justify-center items-center h-full px-4">
          <Image
            source={icons.profile}
            className="w-[130px] h-[84px]"
            resizeMode="contain"
          />
          <Text style={{ fontSize: 18, color: "#FFFFFF", marginBottom: 10 }}>
            Name: {user.fullName}
          </Text>
          <Text style={{ fontSize: 18, color: "#FFFFFF", marginBottom: 10 }}>
            Email: {user.email}
          </Text>

          <CustomButton
            title="Log Out"
            handlePress={submit}
            containerStyles="w-full mt-7"
          />
        </View>
      </ScrollView>

      <StatusBar backgroundColor="#161622" style="light" />
    </SafeAreaView>
  );
};

export default Profile;
