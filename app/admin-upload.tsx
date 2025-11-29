
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useMovies } from '@/hooks/useMovies';
import { useAuth } from '@/hooks/useAuth';
import { Movie } from '@/types/Movie';
import { IconSymbol } from '@/components/IconSymbol';

export default function AdminUploadScreen() {
  const router = useRouter();
  const { addMovie } = useMovies();
  const { user } = useAuth();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user?.isAdmin) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <Text style={styles.errorText}>Access Denied: Admin Only</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleUpload = async () => {
    if (!title || !description || !videoUrl || !thumbnailUrl || !duration) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const newMovie: Movie = {
        id: Date.now().toString(),
        title,
        description,
        videoUrl,
        thumbnailUrl,
        duration: parseInt(duration),
        uploadedAt: new Date(),
        isNew: true,
      };

      await addMovie(newMovie);
      Alert.alert('Success', 'Movie uploaded successfully!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Upload error:', error);
      Alert.alert('Error', 'Failed to upload movie');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={[commonStyles.container, styles.container]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.backButtonTopText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <IconSymbol 
            ios_icon_name="plus.circle.fill" 
            android_material_icon_name="add_circle" 
            size={64} 
            color={colors.primary} 
          />
          <Text style={styles.title}>Upload Content</Text>
          <Text style={styles.subtitle}>Add new movie or project</Text>
        </View>

        {/* Upload Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter movie title"
              placeholderTextColor={colors.textSecondary}
              value={title}
              onChangeText={setTitle}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter movie description"
              placeholderTextColor={colors.textSecondary}
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Video URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/video.mp4"
              placeholderTextColor={colors.textSecondary}
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Thumbnail URL</Text>
            <TextInput
              style={styles.input}
              placeholder="https://example.com/thumbnail.jpg"
              placeholderTextColor={colors.textSecondary}
              value={thumbnailUrl}
              onChangeText={setThumbnailUrl}
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Duration (seconds)</Text>
            <TextInput
              style={styles.input}
              placeholder="180"
              placeholderTextColor={colors.textSecondary}
              value={duration}
              onChangeText={setDuration}
              keyboardType="numeric"
            />
          </View>

          <TouchableOpacity 
            style={[styles.uploadButton, loading && styles.uploadButtonDisabled]}
            onPress={handleUpload}
            disabled={loading}
          >
            <IconSymbol 
              ios_icon_name="arrow.up.circle.fill" 
              android_material_icon_name="cloud_upload" 
              size={24} 
              color={colors.background} 
            />
            <Text style={styles.uploadButtonText}>
              {loading ? 'Uploading...' : 'Upload Movie'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  backButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 32,
  },
  backButtonTopText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  form: {
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  uploadButton: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 8,
  },
  uploadButtonDisabled: {
    opacity: 0.6,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.background,
  },
  errorText: {
    fontSize: 18,
    color: colors.text,
    textAlign: 'center',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: colors.primary,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
});
