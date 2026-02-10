import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { colors } from "../theme/colors";
import { getServerUrl, setServerUrl, healthCheck } from "../api/client";

export default function SettingsScreen() {
  const [url, setUrl] = useState("");
  const [saved, setSaved] = useState(false);
  const [checking, setChecking] = useState(false);
  const [connected, setConnected] = useState<boolean | null>(null);

  useEffect(() => {
    getServerUrl().then(setUrl);
  }, []);

  async function handleSave() {
    if (!url.startsWith("http")) {
      Alert.alert("Invalid URL", "URL must start with http:// or https://");
      return;
    }
    await setServerUrl(url);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  async function handleTest() {
    setChecking(true);
    setConnected(null);
    // Save first so the health check uses the current URL
    await setServerUrl(url);
    const ok = await healthCheck();
    setConnected(ok);
    setChecking(false);
  }

  return (
    <View style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Server Connection</Text>
        <Text style={styles.description}>
          Enter the URL of your Plus EV backend server. This is where the ML
          models and odds data are hosted.
        </Text>

        <Text style={styles.label}>Server URL</Text>
        <TextInput
          style={styles.input}
          value={url}
          onChangeText={setUrl}
          placeholder="https://your-server.com"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="url"
        />

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[styles.button, styles.saveButton]}
            onPress={handleSave}
          >
            <Text style={styles.buttonText}>{saved ? "Saved!" : "Save"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.button, styles.testButton]}
            onPress={handleTest}
            disabled={checking}
          >
            {checking ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text style={styles.buttonText}>Test Connection</Text>
            )}
          </TouchableOpacity>
        </View>

        {connected !== null && (
          <View
            style={[
              styles.statusBanner,
              { backgroundColor: connected ? colors.greenDim : colors.redDim },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: connected ? colors.green : colors.red },
              ]}
            >
              {connected ? "Connected successfully" : "Connection failed - check URL and server"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>
          Plus EV uses machine learning models to identify positive expected
          value edges in NBA player prop markets. The backend runs model
          inference and fetches live odds data.
        </Text>
        <Text style={styles.version}>v1.0.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    padding: 16,
  },
  section: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sectionTitle: {
    color: colors.text,
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
  },
  description: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  label: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 6,
  },
  input: {
    backgroundColor: colors.bg,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.text,
    fontSize: 15,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  saveButton: {
    backgroundColor: colors.blue,
  },
  testButton: {
    backgroundColor: colors.surface,
  },
  buttonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  statusBanner: {
    marginTop: 12,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },
  version: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "center",
  },
});
