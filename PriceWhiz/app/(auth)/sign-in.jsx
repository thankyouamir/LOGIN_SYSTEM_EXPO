import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, ScrollView, Dimensions, Alert, Image } from "react-native";
import axios from "axios";

import { images } from "../../constants";
import { CustomButton, FormField } from "../../components";

import { useGlobalContext } from "../../context/GlobalProvider";

const SignIn = () => {
  const { setUser, setIsLogged } = useGlobalContext();
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const submit = async () => {
    if (form.email === "" || form.password === "") {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    try {
      setSubmitting(true);

      // Make API call to login endpoint
      const response = await axios.post(
        "http://localhost:4000/api/v1/user/login",
        {
          email: form.email,
          password: form.password,
        }
      );

      // Handle successful login response
      setUser(response.data.user);
      setIsLogged(true);

      // Reset form and state
      setForm({ email: "", password: "" });
      setSubmitting(false);

      // Navigate to HomeScreen
      router.push("/home");
    } catch (error) {
      setSubmitting(false);
      Alert.alert("Error", error.message || "An error occurred during login");
      console.error("Login Error:", error);
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
            Sign In to PriceWhiz
          </Text>

          <FormField
            title="Email"
            value={form.email}
            handleChangeText={(e) => setForm({ ...form, email: e })}
            otherStyles="mt-7"
            keyboardType="email-address"
          />

          <FormField
            title="Password"
            value={form.password}
            handleChangeText={(e) => setForm({ ...form, password: e })}
            otherStyles="mt-7"
          />

          <CustomButton
            title="Sign In"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular">
              Don't have an account?
            </Text>
            <Link
              href="/sign-up"
              className="text-lg font-psemibold text-secondary"
            >
              Sign Up
            </Link>
          </View>

          <View className="flex justify-center pt-5 flex-row gap-2">
            <Link
              href="/forget"
              className="text-lg font-psemibold text-secondary"
            >
              Forgot Password?
            </Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;
