import React from 'react';
import { View, FlatList, Image, TouchableOpacity, Dimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSparks } from '@/context/SparkContext';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';

const { width } = Dimensions.get('window');

export default function SparkScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { sparks } = useSparks();
  
  const spark = sparks.find(s => s.id === id);

  if (!spark) {
    return (
      <ThemedView className="flex-1 items-center justify-center p-6">
        <ThemedText className="text-xl">Spark not found</ThemedText>
        <TouchableOpacity onPress={() => router.back()} className="mt-4 bg-blue-500 px-6 py-3 rounded-full">
          <ThemedText className="text-white font-bold">Go Back</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    );
  }

  return (
    <ThemedView className="flex-1">
      <View className="flex-row items-center justify-between px-4 pt-12 pb-4 border-b border-slate-200 dark:border-slate-800 z-10 bg-white/80 dark:bg-black/80 absolute top-0 w-full">
        <TouchableOpacity onPress={() => router.back()} className="p-2">
          <Ionicons name="arrow-back" size={24} color="#94a3b8" />
        </TouchableOpacity>
        <ThemedText type="title" className="text-xl font-bold flex-1 text-center">
          {spark.title}
        </ThemedText>
        <TouchableOpacity 
          style={{ elevation: 5, zIndex: 50 }}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => router.push({ pathname: '/camera', params: { sparkId: spark.id } })} 
          className="p-2"
        >
          <Ionicons name="camera-outline" size={24} color="#3b82f6" />
        </TouchableOpacity>
      </View>

      <View className="flex-1 items-center justify-center bg-black">
        <FlatList
          data={spark.imageUris}
          keyExtractor={(_, index) => index.toString()}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={{ width, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image
                source={{ uri: item }}
                style={{ width: '100%', height: '100%' }}
                resizeMode="contain"
              />
            </View>
          )}
        />
      </View>
      
      <View className="absolute bottom-10 w-full flex-row justify-center">
         <ThemedView className="bg-black/60 px-4 py-2 rounded-full">
            <ThemedText className="text-white">{spark.imageUris.length} photos</ThemedText>
         </ThemedView>
      </View>
    </ThemedView>
  );
}
