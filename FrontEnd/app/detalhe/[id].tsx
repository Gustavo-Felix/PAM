import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../services/api";
import { Client } from "../../types/Client";

const DetalheCliente: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [cliente, setCliente] = useState<Client | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const mapApiClientToClient = (apiItem: any): Client => ({
    id: apiItem.id ?? apiItem.ID ?? apiItem.Id,
    idade: apiItem.idade ?? apiItem.Idade,
    nome: apiItem.nome ?? apiItem.Nome,
    uf: apiItem.uf ?? apiItem.UF,
  });

  const confirmAsync = (title: string, message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      if (Platform.OS === "web") {
        // eslint-disable-next-line no-alert
        resolve(window.confirm(`${title}\n\n${message}`));
      } else {
        Alert.alert(title, message, [
          { text: "Cancelar", style: "cancel", onPress: () => resolve(false) },
          { text: "OK", onPress: () => resolve(true) },
        ]);
      }
    });
  };

  const fetchCliente = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/clientes/${id}`);
      const payload = Array.isArray(response.data) ? response.data[0] : response.data;
      if (payload == null) {
        Alert.alert("Aviso", "Cliente não encontrado");
        router.back();
        return;
      }
      setCliente(mapApiClientToClient(payload));
    } catch (error: any) {
      Alert.alert("Erro", "Falha ao carregar cliente.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCliente();
  }, [id]);

  const handleDelete = async () => {
    if (!id) return;
    const ok = await confirmAsync("Confirmar", "Deseja excluir este cliente?");
    if (!ok) return;
    try {
      setDeleting(true);
      await api.delete(`/cliente/${id}`);
      Alert.alert("Sucesso", "Cliente excluído.");
      router.back();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível excluir.");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = async () => {
    const ok = await confirmAsync("Confirmar", "Deseja editar este cliente?");
    if (!ok || !cliente) return;
    router.push({ pathname: "/editar/[id]", params: { id: String(cliente.id) } });
  };

  if (loading) {
    return (
      <View style={styles.center}> 
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (!cliente) {
    return (
      <View style={styles.center}>
        <Text>Cliente não encontrado.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalhes do Cliente</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{cliente.nome}</Text>

        <Text style={styles.label}>Idade</Text>
        <Text style={styles.value}>{cliente.idade}</Text>

        <Text style={styles.label}>UF</Text>
        <Text style={styles.value}>{cliente.uf}</Text>
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={[styles.btn, styles.editBtn]} onPress={handleEdit}>
          <Text style={styles.btnText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.btn, styles.btnLast, styles.deleteBtn]} onPress={handleDelete} disabled={deleting}>
          <Text style={styles.btnText}>{deleting ? "Excluindo..." : "Excluir"}</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.back} onPress={() => router.back()}>
        <Text style={styles.backText}>Voltar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f6f8", padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#111" },
  card: { backgroundColor: "#ffffff", borderRadius: 16, padding: 18, borderWidth: 1, borderColor: "#e5e7eb", ...(Platform.OS === "web" ? { boxShadow: "0px 4px 10px rgba(0,0,0,0.08)" } : { shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { height: 4, width: 0 }, shadowRadius: 10, elevation: 3 }) },
  label: { fontSize: 12, color: "#6b7280", marginTop: 12, textTransform: "uppercase", letterSpacing: 0.6 },
  value: { fontSize: 18, color: "#111", fontWeight: "800" },
  actions: { flexDirection: "row", marginTop: 24 },
  btn: { flex: 1, paddingVertical: 14, borderRadius: 12, alignItems: "center", marginRight: 12 },
  btnLast: { marginRight: 0 },
  editBtn: { backgroundColor: "#111" },
  deleteBtn: { backgroundColor: "#ef4444" },
  btnText: { color: "#fff", fontWeight: "800" },
  back: { marginTop: 16, alignSelf: "center" },
  backText: { color: "#111", fontWeight: "800" },
});

export default DetalheCliente;


