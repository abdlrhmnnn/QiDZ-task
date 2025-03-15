import { useEffect, useState } from "react";
import { Redirect } from "expo-router";
import { observer } from "mobx-react-lite";
import { View, ActivityIndicator } from "react-native";
import { useStores } from "../stores/StoresProvider";

export default observer(function Index() {
  const { authStore } = useStores();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const initializeAuth = async () => {
      await authStore.initializeAuth();
      setIsReady(true);
    };

    initializeAuth();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return <Redirect href={authStore.isLoggedIn ? "/dashboard" : "/login"} />;
});
