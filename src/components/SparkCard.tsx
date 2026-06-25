import React from 'react';
import { ScrollView, Image, TouchableOpacity, View } from 'react-native';
import { ThemedView } from './themed-view';
import { ThemedText } from './themed-text';
import { Spark } from '@/context/SparkContext';
import { useRouter } from 'expo-router';

type SparkCardProps = {
  spark: Spark;
};

export function SparkCard({ spark }: SparkCardProps) {
  const router = useRouter();

  return (
    <TouchableOpacity activeOpacity={0.8} onPress={() => router.push(`/spark/${spark.id}`)}>
      <ThemedView className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 mb-4 bg-slate-50 dark:bg-slate-900 shadow-sm">
        <View className="flex-row justify-between items-center mb-3">
          <ThemedText className="font-semibold text-lg">{spark.title}</ThemedText>
          <ThemedText className="text-xs text-slate-500">
            {new Date(spark.createdAt).toLocaleDateString()}
          </ThemedText>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
          {spark.imageUris.map((uri, index) => (
            <Image 
              key={index} 
              source={{ uri }} 
              className="w-40 h-40 rounded-xl mr-3 bg-slate-200 dark:bg-slate-800" 
              resizeMode="cover"
            />
          ))}
        </ScrollView>
      </ThemedView>
    </TouchableOpacity>
  );
}
