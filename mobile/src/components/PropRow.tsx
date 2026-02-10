import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors } from "../theme/colors";
import { Prop } from "../types";

export default function PropRow({ prop }: { prop: Prop }) {
  const isOver = prop.side === "Over";

  return (
    <View style={styles.row}>
      <Text style={styles.player} numberOfLines={1}>
        {prop.player}
      </Text>
      <View style={[styles.sideBadge, { backgroundColor: isOver ? colors.greenDim : colors.redDim }]}>
        <Text style={[styles.sideText, { color: isOver ? colors.green : colors.red }]}>
          {prop.side}
        </Text>
      </View>
      <Text style={styles.line}>{prop.line}</Text>
      <Text style={styles.odds}>{prop.odds}</Text>
      <Text style={styles.book} numberOfLines={1}>
        {prop.book}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.card,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    gap: 8,
  },
  player: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
  },
  sideBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    minWidth: 50,
    alignItems: "center",
  },
  sideText: {
    fontSize: 12,
    fontWeight: "700",
  },
  line: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "500",
    width: 42,
    textAlign: "right",
  },
  odds: {
    color: colors.yellow,
    fontSize: 14,
    fontWeight: "600",
    width: 50,
    textAlign: "right",
  },
  book: {
    color: colors.textMuted,
    fontSize: 12,
    width: 70,
    textAlign: "right",
  },
});
