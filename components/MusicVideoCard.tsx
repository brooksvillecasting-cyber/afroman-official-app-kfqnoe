
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { MusicVideo } from '@/types/Movie';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';
import { useWatchlist } from '@/hooks/useWatchlist';

interface MusicVideoCardProps {
  video: MusicVideo;
}

// Helper function to get YouTube thumbnail URL
const getYouTubeThumbnail = (youtubeId: string, quality: 'default' | 'hq' | 'mq' | 'sd' | 'maxres' = 'maxres'): string => {
  const qualityMap = {
    'default': 'default.jpg',
    'mq': 'mqdefault.jpg',
    'hq': 'hqdefault.jpg',
    'sd': 'sddefault.jpg',
    'maxres': 'maxresdefault.jpg'
  };
  
  return `https://img.youtube.com/vi/${youtubeId}/${qualityMap[quality]}`;
};

export const MusicVideoCard: React.FC<MusicVideoCardProps> = ({ video }) => {
  const router = useRouter();
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const inWatchlist = isInWatchlist(video.id);

  const handlePress = () => {
    console.log('Opening YouTube video:', video.youtubeId);
    router.push({
      pathname: '/youtube-player',
      params: { videoId: video.youtubeId },
    });
  };

  const handleWatchlistToggle = async (e: any) => {
    e.stopPropagation();
    const success = await toggleWatchlist(video.id, 'music_video');
    if (success) {
      Alert.alert(
        inWatchlist ? 'Removed from Watchlist' : 'Added to Watchlist',
        inWatchlist 
          ? `${video.title} has been removed from your watchlist.`
          : `${video.title} has been added to your watchlist.`,
        [{ text: 'OK' }]
      );
    }
  };

  // Get official YouTube thumbnail
  const thumbnailUrl = getYouTubeThumbnail(video.youtubeId, 'maxres');

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image 
        source={{ uri: thumbnailUrl }} 
        style={styles.thumbnail}
        defaultSource={require('@/assets/images/final_quest_240x240.png')}
      />
      <View style={styles.freeBadge}>
        <Text style={styles.freeBadgeText}>FREE</Text>
      </View>
      <View style={styles.playIconOverlay}>
        <IconSymbol 
          ios_icon_name="play.circle.fill" 
          android_material_icon_name="play_circle" 
          size={64} 
          color="rgba(255, 255, 255, 0.9)" 
        />
      </View>
      <TouchableOpacity 
        style={styles.watchlistButton}
        onPress={handleWatchlistToggle}
      >
        <IconSymbol 
          ios_icon_name={inWatchlist ? "bookmark.fill" : "bookmark"}
          android_material_icon_name={inWatchlist ? "bookmark" : "bookmark_border"}
          size={24} 
          color={inWatchlist ? colors.accent : colors.text} 
        />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{video.title}</Text>
        <Text style={styles.artist} numberOfLines={1}>{video.artist}</Text>
        <View style={styles.footer}>
          <View style={styles.durationContainer}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              android_material_icon_name="schedule" 
              size={16} 
              color={colors.textSecondary} 
            />
            <Text style={styles.duration}>{Math.floor(video.duration / 60)} min</Text>
          </View>
          <View style={styles.youtubeIcon}>
            <IconSymbol 
              ios_icon_name="play.rectangle.fill" 
              android_material_icon_name="smart_display" 
              size={24} 
              color="#FF0000" 
            />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.accent,
    boxShadow: '0px 4px 8px rgba(173, 255, 47, 0.2)',
    elevation: 4,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    backgroundColor: colors.background,
  },
  freeBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.accent,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  freeBadgeText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '800',
  },
  playIconOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -32 }, { translateY: -82 }],
  },
  watchlistButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: colors.card,
    padding: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.accent,
    zIndex: 10,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  artist: {
    fontSize: 16,
    color: colors.accent,
    fontWeight: '600',
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  durationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  duration: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  youtubeIcon: {
    padding: 4,
  },
});
