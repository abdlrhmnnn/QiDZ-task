import {
  View,
  Text,
  Button,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { observer } from "mobx-react-lite";
import { router } from "expo-router";
import { useStores } from "../stores/StoresProvider";
import { styles } from "@/src/screens/styles/dashboard";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMoviesQuery } from "@/src/hooks/useMoviesQuery";

export default observer(function DashboardScreen() {
  const { authStore } = useStores();
  const { movies, isLoading, isFetching, handleLoadMore, handleRefresh } =
    useMoviesQuery();

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await authStore.logout();
            router.replace({ pathname: "/login" });
          },
        },
      ],
      { cancelable: true }
    );
  };

  const renderFooter = () => {
    if (!isFetching || !movies.length) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  const renderEmptyList = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyText}>
        No movies found. Try searching for something else.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Button title="Logout" onPress={handleLogout} color="#ff3b30" />
      </View>

      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <FlatList
          data={movies}
          keyExtractor={(item) => item.imdbID}
          renderItem={({ item }) => (
            <View style={styles.movieCard}>
              <Image
                source={{ uri: item.Poster }}
                style={styles.poster}
                resizeMode="cover"
              />
              <View style={styles.movieInfo}>
                <Text style={styles.title}>{item.Title}</Text>
                <Text style={styles.year}>{item.Year}</Text>
              </View>
            </View>
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          onRefresh={handleRefresh}
          refreshing={isLoading}
          ListFooterComponent={renderFooter}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={renderEmptyList}
        />
      )}
    </SafeAreaView>
  );
});
