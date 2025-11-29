
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useVideoPlayer, VideoView } from 'expo-video';
import { useEvent } from 'expo';
import { colors, commonStyles } from '@/styles/commonStyles';
import { useMovies } from '@/hooks/useMovies';
import { useAuth } from '@/hooks/useAuth';
import { IconSymbol } from '@/components/IconSymbol';

const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

export default function MoviePlayerScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { movies } = useMovies();
  const { user } = useAuth();
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1.0);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [hasCheckedSubscription, setHasCheckedSubscription] = useState(false);

  const movie = movies.find(m => m.id === params.movieId);

  const player = useVideoPlayer(movie?.videoUrl || '', player => {
    player.loop = false;
    player.play();
  });

  const { isPlaying } = useEvent(player, 'playingChange', { isPlaying: player.playing });
  const { currentTime, duration } = useEvent(player, 'timeUpdate', {
    currentTime: player.currentTime,
    duration: player.duration,
  });

  useEffect(() => {
    // Only check subscription for premium movies
    if (movie?.isPremium && !hasCheckedSubscription) {
      if (!user?.hasSubscription && !user?.isAdmin) {
        Alert.alert(
          'Premium Content',
          'This movie requires a premium subscription. Music videos are free to watch!',
          [
            { text: 'Watch Free Videos', onPress: () => router.replace('/(tabs)/(home)') },
            { text: 'Subscribe', onPress: () => router.push('/subscription') },
          ]
        );
      }
      setHasCheckedSubscription(true);
    }
  }, [movie, user, hasCheckedSubscription]);

  if (!movie) {
    return (
      <View style={[commonStyles.container, styles.container]}>
        <Text style={styles.errorText}>Movie not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
    } else {
      player.play();
    }
  };

  const handleSpeedChange = (speed: number) => {
    player.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSpeedMenu(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const seekForward = () => {
    player.currentTime = Math.min(player.currentTime + 10, player.duration);
  };

  const seekBackward = () => {
    player.currentTime = Math.max(player.currentTime - 10, 0);
  };

  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Video Player */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="contain"
          nativeControls={false}
        />

        {/* Custom Controls Overlay */}
        <TouchableOpacity 
          style={styles.controlsOverlay}
          activeOpacity={1}
          onPress={() => setShowControls(!showControls)}
        >
          {showControls && (
            <View style={styles.controls}>
              {/* Top Bar */}
              <View style={styles.topBar}>
                <TouchableOpacity style={styles.backButtonTop} onPress={() => router.back()}>
                  <IconSymbol 
                    ios_icon_name="chevron.left" 
                    android_material_icon_name="arrow_back" 
                    size={28} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
                <Text style={styles.videoTitle} numberOfLines={1}>{movie.title}</Text>
                {movie.isPremium && (
                  <View style={styles.premiumBadgeTop}>
                    <IconSymbol 
                      ios_icon_name="star.fill" 
                      android_material_icon_name="star" 
                      size={16} 
                      color={colors.background} 
                    />
                  </View>
                )}
              </View>

              {/* Center Controls */}
              <View style={styles.centerControls}>
                <TouchableOpacity style={styles.controlButton} onPress={seekBackward}>
                  <IconSymbol 
                    ios_icon_name="gobackward.10" 
                    android_material_icon_name="replay_10" 
                    size={40} 
                    color={colors.text} 
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.playButton} onPress={togglePlayPause}>
                  <IconSymbol 
                    ios_icon_name={isPlaying ? "pause.circle.fill" : "play.circle.fill"}
                    android_material_icon_name={isPlaying ? "pause_circle" : "play_circle"}
                    size={64} 
                    color={colors.primary} 
                  />
                </TouchableOpacity>

                <TouchableOpacity style={styles.controlButton} onPress={seekForward}>
                  <IconSymbol 
                    ios_icon_name="goforward.10" 
                    android_material_icon_name="forward_10" 
                    size={40} 
                    color={colors.text} 
                  />
                </TouchableOpacity>
              </View>

              {/* Bottom Bar */}
              <View style={styles.bottomBar}>
                <View style={styles.timeContainer}>
                  <Text style={styles.timeText}>{formatTime(currentTime)}</Text>
                  <Text style={styles.timeText}>/</Text>
                  <Text style={styles.timeText}>{formatTime(duration)}</Text>
                </View>

                <TouchableOpacity 
                  style={styles.speedButton}
                  onPress={() => setShowSpeedMenu(!showSpeedMenu)}
                >
                  <Text style={styles.speedButtonText}>{playbackSpeed}x</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Speed Menu */}
      {showSpeedMenu && (
        <View style={styles.speedMenu}>
          <Text style={styles.speedMenuTitle}>Playback Speed</Text>
          {PLAYBACK_SPEEDS.map((speed, index) => (
            <React.Fragment key={speed}>
              <TouchableOpacity
                style={[
                  styles.speedOption,
                  playbackSpeed === speed && styles.speedOptionActive,
                ]}
                onPress={() => handleSpeedChange(speed)}
              >
                <Text style={[
                  styles.speedOptionText,
                  playbackSpeed === speed && styles.speedOptionTextActive,
                ]}>
                  {speed}x
                </Text>
                {playbackSpeed === speed && (
                  <IconSymbol 
                    ios_icon_name="checkmark" 
                    android_material_icon_name="check" 
                    size={20} 
                    color={colors.primary} 
                  />
                )}
              </TouchableOpacity>
            </React.Fragment>
          ))}
        </View>
      )}

      {/* Movie Info */}
      <ScrollView style={styles.infoContainer} contentContainerStyle={styles.infoContent}>
        {movie.isPremium && (
          <View style={styles.premiumBadge}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={20} 
              color={colors.accent} 
            />
            <Text style={styles.premiumBadgeText}>PREMIUM CONTENT</Text>
          </View>
        )}
        <Text style={styles.movieTitle}>{movie.title}</Text>
        <Text style={styles.movieDescription}>{movie.description}</Text>
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
  video: {
    width: '100%',
    height: '100%',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  controls: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 48,
    gap: 12,
  },
  backButtonTop: {
    padding: 8,
  },
  videoTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  premiumBadgeTop: {
    backgroundColor: colors.accent,
    padding: 8,
    borderRadius: 20,
  },
  centerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 40,
  },
  controlButton: {
    padding: 12,
  },
  playButton: {
    padding: 12,
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  timeContainer: {
    flexDirection: 'row',
    gap: 6,
  },
  timeText: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
  },
  speedButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
  },
  speedButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.primary,
  },
  speedMenu: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    minWidth: 150,
  },
  speedMenuTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    marginBottom: 12,
    paddingHorizontal: 8,
  },
  speedOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  speedOptionActive: {
    backgroundColor: colors.background,
  },
  speedOptionText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
  speedOptionTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  infoContainer: {
    flex: 1,
  },
  infoContent: {
    padding: 20,
    paddingBottom: 120,
  },
  premiumBadge: {
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
  premiumBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: colors.accent,
  },
  movieTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: colors.text,
    marginBottom: 12,
  },
  movieDescription: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 24,
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
