import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ActivityIndicator, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import MiniPlayer from '../components/MiniPlayer';

type Book = {
  id: string;
  title?: string;
  title_bn?: string;
  author?: string;
  author_bn?: string;
  cover_url?: string;
  cover_color?: string;
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
        .limit(20);
        
      if (error) {
        console.warn('Error fetching books from Supabase:', error);
      } else if (data && data.length > 0) {
        setBooks(data as Book[]);
      }
    } catch (err) {
      console.warn('Unexpected error fetching books:', err);
    } finally {
      setLoading(false);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => {
    const title = item.title_bn || item.title || 'বইয়ের নাম';
    const author = item.author_bn || item.author || 'লেখক';
    const bgColor = item.cover_color || '#0d9488';

    return (
      <TouchableOpacity style={styles.bookCard} activeOpacity={0.8}>
        <View style={[styles.coverPlaceholder, { backgroundColor: bgColor }]}>
          <Text style={styles.coverText}>📖</Text>
        </View>
        <View style={styles.bookInfo}>
          <Text style={styles.bookTitle} numberOfLines={2}>{title}</Text>
          <Text style={styles.bookAuthor} numberOfLines={1}>{author}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>বই-কথা (Boi-Kotha)</Text>
          <Text style={styles.headerSubtitle}>বাংলা অডিওবুক প্ল্যাটফর্ম</Text>
        </View>

        {loading ? (
          <View style={styles.centerContent}>
            <ActivityIndicator size="large" color="#0d9488" />
            <Text style={styles.loadingText}>বই লোড হচ্ছে...</Text>
          </View>
        ) : books.length === 0 ? (
          <View style={styles.centerContent}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>কোনো বই পাওয়া যায়নি</Text>
          </View>
        ) : (
          <FlatList
            data={books}
            keyExtractor={(item) => item.id}
            renderItem={renderBookItem}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      
      {/* Sticky Player at the bottom */}
      <MiniPlayer 
        title="চাঁদের পাহাড়" 
        author="বিভূতিভূষণ বন্দ্যোপাধ্যায়" 
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    backgroundColor: '#ffffff',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6b7280',
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280',
  },
  listContent: {
    padding: 16,
  },
  bookCard: {
    flexDirection: 'row',
    marginBottom: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#f3f4f6',
  },
  coverPlaceholder: {
    width: 60,
    height: 80,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    fontSize: 26,
  },
  bookInfo: {
    flex: 1,
    marginLeft: 14,
    justifyContent: 'center',
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 14,
    color: '#6b7280',
  },
});
