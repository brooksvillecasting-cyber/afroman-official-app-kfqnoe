
import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function AboutScreen() {
  return (
    <View style={[commonStyles.container, styles.container]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>About Afroman</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Image */}
        <View style={styles.profileSection}>
          <Image 
            source={require('@/assets/images/78f09d30-583a-4e97-8a0c-72de573f1869.jpeg')}
            style={styles.profileImage}
            resizeMode="contain"
          />
        </View>

        {/* Bio Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="person.fill" 
              android_material_icon_name="person" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Biography</Text>
          </View>
          <Text style={styles.bioText}>
            Afroman, born Joseph Edgar Foreman, is a Grammy-nominated American rapper, singer, and musician known for his humorous and laid-back style. He rose to international fame with his hit singles &quot;Because I Got High&quot; and &quot;Crazy Rap (Colt 45 & 2 Zig Zags).&quot;
          </Text>
          <Text style={styles.bioText}>
            His unique blend of comedy and hip-hop has earned him a dedicated fanbase and critical acclaim. With his distinctive voice and storytelling ability, Afroman has become an iconic figure in hip-hop culture.
          </Text>
        </View>

        {/* Achievements Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="star.fill" 
              android_material_icon_name="star" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Achievements</Text>
          </View>
          
          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="trophy.fill" 
                android_material_icon_name="emoji_events" 
                size={32} 
                color={colors.accent} 
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Grammy Nomination</Text>
              <Text style={styles.achievementText}>
                Nominated for Best Rap Solo Performance for &quot;Because I Got High&quot;
              </Text>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="chart.bar.fill" 
                android_material_icon_name="bar_chart" 
                size={32} 
                color={colors.accent} 
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Chart Success</Text>
              <Text style={styles.achievementText}>
                Multiple platinum and gold certifications worldwide
              </Text>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="play.circle.fill" 
                android_material_icon_name="play_circle" 
                size={32} 
                color={colors.accent} 
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Streaming Milestones</Text>
              <Text style={styles.achievementText}>
                Over 500 million streams across all platforms
              </Text>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="music.note" 
                android_material_icon_name="music_note" 
                size={32} 
                color={colors.accent} 
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Album Sales</Text>
              <Text style={styles.achievementText}>
                Millions of albums sold worldwide since 2000
              </Text>
            </View>
          </View>

          <View style={styles.achievementCard}>
            <View style={styles.achievementIcon}>
              <IconSymbol 
                ios_icon_name="film.fill" 
                android_material_icon_name="movie" 
                size={32} 
                color={colors.accent} 
              />
            </View>
            <View style={styles.achievementContent}>
              <Text style={styles.achievementTitle}>Film & TV</Text>
              <Text style={styles.achievementText}>
                Featured in numerous films, TV shows, and documentaries
              </Text>
            </View>
          </View>
        </View>

        {/* Legacy Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <IconSymbol 
              ios_icon_name="sparkles" 
              android_material_icon_name="auto_awesome" 
              size={24} 
              color={colors.primary} 
            />
            <Text style={styles.sectionTitle}>Legacy</Text>
          </View>
          <Text style={styles.bioText}>
            Afroman&apos;s impact on hip-hop culture extends beyond his music. His humorous approach to storytelling and his ability to connect with audiences worldwide has made him a beloved figure in the music industry. His songs continue to resonate with fans old and new, cementing his place in hip-hop history.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 48,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.primary,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  profileImage: {
    width: 280,
    height: 280,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: colors.primary,
    boxShadow: '0px 8px 24px rgba(50, 205, 50, 0.4)',
    elevation: 10,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  bioText: {
    fontSize: 16,
    color: colors.textSecondary,
    lineHeight: 26,
    marginBottom: 16,
  },
  achievementCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.primary,
    gap: 16,
    boxShadow: '0px 2px 8px rgba(50, 205, 50, 0.15)',
    elevation: 3,
  },
  achievementIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.primary,
  },
  achievementContent: {
    flex: 1,
    justifyContent: 'center',
  },
  achievementTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  achievementText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
