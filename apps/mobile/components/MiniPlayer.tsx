import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { Audio } from 'expo-av';

interface MiniPlayerProps {
  title?: string;
  author?: string;
  isPlaying?: boolean;
  audioUrl?: string;
}

export default function MiniPlayer({
  title = 'Chander Pahar',
  author = 'Bibhutibhushan Bandyopadhyay',
  audioUrl,
}: MiniPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (sound) {
        sound.unloadAsync().catch(() => {});
      }
    };
  }, [sound]);

  const togglePlay = async () => {
    try {
      if (playing && sound) {
        await sound.pauseAsync();
        if (isMountedRef.current) setPlaying(false);
        return;
      }

      if (sound) {
        await sound.playAsync();
        if (isMountedRef.current) setPlaying(true);
        return;
      }

      // If no valid audio URL provided, just simulate toggle safely
      if (!audioUrl || audioUrl.includes('example.com')) {
        if (isMountedRef.current) setPlaying(!playing);
        return;
      }

      setIsLoading(true);
      await Audio.setAudioModeAsync({
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        shouldDuckAndroid: true,
      });

      const { sound: newSound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true, staysActiveInBackground: false }
      );

      if (isMountedRef.current) {
        setSound(newSound);
        setPlaying(true);
      }
    } catch (e) {
      console.warn('Audio playback error:', e);
      if (isMountedRef.current) setPlaying(false);
    } finally {
      if (isMountedRef.current) setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.progressPlaceholder} />
      <View style={styles.content}>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>
            {title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {author}
          </Text>
        </View>
        <View style={styles.controls}>
          <TouchableOpacity 
            style={styles.button} 
            onPress={togglePlay} 
            disabled={isLoading}
            activeOpacity={0.7}
          >
            {playing ? (
              <Pause size={24} color="#0d9488" />
            ) : (
              <Play size={24} color="#0d9488" fill="#0d9488" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} activeOpacity={0.7}>
            <SkipForward size={24} color="#4b5563" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    paddingBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 5,
  },
  progressPlaceholder: {
    height: 3,
    backgroundColor: '#0d9488',
    width: '35%',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  author: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  button: {
    padding: 8,
  },
});
