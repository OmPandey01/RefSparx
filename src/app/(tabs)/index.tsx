import React from 'react';
import { FlatList, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useSparks } from '@/context/SparkContext';
import { SparkCard } from '@/components/SparkCard';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';

export default function HomeScreen() {
  const { sparks } = useSparks();
  const router = useRouter();

  return (
    <ThemedView className="flex-1">
      <SafeAreaView className="flex-1 relative">
        <View className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
          <ThemedText type="title" className="text-3xl font-bold">Sparx</ThemedText>
          <ThemedText className="text-slate-500">Capture your brilliant ideas</ThemedText>
        </View>

        {sparks.length === 0 ? (
          <View className="flex-1 items-center justify-center p-6">
            <Ionicons name="images-outline" size={64} color="#94a3b8" />
            <ThemedText className="text-lg text-slate-500 mt-4 text-center">
              You haven&apos;t captured any sparks yet. Tap the camera button to start!
            </ThemedText>
          </View>
        ) : (
          <FlatList
            data={sparks}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
            renderItem={({ item }) => (
              <SparkCard spark={item} />
            )}
          />
        )}

        <TouchableOpacity
          style={{ elevation: 5, zIndex: 50 }}
          className="absolute bottom-8 right-6 w-16 h-16 bg-blue-500 rounded-full items-center justify-center shadow-lg"
          onPress={() => router.push('/camera')}
        >
          <Ionicons name="camera" size={30} color="white" />
        </TouchableOpacity>
      </SafeAreaView>
    </ThemedView>
  );
}
