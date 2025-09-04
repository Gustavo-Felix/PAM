import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackNavigationProp } from '../navigation/types';
import api from '../services/api';
import { Client } from '../types/Client';

const ClientListScreen = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<RootStackNavigationProp>();

  const fetchClients = async () => {
    try {
      const response = await api.get('/clientes');
      setClients(response.data);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao carregar clientes.');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      fetchClients();
    });
    return unsubscribe;
  }, [navigation]);

  useEffect(() => {
    fetchClients().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: number) => {
    Alert.alert('Confirmar', 'Deseja excluir este cliente?', [
      { text: 'Cancelar' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.delete(`/cliente/${id}`);
            setClients(clients.filter(c => c.id !== id));
          } catch (error) {
            Alert.alert('Erro', 'Não foi possível excluir.');
          }
        },
      },
    ]);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchClients();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0055cc" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Clientes</Text>

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('ClientForm')}
      >
        <Text style={styles.addButtonText}>+ Novo Cliente</Text>
      </TouchableOpacity>

      <FlatList
        data={clients}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.clientItem}
            onPress={() => navigation.navigate('ClientDetail', { clientId: item.id })}
          >
            <Text style={styles.clientName}>{item.nome}</Text>
            <Text>Idade: {item.idade}</Text>
            <Text>UF: {item.uf}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.btn, styles.editBtn]}
                onPress={() => navigation.navigate('ClientForm', { clientId: item.id })}
              >
                <Text style={styles.btnText}>Editar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btn, styles.deleteBtn]}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={styles.btnText}>Excluir</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f9f9f9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  addButton: { backgroundColor: '#0055cc', padding: 12, borderRadius: 8, marginBottom: 16 },
  addButtonText: { color: 'white', textAlign: 'center', fontWeight: 'bold' },
  clientItem: { backgroundColor: 'white', padding: 16, marginBottom: 10, borderRadius: 8, borderWidth: 1, borderColor: '#eee' },
  clientName: { fontSize: 18, fontWeight: 'bold', color: '#0055cc', marginBottom: 4 },
  actions: { flexDirection: 'row', marginTop: 8, gap: 8 },
  btn: { flex: 1, padding: 8, borderRadius: 6, alignItems: 'center' },
  editBtn: { backgroundColor: '#007acc' },
  deleteBtn: { backgroundColor: '#cc0000' },
  btnText: { color: 'white', fontWeight: 'bold' },
});

export default ClientListScreen;