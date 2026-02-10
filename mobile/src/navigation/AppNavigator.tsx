import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Text } from "react-native";
import { colors } from "../theme/colors";
import EdgesScreen from "../screens/EdgesScreen";
import GamesScreen from "../screens/GamesScreen";
import PropsScreen from "../screens/PropsScreen";
import SettingsScreen from "../screens/SettingsScreen";

// Simple text icons to avoid extra icon library dependency
function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    Edges: "\u{1F4CA}",
    Games: "\u{1F3C0}",
    Settings: "\u{2699}\u{FE0F}",
  };
  return (
    <Text style={{ fontSize: 20, opacity: focused ? 1 : 0.5 }}>
      {icons[label] || "?"}
    </Text>
  );
}

type GamesStackParamList = {
  GamesList: undefined;
  Props: { gameId: string; title: string };
};

const GamesStack = createNativeStackNavigator<GamesStackParamList>();

function GamesStackScreen() {
  return (
    <GamesStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.card },
        headerTintColor: colors.text,
        headerTitleStyle: { fontWeight: "600" },
      }}
    >
      <GamesStack.Screen
        name="GamesList"
        component={GamesScreen}
        options={{ title: "Today's Games" }}
      />
      <GamesStack.Screen
        name="Props"
        component={PropsScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
    </GamesStack.Navigator>
  );
}

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerStyle: { backgroundColor: colors.card },
          headerTintColor: colors.text,
          headerTitleStyle: { fontWeight: "600" },
          tabBarStyle: {
            backgroundColor: colors.card,
            borderTopColor: colors.border,
          },
          tabBarActiveTintColor: colors.blue,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarIcon: ({ focused }) => (
            <TabIcon label={route.name} focused={focused} />
          ),
        })}
      >
        <Tab.Screen
          name="Edges"
          component={EdgesScreen}
          options={{ title: "+EV Edges" }}
        />
        <Tab.Screen
          name="Games"
          component={GamesStackScreen}
          options={{ headerShown: false }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
