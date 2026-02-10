import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { Edge } from "../types";

function formatOdds(odds: number): string {
  return odds > 0 ? `+${odds}` : `${odds}`;
}

function propLabel(propType: string): string {
  const labels: Record<string, string> = {
    points: "PTS",
    rebounds: "REB",
    assists: "AST",
    threes: "3PM",
    blocks: "BLK",
    steals: "STL",
  };
  return labels[propType] || propType.toUpperCase();
}

export default function EdgeCard({ edge }: { edge: Edge }) {
  const isPositive = edge.edge > 0;
  const edgeColor = isPositive ? colors.green : colors.red;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.playerName}>{edge.player_name}</Text>
        <View style={[styles.edgeBadge, { backgroundColor: isPositive ? colors.greenDim : colors.redDim }]}>
          <Text style={[styles.edgeText, { color: edgeColor }]}>
            {edge.edge > 0 ? "+" : ""}
            {edge.edge.toFixed(1)}%
          </Text>
        </View>
      </View>

      <View style={styles.propRow}>
        <View style={styles.propBadge}>
          <Text style={styles.propBadgeText}>{propLabel(edge.prop_type)}</Text>
        </View>
        <Text style={styles.sideText}>
          {edge.side} {edge.line}
        </Text>
        <Text style={styles.oddsText}>{formatOdds(edge.odds)}</Text>
      </View>

      <View style={styles.detailsRow}>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Model</Text>
          <Text style={styles.detailValue}>{(edge.model_prob * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Market</Text>
          <Text style={styles.detailValue}>{(edge.market_prob * 100).toFixed(0)}%</Text>
        </View>
        <View style={styles.detail}>
          <Text style={styles.detailLabel}>Book</Text>
          <Text style={styles.detailValue}>{edge.book}</Text>
        </View>
        {edge.kelly > 0 && (
          <View style={styles.detail}>
            <Text style={styles.detailLabel}>Kelly</Text>
            <Text style={[styles.detailValue, { color: colors.green }]}>
              {(edge.kelly * 100).toFixed(1)}%
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  playerName: {
    color: colors.text,
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
  },
  edgeBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  edgeText: {
    fontSize: 15,
    fontWeight: "800",
  },
  propRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    gap: 10,
  },
  propBadge: {
    backgroundColor: colors.blue,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  propBadgeText: {
    color: colors.text,
    fontSize: 12,
    fontWeight: "700",
  },
  sideText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "500",
  },
  oddsText: {
    color: colors.yellow,
    fontSize: 15,
    fontWeight: "600",
  },
  detailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 10,
  },
  detail: {
    alignItems: "center",
  },
  detailLabel: {
    color: colors.textMuted,
    fontSize: 11,
    marginBottom: 2,
  },
  detailValue: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
