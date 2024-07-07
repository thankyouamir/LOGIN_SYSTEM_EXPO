import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import axios from "axios";
import { images } from "../../constants";

import { CustomButton, FormField } from "../../components";

const Forget = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [email, setEmail] = useState("");

  const submit = async () => {
    if (email === "") {
      Alert.alert("Error", "Please enter your email address");
      return;
    }

    try {
      setSubmitting(true);

      // Make API call to send reset password email
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/password/forgetpassword",
        {
          email,
        }
      );

      // Handle successful response
      Alert.alert("Success", response.data.message);

      // Navigate to Reset page with email as query parameter
      router.push("/reset");
    } catch (error) {
      setSubmitting(false);
      Alert.alert(
        "Error",
        error.message || "An error occurred while sending the reset link"
      );
      console.error("Forget Password Error:", error);
    }
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View
          className="w-full flex justify-center h-full px-4 my-6"
          style={{
            minHeight: Dimensions.get("window").height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[34px]"
          />
          <Text className="text-2xl font-semibold text-white mt-10 font-psemibold">
            Forgot Password
          </Text>

          <FormField
            title="Email"
            value={email}
            handleChangeText={(e) => setEmail(e)}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <CustomButton
            title="Send Reset OTP"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/sign-in"
              className="text-lg font-psemibold text-secondary"
            >
              Back to Sign In
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Forget;
