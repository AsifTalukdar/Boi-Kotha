import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import MiniPlayer from '../components/MiniPlayer';

// Define a placeholder type based on what we might expect from public.books
type Book = {
  id: string;
  title: string;
  author: string;
  cover_url: string;
};

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*')
        .limit(10);
        
      if (error) {
        console.error('Error fetching books:', error);
      } else {
        setBooks(data as Book[]);
      }
    } catch (err) {
      console.error('Unexpected error:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <TouchableOpacity style={styles.bookCard}>
      <View style={styles.coverPlaceholder}>
        {/* Placeholder for cover image if cover_url doesn't exist */}
        <Text style={styles.coverText}>📖</Text>
      </View>
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle} numberOfLines={2}>{item.title}</Text>
        <Text style={styles.bookAuthor} numberOfLines={1}>{item.author}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Boi-Kotha</Text>
          <Text style={styles.headerSubtitle}>Discover Bengali Audiobooks</Text>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#007bff" />
          </View>
        ) : books.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyText}>No books found.</Text>
          </View>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={renderBookItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
      
      {/* Sticky Player at the bottom */}
      <MiniPlayer title="Chander Pahar" author="Bibhutibhushan Bandyopadhyay" isPlaying={false} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f3f5',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212529',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#6c757d',
    marginTop: 4,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: '#6c757d',
  },
  listContent: {
    padding: 16,
  },
  bookCard: {
    flexDirection: 'row',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 12,
  },
  coverPlaceholder: {
    width: 60,
    height: 90,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    fontSize: 24,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 16,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#495057',
  },
});
