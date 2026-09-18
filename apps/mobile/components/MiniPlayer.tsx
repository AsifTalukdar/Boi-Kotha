import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Play, Pause, SkipForward } from 'lucide-react-native';
import { Audio } from 'expo-av';

interface MiniPlayerProps {
  title?: string;
  author?: string;
  isPlaying?: boolean;
  audioUrl?: string; // URL of the audio file to play
}

export default function MiniPlayer({
  title = 'Not Playing',
  author = 'Unknown',
  audioUrl = 'https://cdn.example.com/sample-audio.mp3',
}: MiniPlayerProps) {
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const [playing, setPlaying] = useState(false);

  // Load the sound when component mounts or audioUrl changes
  useEffect(() => {
    let isMounted = true;
    const loadSound = async () => {
      if (sound) {
        await sound.unloadAsync();
        setSound(null);
      }
      try {
        const { sound: newSound } = await Audio.Sound.createAsync(
          { uri: audioUrl },
          { shouldPlay: false, staysActiveInBackground: true }
        );
        if (isMounted) {
          setSound(newSound);
        }
      } catch (e) {
        console.error('Error loading audio', e);
      }
    };
    loadSound();
    return () => {
      isMounted = false;
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [audioUrl]);

  const togglePlay = async () => {
    if (!sound) return;
    if (playing) {
      await sound.pauseAsync();
      setPlaying(false);
    } else {
      await sound.playAsync();
      setPlaying(true);
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
          <TouchableOpacity style={styles.button} onPress={togglePlay}>
            {playing ? (
              <Pause size={24} color="#000" />
            ) : (
              <Play size={24} color="#000" fill="#000" />
            )}
          </TouchableOpacity>
          <TouchableOpacity style={styles.button} onPress={() => { /* skip forward placeholder */ }}>
            <SkipForward size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f9fa',
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
    paddingBottom: 24,
  },
  progressPlaceholder: {
    height: 2,
    backgroundColor: '#007bff',
    width: '30%',
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
    color: '#212529',
  },
  author: {
    fontSize: 14,
    color: '#6c757d',
    marginTop: 2,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  button: {
    padding: 8,
  },
});
