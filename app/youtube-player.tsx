
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useMovies } from '@/hooks/useMovies';
import { IconSymbol } from '@/components/IconSymbol';

const { width } = Dimensions.get('window');

export default function YouTubePlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { musicVideos } = useMovies();
  const [loading, setLoading] = useState(true);

  console.log('YouTube Player - Received videoId:', params.videoId);

  // Find video by youtubeId (not by id)
  const video = musicVideos.find(v => v.youtubeId === params.videoId);

  console.log('YouTube Player - Found video:', video);

  if (!video) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.errorContainer}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle.fill" 
            android_material_icon_name="error" 
            size={64} 
            color={colors.accent} 
          />
          <Text style={styles.errorText}>Video not found</Text>
          <Text style={styles.errorSubtext}>
            The requested video could not be loaded.
          </Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const youtubeEmbedUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`;
  const youtubeAppUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  const handleOpenInYouTube = async () => {
    try {
      const supported = await Linking.canOpenURL(youtubeAppUrl);
      if (supported) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        console.log('Cannot open YouTube URL');
      }
    } catch (error) {
      console.log('Error opening YouTube:', error);
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <WebView
          source={{ uri: youtubeEmbedUrl }}
          style={styles.webview}
          allowsFullscreenVideo
          allowsInlineMediaPlayback
          mediaPlaybackRequiresUserAction={false}
          javaScriptEnabled
          domStorageEnabled
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          onError={(syntheticEvent) => {
            const { nativeEvent } = syntheticEvent;
            console.log('WebView error:', nativeEvent);
          }}
        />
        {loading && (
          <View style={styles.loadingOverlay}>
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
      </View>

      {/* Video Info */}
      <ScrollView style={styles.infoContainer} contentContainerStyle={styles.infoContent}>
        <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow_back" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.backButtonTopText}>Back</Text>
        </TouchableOpacity>

        <View style={styles.freeBadge}>
          <IconSymbol 
            ios_icon_name="checkmark.circle.fill" 
            android_material_icon_name="check_circle" 
            size={20} 
            color={colors.accent} 
          />
          <Text style={styles.freeBadgeText}>FREE TO WATCH</Text>
        </View>

        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoArtist}>{video.artist}</Text>

        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={20} 
              color={colors.textSecondary} 
            />
            <Text style={styles.statText}>{Math.floor(video.duration / 60)} min</Text>
          </View>
          <View style={styles.stat}>
            <IconSymbol 
              ios_icon_name="play.rectangle.fill" 
              android_material_icon_name="smart_display" 
              size={20} 
              color="#FF0000" 
            />
            <Text style={styles.statText}>YouTube</Text>
          </View>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.primary} 
          />
          <View style={styles.infoBoxContent}>
            <Text style={styles.infoBoxTitle}>Free Music Videos</Text>
            <Text style={styles.infoBoxText}>
              All music videos are free to watch. Only movies require a premium subscription.
            </Text>
          </View>
        </View>

        <TouchableOpacity 
          style={styles.youtubeButton}
          onPress={handleOpenInYouTube}
        >
          <IconSymbol 
            ios_icon_name="play.rectangle.fill" 
            android_material_icon_name="smart_display" 
            size={24} 
            color="#FF0000" 
          />
          <Text style={styles.youtubeButtonText}>Watch on YouTube</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 0,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.background,
    position: 'relative',
  },
  webview: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  infoContainer: {
    flex: 1,
  },
  infoContent: {
    padding: 20,
    paddingBottom: 120,
  },
  backButtonTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  backButtonTopText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  freeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.accent,
  },
  freeBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 8,
  },
  videoArtist: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.accent,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 24,
  },
  stat: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '600',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  infoBoxContent: {
    flex: 1,
  },
  infoBoxTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoBoxText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: colors.card,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FF0000',
  },
  youtubeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  errorText: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  errorSubtext: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
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
