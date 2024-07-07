import React, { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  Dimensions,
  Alert,
  Image,
} from "react-native";
import axios from "axios";
import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";

const Reset = () => {
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!otp || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Password fields do not match");
      return;
    }

    try {
      setIsSubmitting(true);

      // Make API call to reset password endpoint
      const response = await axios.put(
        "http://localhost:4000/api/v1/user/password/reset",
        {
          otp,
          password,
          confirmNewPassword: confirmPassword,
        }
      );

      Alert.alert("Success", "Password has been reset successfully");

      // Reset form fields and loading state
      setOtp("");
      setPassword("");
      setConfirmPassword("");
      setIsSubmitting(false);

      // Optionally navigate to Sign In page or any other page
      router.push("/sign-in");
    } catch (error) {
      setIsSubmitting(false);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "An error occurred while resetting the password"
      );
      console.error("Reset Password Error:", error);
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
            Reset Password
          </Text>

          <FormField
            title="OTP"
            value={otp}
            handleChangeText={(e) => setOtp(e)}
            otherStyles="mt-7"
            secureTextEntry={true}
          />

          <FormField
            title="New Password"
            value={password}
            handleChangeText={(e) => setPassword(e)}
            otherStyles="mt-7"
            secureTextEntry={true}
          />

          <FormField
            title="Confirm New Password"
            value={confirmPassword}
            handleChangeText={(e) => setConfirmPassword(e)}
            otherStyles="mt-7"
            secureTextEntry={true}
          />

          <CustomButton
            title="Reset Password"
            handlePress={handleSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Reset;
