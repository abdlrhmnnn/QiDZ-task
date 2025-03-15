import { useState } from "react";
import { View, TextInput, Button, StyleSheet, Alert } from "react-native";
import { observer } from "mobx-react-lite";
import { router } from "expo-router";
import { useStores } from "../stores/StoresProvider";
import { styles } from "@/src/screens/styles/login";

export default observer(function LoginScreen() {
  const { authStore } = useStores();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    const success = await authStore.login(username, password);
    if (success) {
      router.replace({ pathname: "/dashboard" });
    } else {
      Alert.alert("Error", "Invalid credentials");
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
});
