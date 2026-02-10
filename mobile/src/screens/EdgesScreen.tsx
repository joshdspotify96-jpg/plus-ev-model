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
import { useFocusEffect } from "@react-navigation/native";
import { colors } from "../theme/colors";
import { Edge } from "../types";
import { fetchEdges } from "../api/client";
import EdgeCard from "../components/EdgeCard";

const EDGE_THRESHOLDS = [3, 5, 8, 10];
const PROP_TYPES = ["All", "points", "rebounds", "assists", "threes"];

export default function EdgesScreen() {
  const [edges, setEdges] = useState<Edge[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [minEdge, setMinEdge] = useState(5);
  const [propFilter, setPropFilter] = useState("All");

  const load = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      const data = await fetchEdges(minEdge);
      setEdges(data);
    } catch (e: any) {
      setError(e.message || "Failed to load edges");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [minEdge]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const filtered = propFilter === "All"
    ? edges
    : edges.filter((e) => e.prop_type === propFilter);

  const sorted = [...filtered].sort((a, b) => Math.abs(b.edge) - Math.abs(a.edge));

  return (
    <View style={styles.container}>
      {/* Min Edge selector */}
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Min Edge:</Text>
        {EDGE_THRESHOLDS.map((t) => (
          <TouchableOpacity
            key={t}
            style={[styles.chip, minEdge === t && styles.chipActive]}
            onPress={() => setMinEdge(t)}
          >
            <Text style={[styles.chipText, minEdge === t && styles.chipTextActive]}>
              {t}%
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Prop type filter */}
      <View style={styles.filterBar}>
        <Text style={styles.filterLabel}>Prop:</Text>
        {PROP_TYPES.map((p) => (
          <TouchableOpacity
            key={p}
            style={[styles.chip, propFilter === p && styles.chipActive]}
            onPress={() => setPropFilter(p)}
          >
            <Text style={[styles.chipText, propFilter === p && styles.chipTextActive]}>
              {p === "All" ? "All" : p.charAt(0).toUpperCase() + p.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && !refreshing ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.blue} />
          <Text style={styles.loadingText}>Finding edges...</Text>
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
          data={sorted}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => <EdgeCard edge={item} />}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => load(true)}
              tintColor={colors.blue}
            />
          }
          contentContainerStyle={sorted.length === 0 ? styles.center : styles.list}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No edges found above {minEdge}%</Text>
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
  filterBar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 6,
  },
  filterLabel: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginRight: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.blue,
    borderColor: colors.blue,
  },
  chipText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: "600",
  },
  chipTextActive: {
    color: colors.text,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  list: {
    paddingVertical: 8,
  },
  loadingText: {
    color: colors.textSecondary,
    marginTop: 12,
    fontSize: 14,
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
