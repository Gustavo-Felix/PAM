import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { Client } from "../types/Client";

type ClientCardProps = {
  client: Client;
};

const ClientCard: React.FC<ClientCardProps> = ({ client }) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconBox}>
        <Text style={styles.icon}>👤</Text>
      </View>
      <View style={styles.info}>
        <Text style={styles.nome} numberOfLines={1} ellipsizeMode="tail">
          {client.nome}
        </Text>
        <Text style={styles.dado}>Idade: {client.idade}</Text>
        <Text style={styles.dado}>UF: {client.uf}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    padding: 18,
    marginVertical: 10,
    borderRadius: 18,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 4px 12px rgba(0,0,0,0.08)" }
      : { shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 12, elevation: 3 }),
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  iconBox: {
    justifyContent: "center",
    alignItems: "center",
    width: 56,
    height: 56,
    backgroundColor: "#111",
    borderRadius: 28,
    marginRight: 18,
  },
  icon: {
    fontSize: 26,
    color: "#fff",
  },
  info: {
    flex: 1,
    justifyContent: "center",
  },
  nome: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
  },
  dado: {
    fontSize: 14,
    color: "#6b7280",
    marginTop: 4,
  },
});

export default ClientCard;