
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Platform } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from './IconSymbol';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
}

export default function FloatingTabBar({ tabs }: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isTabActive = (route: string) => {
    return pathname.startsWith(route);
  };

  const getIconName = (icon: string, isActive: boolean) => {
    const iconMap: { [key: string]: { ios: string; android: string; iosFilled: string } } = {
      home: {
        ios: 'house',
        iosFilled: 'house.fill',
        android: 'home',
      },
      person: {
        ios: 'person',
        iosFilled: 'person.fill',
        android: 'person',
      },
    };

    const iconData = iconMap[icon] || iconMap.home;
    return {
      ios: isActive ? iconData.iosFilled : iconData.ios,
      android: iconData.android,
    };
  };

  return (
    <View style={[styles.container, { paddingBottom: insets.bottom }]}>
      <View style={styles.tabBar}>
        {tabs.map((tab, index) => {
          const isActive = isTabActive(tab.route);
          const iconNames = getIconName(tab.icon, isActive);

          return (
            <React.Fragment key={tab.name}>
              <TouchableOpacity
                style={styles.tab}
                onPress={() => router.push(tab.route as any)}
              >
                <IconSymbol
                  ios_icon_name={iconNames.ios}
                  android_material_icon_name={iconNames.android}
                  size={24}
                  color={isActive ? colors.primary : colors.textSecondary}
                />
                <Text style={[styles.label, isActive && styles.labelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            </React.Fragment>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    boxShadow: '0px 4px 12px rgba(50, 205, 50, 0.3)',
    elevation: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
    marginTop: 4,
  },
  labelActive: {
    color: colors.primary,
    fontWeight: '700',
  },
});
