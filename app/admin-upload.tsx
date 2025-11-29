
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView, KeyboardAvoidingView, Platform, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useMovies } from '@/hooks/useMovies';
import { useAuth } from '@/hooks/useAuth';
import { Movie } from '@/types/Movie';
import { IconSymbol } from '@/components/IconSymbol';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/app/integrations/supabase/client';

type UploadType = 'url' | 'file';

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
  const [uploadType, setUploadType] = useState<UploadType>('url');
  
  // File upload states
  const [videoFile, setVideoFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [thumbnailFile, setThumbnailFile] = useState<{ uri: string; name: string; type: string } | null>(null);
  const [uploadProgress, setUploadProgress] = useState<{ video: number; thumbnail: number }>({ video: 0, thumbnail: 0 });

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

  const pickVideo = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsMultipleSelection: false,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const video = result.assets[0];
        setVideoFile({
          uri: video.uri,
          name: video.uri.split('/').pop() || 'video.mp4',
          type: video.mimeType || 'video/mp4',
        });
        console.log('Video selected:', video.uri);
      }
    } catch (error) {
      console.log('Error picking video:', error);
      Alert.alert('Error', 'Failed to pick video');
    }
  };

  const pickThumbnail = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsMultipleSelection: false,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const image = result.assets[0];
        setThumbnailFile({
          uri: image.uri,
          name: image.uri.split('/').pop() || 'thumbnail.jpg',
          type: image.mimeType || 'image/jpeg',
        });
        console.log('Thumbnail selected:', image.uri);
      }
    } catch (error) {
      console.log('Error picking thumbnail:', error);
      Alert.alert('Error', 'Failed to pick thumbnail');
    }
  };

  const uploadFileToStorage = async (file: { uri: string; name: string; type: string }, path: string, onProgress?: (progress: number) => void): Promise<string> => {
    try {
      console.log('Uploading file to:', path);
      
      // Fetch the file as an array buffer
      const response = await fetch(file.uri);
      const arrayBuffer = await response.arrayBuffer();
      
      // Generate unique filename
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'mp4';
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('premium-media')
        .upload(filePath, arrayBuffer, {
          contentType: file.type,
          upsert: false,
        });

      if (error) {
        console.log('Upload error:', error);
        throw error;
      }

      console.log('File uploaded successfully:', data.path);

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('premium-media')
        .getPublicUrl(data.path);

      return urlData.publicUrl;
    } catch (error) {
      console.log('Error uploading file:', error);
      throw error;
    }
  };

  const handleUpload = async () => {
    if (!title || !description || !duration) {
      Alert.alert('Error', 'Please fill in title, description, and duration');
      return;
    }

    if (uploadType === 'url') {
      if (!videoUrl || !thumbnailUrl) {
        Alert.alert('Error', 'Please provide video and thumbnail URLs');
        return;
      }
    } else {
      if (!videoFile || !thumbnailFile) {
        Alert.alert('Error', 'Please select both video and thumbnail files');
        return;
      }
    }

    setLoading(true);
    try {
      let finalVideoUrl = videoUrl;
      let finalThumbnailUrl = thumbnailUrl;

      // Upload files if using file upload mode
      if (uploadType === 'file' && videoFile && thumbnailFile) {
        Alert.alert('Uploading', 'Uploading video file... This may take a while.');
        
        // Upload video
        finalVideoUrl = await uploadFileToStorage(videoFile, 'videos', (progress) => {
          setUploadProgress(prev => ({ ...prev, video: progress }));
        });
        
        Alert.alert('Uploading', 'Uploading thumbnail...');
        
        // Upload thumbnail
        finalThumbnailUrl = await uploadFileToStorage(thumbnailFile, 'thumbnails', (progress) => {
          setUploadProgress(prev => ({ ...prev, thumbnail: progress }));
        });
      }

      // Save movie metadata to database
      const { data, error } = await supabase
        .from('movies')
        .insert({
          title,
          description,
          video_url: finalVideoUrl,
          thumbnail_url: finalThumbnailUrl,
          duration: parseInt(duration),
          is_new: true,
          is_premium: true,
        })
        .select()
        .single();

      if (error) {
        console.log('Database error:', error);
        throw error;
      }

      console.log('Movie saved to database:', data);

      // Also add to local storage for backwards compatibility
      const newMovie: Movie = {
        id: data.id,
        title: data.title,
        description: data.description,
        videoUrl: data.video_url,
        thumbnailUrl: data.thumbnail_url,
        duration: data.duration,
        uploadedAt: new Date(data.uploaded_at),
        isNew: data.is_new,
        isPremium: data.is_premium,
      };

      await addMovie(newMovie);

      Alert.alert('Success', 'Movie uploaded successfully! This is premium content.', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (error) {
      console.log('Upload error:', error);
      Alert.alert('Error', 'Failed to upload movie. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress({ video: 0, thumbnail: 0 });
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
          <Text style={styles.title}>Upload Movie</Text>
          <Text style={styles.subtitle}>Add new premium movie content</Text>
        </View>

        {/* Info Notice */}
        <View style={styles.infoNotice}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.accent} 
          />
          <View style={styles.infoNoticeContent}>
            <Text style={styles.infoNoticeTitle}>Premium Content Only</Text>
            <Text style={styles.infoNoticeText}>
              Admin can only upload movies (premium content). Music videos are managed separately and are free.
            </Text>
          </View>
        </View>

        {/* Upload Type Selector */}
        <View style={styles.uploadTypeSelector}>
          <TouchableOpacity
            style={[styles.uploadTypeButton, uploadType === 'url' && styles.uploadTypeButtonActive]}
            onPress={() => setUploadType('url')}
          >
            <IconSymbol 
              ios_icon_name="link" 
              android_material_icon_name="link" 
              size={20} 
              color={uploadType === 'url' ? colors.background : colors.text} 
            />
            <Text style={[styles.uploadTypeButtonText, uploadType === 'url' && styles.uploadTypeButtonTextActive]}>
              URL Upload
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.uploadTypeButton, uploadType === 'file' && styles.uploadTypeButtonActive]}
            onPress={() => setUploadType('file')}
          >
            <IconSymbol 
              ios_icon_name="arrow.up.doc" 
              android_material_icon_name="upload_file" 
              size={20} 
              color={uploadType === 'file' ? colors.background : colors.text} 
            />
            <Text style={[styles.uploadTypeButtonText, uploadType === 'file' && styles.uploadTypeButtonTextActive]}>
              File Upload
            </Text>
          </TouchableOpacity>
        </View>

        {/* Upload Form */}
        <View style={styles.form}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Movie Title</Text>
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

          {uploadType === 'url' ? (
            <>
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
            </>
          ) : (
            <>
              {/* Video File Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Video File</Text>
                <TouchableOpacity 
                  style={styles.filePickerButton}
                  onPress={pickVideo}
                  disabled={loading}
                >
                  <IconSymbol 
                    ios_icon_name="film" 
                    android_material_icon_name="movie" 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.filePickerContent}>
                    <Text style={styles.filePickerText}>
                      {videoFile ? videoFile.name : 'Tap to select video file'}
                    </Text>
                    {videoFile && (
                      <Text style={styles.filePickerSubtext}>Video selected</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              {/* Thumbnail File Upload */}
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Thumbnail Image</Text>
                <TouchableOpacity 
                  style={styles.filePickerButton}
                  onPress={pickThumbnail}
                  disabled={loading}
                >
                  <IconSymbol 
                    ios_icon_name="photo" 
                    android_material_icon_name="image" 
                    size={24} 
                    color={colors.primary} 
                  />
                  <View style={styles.filePickerContent}>
                    {thumbnailFile ? (
                      <Image 
                        source={{ uri: thumbnailFile.uri }} 
                        style={styles.thumbnailPreview}
                        resizeMode="cover"
                      />
                    ) : (
                      <Text style={styles.filePickerText}>
                        Tap to select thumbnail image
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </>
          )}

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
            {loading ? (
              <>
                <ActivityIndicator color={colors.background} />
                <Text style={styles.uploadButtonText}>Uploading...</Text>
              </>
            ) : (
              <>
                <IconSymbol 
                  ios_icon_name="arrow.up.circle.fill" 
                  android_material_icon_name="cloud_upload" 
                  size={24} 
                  color={colors.background} 
                />
                <Text style={styles.uploadButtonText}>
                  Upload Premium Movie
                </Text>
              </>
            )}
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
    marginBottom: 24,
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
  infoNotice: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  infoNoticeContent: {
    flex: 1,
  },
  infoNoticeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.accent,
    marginBottom: 6,
  },
  infoNoticeText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  uploadTypeSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  uploadTypeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.card,
    borderWidth: 2,
    borderColor: colors.card,
  },
  uploadTypeButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  uploadTypeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  uploadTypeButtonTextActive: {
    color: colors.background,
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
  filePickerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.primary,
    borderStyle: 'dashed',
  },
  filePickerContent: {
    flex: 1,
  },
  filePickerText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  filePickerSubtext: {
    fontSize: 12,
    color: colors.primary,
    marginTop: 4,
  },
  thumbnailPreview: {
    width: '100%',
    height: 100,
    borderRadius: 8,
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
