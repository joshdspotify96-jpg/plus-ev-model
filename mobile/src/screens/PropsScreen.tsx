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
import { useRoute, RouteProp } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { Prop } from "../types";
import { fetchProps } from "../api/client";
import PropRow from "../components/PropRow";

type RouteParams = {
  Props: { gameId: string; title: string };
};

const PROP_TYPES = ["points", "rebounds", "assists", "threes"];

export default function PropsScreen() {
  const route = useRoute<RouteProp<RouteParams, "Props">>();
  const { gameId } = route.params;

  const [props, setProps] = useState<Prop[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propType, setPropType] = useState("points");

  const load = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) setRefreshing(true);
      else setLoading(true);
      setError(null);

      try {
        const data = await fetchProps(gameId, propType);
        setProps(data);
      } catch (e: any) {
        setError(e.message || "Failed to load props");
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [gameId, propType]
  );

  // Reload when propType changes
  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={styles.container}>
      {/* Prop type tabs */}
      <View style={styles.tabs}>
        {PROP_TYPES.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.tab, propType === t && styles.tabActive]}
            onPress={() => setPropType(t)}
          >
            <Text style={[styles.tabText, propType === t && styles.tabTextActive]}>
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Table header */}
      <View style={styles.tableHeader}>
        <Text style={[styles.headerCell, { flex: 1 }]}>Player</Text>
        <Text style={[styles.headerCell, { width: 50, textAlign: "center" }]}>Side</Text>
        <Text style={[styles.headerCell, { width: 42, textAlign: "right" }]}>Line</Text>
        <Text style={[styles.headerCell, { width: 50, textAlign: "right" }]}>Odds</Text>
        <Text style={[styles.headerCell, { width: 70, textAlign: "right" }]}>Book</Text>
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.blue} />
        </View>
      ) : error ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => load()}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={props}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <PropRow prop={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor={colors.blue}
            />
          }
          contentContainerStyle={props.length === 0 ? styles.center : undefined}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No {propType} props available</Text>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  tabs: {
    flexDirection: "row",
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 6,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: colors.card,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  tabText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
  tabTextActive: {
    color: colors.text,
  },
  tableHeader: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  headerCell: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
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
