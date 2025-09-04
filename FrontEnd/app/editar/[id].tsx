import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert, TouchableOpacity, ScrollView, Platform } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import api from "../../services/api";
import { Client } from "../../types/Client";
import InputField from "../../components/InputField";

const EditarCliente: React.FC = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [nome, setNome] = useState("");
  const [idade, setIdade] = useState("");
  const [uf, setUf] = useState("");
  const [saving, setSaving] = useState(false);

  const mapApiClientToClient = (apiItem: any): Client => ({
    id: apiItem.id ?? apiItem.ID ?? apiItem.Id,
    nome: apiItem.nome ?? apiItem.Nome,
    idade: apiItem.idade ?? apiItem.Idade,
    uf: apiItem.uf ?? apiItem.UF,
  });

  const loadCliente = async () => {
    try {
      const response = await api.get(`/clientes/${id}`);
      const data = Array.isArray(response.data) ? response.data[0] : response.data;
      if (!data) {
        Alert.alert("Aviso", "Cliente não encontrado");
        router.back();
        return;
      }
      const c = mapApiClientToClient(data);
      setNome(c.nome);
      setIdade(String(c.idade ?? ""));
      setUf(c.uf ?? "");
    } catch (e) {
      Alert.alert("Erro", "Falha ao carregar cliente");
    }
  };

  useEffect(() => {
    loadCliente();
  }, [id]);

  const handleSalvar = async () => {
    if (!nome || !idade || !uf) {
      Alert.alert("Validação", "Preencha todos os campos.");
      return;
    }
    try {
      setSaving(true);
      await api.put(`/clientes/${id}`, { name: nome, age: Number(idade), uf });
      Alert.alert("Sucesso", "Cliente atualizado");
      router.back();
    } catch (e) {
      Alert.alert("Erro", "Não foi possível salvar");
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Editar Cliente</Text>
      <View style={styles.form}>
        <InputField label="Nome" value={nome} onChangeText={setNome} placeholder="Nome" autoCapitalize="words" />
        <InputField label="Idade" value={idade} onChangeText={setIdade} placeholder="Idade" keyboardType="numeric" maxLength={3} />
        <InputField label="UF" value={uf} onChangeText={setUf} placeholder="UF" autoCapitalize="characters" maxLength={2} />

        <TouchableOpacity style={styles.saveBtn} onPress={handleSalvar} disabled={saving}>
          <Text style={styles.saveText}>{saving ? "Salvando..." : "Salvar"}</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: "#f5f6f8", flexGrow: 1 },
  title: { fontSize: 22, fontWeight: "800", marginBottom: 16, color: "#111" },
  form: { backgroundColor: "#ffffff", padding: 18, borderRadius: 16, borderColor: "#e5e7eb", borderWidth: 1, ...(Platform.OS === "web" ? { boxShadow: "0px 4px 10px rgba(0,0,0,0.08)" } : { shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { height: 4, width: 0 }, shadowRadius: 10, elevation: 3 }) },
  saveBtn: { marginTop: 8, backgroundColor: "#111", padding: 16, borderRadius: 12, alignItems: "center" },
  saveText: { color: "#fff", fontWeight: "800" },
});

export default EditarCliente;


