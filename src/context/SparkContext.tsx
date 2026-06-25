import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { File, Paths } from 'expo-file-system';

export type Spark = {
  id: string;
  title: string;
  imageUris: string[];
  createdAt: number;
};

type SparkContextType = {
  sparks: Spark[];
  addSparkWithImages: (tempImageUris: string[]) => Promise<void>;
  addImagesToSpark: (sparkId: string, tempImageUris: string[]) => Promise<void>;
  updateSparkTitle: (sparkId: string, title: string) => Promise<void>;
};

const SparkContext = createContext<SparkContextType | undefined>(undefined);

const SPARKS_STORAGE_KEY = '@sparx_sparks_data';

export const SparkProvider = ({ children }: { children: ReactNode }) => {
  const [sparks, setSparks] = useState<Spark[]>([]);

  const loadSparks = async () => {
    try {
      const data = await AsyncStorage.getItem(SPARKS_STORAGE_KEY);
      if (data) {
        setSparks(JSON.parse(data));
      }
    } catch (e) {
      console.error('Failed to load sparks', e);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadSparks();
  }, []);

  const saveSparks = async (newSparks: Spark[]) => {
    setSparks(newSparks);
    try {
      await AsyncStorage.setItem(SPARKS_STORAGE_KEY, JSON.stringify(newSparks));
    } catch (e) {
      console.error('Failed to save sparks', e);
    }
  };

  const saveImageLocally = async (tempUri: string): Promise<string> => {
    // Generate a unique filename
    const filename = `spark_${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`;
    const destFile = new File(Paths.document, filename);
    
    if (tempUri.startsWith('http')) {
      await File.downloadFileAsync(tempUri, destFile);
    } else {
      const srcFile = new File(tempUri);
      await srcFile.copy(destFile);
    }
    return destFile.uri;
  };

  const addSparkWithImages = async (tempImageUris: string[]) => {
    const localUris = await Promise.all(tempImageUris.map(uri => saveImageLocally(uri)));
    const newSpark: Spark = {
      id: Date.now().toString(),
      title: `Spark ${sparks.length + 1}`,
      imageUris: localUris,
      createdAt: Date.now(),
    };
    await saveSparks([newSpark, ...sparks]);
  };

  const addImagesToSpark = async (sparkId: string, tempImageUris: string[]) => {
    const localUris = await Promise.all(tempImageUris.map(uri => saveImageLocally(uri)));
    const newSparks = sparks.map((spark) => {
      if (spark.id === sparkId) {
        return {
          ...spark,
          imageUris: [...spark.imageUris, ...localUris],
        };
      }
      return spark;
    });
    await saveSparks(newSparks);
  };

  const updateSparkTitle = async (sparkId: string, title: string) => {
    const newSparks = sparks.map((spark) => {
      if (spark.id === sparkId) {
        return { ...spark, title };
      }
      return spark;
    });
    await saveSparks(newSparks);
  };

  return (
    <SparkContext.Provider value={{ sparks, addSparkWithImages, addImagesToSpark, updateSparkTitle }}>
      {children}
    </SparkContext.Provider>
  );
};

export const useSparks = () => {
  const context = useContext(SparkContext);
  if (context === undefined) {
    throw new Error('useSparks must be used within a SparkProvider');
  }
  return context;
};
