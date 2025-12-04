
import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Platform, Alert, Linking } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { WebView } from 'react-native-webview';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { MUSIC_VIDEOS } from '@/data/products';

export default function VideoPlayerScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const webViewRef = useRef<WebView>(null);
  
  const video = MUSIC_VIDEOS.find(v => v.id === id);

  useEffect(() => {
    console.log('Video player mounted for:', video?.title);
    return () => {
      console.log('Video player unmounted');
    };
  }, []);

  if (!video) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.closeButton}
            onPress={() => router.back()}
          >
            <IconSymbol 
              ios_icon_name="xmark.circle.fill" 
              android_material_icon_name="close" 
              size={32} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
        <View style={styles.errorContainer}>
          <IconSymbol 
            ios_icon_name="exclamationmark.triangle.fill" 
            android_material_icon_name="error" 
            size={64} 
            color={colors.error} 
          />
          <Text style={styles.errorTitle}>Video Not Found</Text>
          <Text style={styles.errorText}>The requested video could not be found.</Text>
        </View>
      </View>
    );
  }

  const youtubeUrl = `https://www.youtube.com/embed/${video.youtubeId}?autoplay=0&rel=0&modestbranding=1&playsinline=1&enablejsapi=1`;
  const youtubeAppUrl = `vnd.youtube://${video.youtubeId}`;
  const youtubeBrowserUrl = `https://www.youtube.com/watch?v=${video.youtubeId}`;

  const handleOpenInYouTube = async () => {
    try {
      // Try to open in YouTube app first
      const canOpen = await Linking.canOpenURL(youtubeAppUrl);
      if (canOpen) {
        await Linking.openURL(youtubeAppUrl);
      } else {
        // Fallback to browser
        await Linking.openURL(youtubeBrowserUrl);
      }
    } catch (err) {
      console.log('Error opening YouTube:', err);
      Alert.alert('Error', 'Could not open YouTube. Please try again.');
    }
  };

  const handleRetry = () => {
    console.log('Retrying video load, attempt:', retryCount + 1);
    setError(false);
    setLoading(true);
    setRetryCount(retryCount + 1);
    
    // Force WebView reload
    if (webViewRef.current) {
      webViewRef.current.reload();
    }
  };

  const handleWebViewError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error:', nativeEvent);
    setLoading(false);
    setError(true);
  };

  const handleLoadStart = () => {
    console.log('WebView load started');
    setLoading(true);
    setError(false);
  };

  const handleLoadEnd = () => {
    console.log('WebView load ended');
    setLoading(false);
  };

  const handleHttpError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView HTTP error:', nativeEvent.statusCode, nativeEvent.description);
    if (nativeEvent.statusCode >= 400) {
      setError(true);
      setLoading(false);
    }
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <IconSymbol 
            ios_icon_name="xmark.circle.fill" 
            android_material_icon_name="close" 
            size={32} 
            color={colors.primary} 
          />
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.youtubeButton}
          onPress={handleOpenInYouTube}
        >
          <IconSymbol 
            ios_icon_name="play.rectangle.fill" 
            android_material_icon_name="open_in_new" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.youtubeButtonText}>Open in YouTube</Text>
        </TouchableOpacity>
      </View>

      {/* Video Player */}
      <View style={styles.videoContainer}>
        {loading && !error && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={styles.loadingText}>Loading video...</Text>
          </View>
        )}
        
        {error ? (
          <View style={styles.errorContainer}>
            <IconSymbol 
              ios_icon_name="exclamationmark.triangle.fill" 
              android_material_icon_name="error" 
              size={64} 
              color={colors.error} 
            />
            <Text style={styles.errorTitle}>Video Playback Error</Text>
            <Text style={styles.errorText}>
              Unable to load the video. This may be due to network issues or device compatibility.
            </Text>
            
            <View style={styles.errorActions}>
              <TouchableOpacity
                style={styles.retryButton}
                onPress={handleRetry}
              >
                <IconSymbol 
                  ios_icon_name="arrow.clockwise" 
                  android_material_icon_name="refresh" 
                  size={20} 
                  color={colors.background} 
                />
                <Text style={styles.retryButtonText}>Retry</Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={styles.openYouTubeButton}
                onPress={handleOpenInYouTube}
              >
                <IconSymbol 
                  ios_icon_name="play.rectangle.fill" 
                  android_material_icon_name="play_arrow" 
                  size={20} 
                  color={colors.background} 
                />
                <Text style={styles.retryButtonText}>Watch on YouTube</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.troubleshootBox}>
              <Text style={styles.troubleshootTitle}>Troubleshooting Tips:</Text>
              <Text style={styles.troubleshootText}>• Check your internet connection</Text>
              <Text style={styles.troubleshootText}>• Try opening the video in the YouTube app</Text>
              <Text style={styles.troubleshootText}>• Restart the app and try again</Text>
              <Text style={styles.troubleshootText}>• Update your device&apos;s operating system</Text>
            </View>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            key={`webview-${retryCount}`}
            source={{ uri: youtubeUrl }}
            style={styles.webview}
            allowsFullscreenVideo
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
            onLoadStart={handleLoadStart}
            onLoadEnd={handleLoadEnd}
            onError={handleWebViewError}
            onHttpError={handleHttpError}
            renderError={() => (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Failed to load video</Text>
              </View>
            )}
            originWhitelist={['*']}
            mixedContentMode="compatibility"
            thirdPartyCookiesEnabled
            sharedCookiesEnabled
          />
        )}
      </View>

      {/* Video Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoDescription}>{video.description}</Text>
        
        <View style={styles.infoBox}>
          <IconSymbol 
            ios_icon_name="info.circle.fill" 
            android_material_icon_name="info" 
            size={24} 
            color={colors.primary} 
          />
          <Text style={styles.infoText}>
            This video is streamed from Afroman&apos;s official YouTube channel (OGAfroman). 
            For the best experience, ensure you have a stable internet connection.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.fullScreenButton}
          onPress={handleOpenInYouTube}
        >
          <IconSymbol 
            ios_icon_name="arrow.up.right.square.fill" 
            android_material_icon_name="open_in_full" 
            size={20} 
            color={colors.primary} 
          />
          <Text style={styles.fullScreenButtonText}>Watch in Full Screen on YouTube</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  closeButton: {
    padding: 4,
  },
  youtubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 8,
    backgroundColor: colors.card,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  youtubeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.primary,
  },
  videoContainer: {
    width: '100%',
    aspectRatio: 16 / 9,
    backgroundColor: colors.background,
    position: 'relative',
  },
  webview: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    zIndex: 1,
  },
  loadingText: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 12,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 20,
  },
  errorActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openYouTubeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.secondary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.background,
  },
  troubleshootBox: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.primary,
    width: '100%',
  },
  troubleshootTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  troubleshootText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 4,
  },
  infoContainer: {
    flex: 1,
    padding: 20,
  },
  videoTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  videoDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
    marginBottom: 20,
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    marginBottom: 16,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  fullScreenButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.card,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  fullScreenButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
});
