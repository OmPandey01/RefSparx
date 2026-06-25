import React, { useRef, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useSparks } from '@/context/SparkContext';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { addSparkWithImages, addImagesToSpark } = useSparks();
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedImages, setCapturedImages] = useState<string[]>([]);

  const [isCameraReady, setIsCameraReady] = useState(false);

  if (!permission) {
    return <View className="flex-1 bg-black justify-center items-center" />;
  }

  if (!permission.granted) {
    return (
      <View className="flex-1 bg-black justify-center items-center p-6">
        <ThemedText className="text-white text-center mb-4">
          We need your permission to show the camera
        </ThemedText>
        <TouchableOpacity onPress={requestPermission} className="bg-blue-500 px-6 py-3 rounded-xl">
          <Text className="text-white font-bold">Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePicture = async () => {
    if (cameraRef.current && !isCapturing && isCameraReady) {
      setIsCapturing(true);
      try {
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
          quality: 0.8
        });
        console.log('Captured photo:', photo);
        if (photo) {
          if (photo.width === 0 || photo.height === 0) {
            console.warn('Emulator bug detected (0x0 image). Using a placeholder!');
            const dummyUri = `https://picsum.photos/seed/${Date.now()}/400/400.jpg`;
            setCapturedImages(prev => [...prev, dummyUri]);
          } else {
            setCapturedImages(prev => [...prev, photo.uri]);
          }
        }
      } catch (error) {
        console.error('Failed to take picture:', error);
      } finally {
        setIsCapturing(false);
      }
    }
  };

  const handleSave = async () => {
    if (capturedImages.length === 0) return;
    
    if (params.sparkId) {
      await addImagesToSpark(params.sparkId as string, capturedImages);
    } else {
      await addSparkWithImages(capturedImages);
    }
    router.back();
  };

  return (
    <View className="flex-1 bg-black">
      <CameraView 
        ref={cameraRef} 
        style={StyleSheet.absoluteFill} 
        facing="back" 
        onCameraReady={() => setIsCameraReady(true)}
      />
      
      <View style={StyleSheet.absoluteFill} className="flex-1 justify-between p-6 z-10 pointer-events-box-none">
        <View className="flex-row justify-between mt-10">
          <TouchableOpacity onPress={() => router.back()} className="bg-black/50 p-3 rounded-full">
            <Ionicons name="close" size={24} color="white" />
          </TouchableOpacity>
          
          {capturedImages.length > 0 && (
            <TouchableOpacity onPress={handleSave} className="bg-blue-500 px-4 py-2 rounded-full flex-row items-center">
              <Text className="text-white font-bold mr-2">Save ({capturedImages.length})</Text>
              <Ionicons name="checkmark" size={20} color="white" />
            </TouchableOpacity>
          )}
        </View>
        
        <View className="mb-6">
          {capturedImages.length > 0 && (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
              {capturedImages.map((uri, idx) => (
                <View key={idx} className="mr-3 border-2 border-white rounded-lg overflow-hidden">
                  <Image source={{ uri }} className="w-16 h-16" resizeMode="cover" />
                </View>
              ))}
            </ScrollView>
          )}
          
          <View className="flex-row justify-center">
            <TouchableOpacity 
              onPress={takePicture}
              disabled={isCapturing || !isCameraReady}
              className={`w-20 h-20 rounded-full border-4 border-white items-center justify-center ${(isCapturing || !isCameraReady) ? 'opacity-50' : ''}`}
            >
              <View className={`w-16 h-16 rounded-full ${isCameraReady ? 'bg-white' : 'bg-slate-500'}`} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
