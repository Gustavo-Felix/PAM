// app/index.tsx
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
  TextStyle,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Link, useFocusEffect } from "expo-router";
import api from "../services/api";
import { Client } from "../types/Client";
import ClientCard from "../components/ClientCard";

export default function ListaClientes() {
  const [clientes, setClientes] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  const mapApiClientToClient = (apiItem: any): Client => ({
    id: apiItem.id ?? apiItem.ID ?? apiItem.Id ?? apiItem.IdCliente,
    nome: apiItem.nome ?? apiItem.Nome,
    idade: apiItem.idade ?? apiItem.Idade,
    uf: apiItem.uf ?? apiItem.UF,
  });

  const fetchClientes = async () => {
    setLoading(true);
    try {
      const response = await api.get("/clientes");
      const normalized: Client[] = (response.data || []).map(mapApiClientToClient);
      setClientes(normalized);
    } catch (error: any) {
      console.log("Erro ao carregar clientes:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchClientes();
    }, [])
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  if (clientes.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.emptyText}>Nenhum cliente cadastrado</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={clientes}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <Link
            href={{ pathname: "/detalhe/[id]", params: { id: item.id } }}
            asChild
          >
            <TouchableOpacity activeOpacity={0.7}>
                <ClientCard client={item} />
            </TouchableOpacity>
          </Link>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Link href="/cadastro" asChild>
          <TouchableOpacity style={styles.addButton}>
            <Text style={styles.addButtonText}>+ Adicionar Cliente</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f6f8",
  } as ViewStyle,

  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6f8",
  } as ViewStyle,

  loadingText: {
    fontSize: 18,
    color: "#111",
    fontWeight: "700",
  } as TextStyle,

  emptyText: {
    fontSize: 16,
    color: "#6b7280",
    fontStyle: "italic",
  } as TextStyle,

  list: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 96,
  } as ViewStyle,

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderColor: "#e5e7eb",
    ...(Platform.OS === "web"
      ? { boxShadow: "0px -3px 8px rgba(0,0,0,0.06)" }
      : { shadowColor: "#000", shadowOpacity: 0.06, shadowOffset: { height: -3, width: 0 }, elevation: 6 }),
  } as ViewStyle,

  addButton: {
    backgroundColor: "#111",
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    minWidth: 220,
    ...(Platform.OS === "web"
      ? { boxShadow: "0px 8px 14px rgba(0,0,0,0.15)" }
      : { shadowColor: "#000", shadowOpacity: 0.15, shadowOffset: { width: 0, height: 8 }, shadowRadius: 14, elevation: 8 }),
  } as ViewStyle,

  addButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  } as TextStyle,
});