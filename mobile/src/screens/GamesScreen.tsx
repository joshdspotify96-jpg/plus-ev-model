import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { colors } from "../theme/colors";
import { Game } from "../types";
import { fetchGames } from "../api/client";

type GamesStackParamList = {
  GamesList: undefined;
  Props: { gameId: string; title: string };
};

function formatTime(iso: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function GameCard({ game }: { game: Game }) {
  const nav = useNavigation<NativeStackNavigationProp<GamesStackParamList>>();

  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() =>
        nav.navigate("Props", {
          gameId: game.id,
          title: `${game.away_team} @ ${game.home_team}`,
        })
      }
    >
      <View style={styles.teams}>
        <Text style={styles.away}>{game.away_team}</Text>
        <Text style={styles.at}>@</Text>
        <Text style={styles.home}>{game.home_team}</Text>
      </View>
      {game.commence_time ? (
        <Text style={styles.time}>{formatTime(game.commence_time)}</Text>
      ) : null}
    </TouchableOpacity>
  );
}

export default function GamesScreen() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchGames();
      setGames(data);
    } catch (e: any) {
      setError(e.message || "Failed to load games");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.blue} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={games}
        keyExtractor={(g) => g.id}
        renderItem={({ item }) => <GameCard game={item} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => load(true)}
            tintColor={colors.blue}
          />
        }
        contentContainerStyle={games.length === 0 ? styles.center : styles.list}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No games scheduled today</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.bg,
    padding: 32,
  },
  list: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: colors.card,
    marginHorizontal: 16,
    marginVertical: 6,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  teams: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  away: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "right",
    flex: 1,
  },
  at: {
    color: colors.textMuted,
    fontSize: 14,
  },
  home: {
    color: colors.text,
    fontSize: 16,
    fontWeight: "700",
    flex: 1,
  },
  time: {
    color: colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    marginTop: 8,
  },
  errorText: {
    color: colors.red,
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: colors.blue,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryText: {
    color: colors.text,
    fontWeight: "600",
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 15,
  },
});
