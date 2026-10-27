import React, { useState, useEffect } from 'react';
import { View, Text, Button, ActivityIndicator, Alert, StyleSheet } from 'react-native';

type Publicacao = {
  id: number;
  title: string;
  body: string;
  userId?: number; 
};

export default function Aula08() {
  const [publicacao, setPublicacao] = useState<Publicacao | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [contador, setContador] = useState(1);

  async function buscarPublicacao(id: number = 1) {
    try {
      setCarregando(true);
      setErro(null);
      const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`);
      
      if (!resposta.ok) {
        throw new Error('Erro na resposta do servidor');
      }
      
      const dados: Publicacao = await resposta.json();
      setPublicacao(dados);
    } catch (e) {
      setErro('Não foi possível carregar os dados.');
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    buscarPublicacao(contador);
  }, []);

  function incrementarContador() {
    const proximo = contador + 1;
    setContador(proximo);
    buscarPublicacao(proximo);
  }

  async function criarPublicacao() {
    try {
      const resposta = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ title: 'Nova Publicação', body: 'Conteúdo criado', userId: 1 }),
      });
      if (!resposta.ok) throw new Error();
      const dados = await resposta.json();
      Alert.alert('Sucesso', `Criado com ID: ${dados.id}`);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível criar.');
    }
  }

  async function substituirPublicacao(id: number) {
    try {
      const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ id, title: 'Título Substituído', body: 'Conteúdo substituído', userId: 1 }),
      });
      if (!resposta.ok) throw new Error();
      Alert.alert('Sucesso', 'Publicação substituída (PUT)!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível substituir.');
    }
  }

  async function atualizarParcialmente(id: number) {
    try {
      const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts/1/${id}`, {
        method: 'PATCH',
        headers: { 'Content-type': 'application/json; charset=UTF-8' },
        body: JSON.stringify({ title: 'Apenas o Título Atualizado' }),
      });
      if (!resposta.ok) throw new Error();
      Alert.alert('Sucesso', 'Título atualizado (PATCH)!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível atualizar.');
    }
  }

  async function deletarPublicacao(id: number) {
    try {
      const resposta = await fetch(`https://jsonplaceholder.typicode.com/posts/1/${id}`, {
        method: 'DELETE',
      });
      if (!resposta.ok) throw new Error();
      Alert.alert('Sucesso', 'Publicação deletada com sucesso!');
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível deletar.');
    }
  }

  if (carregando) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando...</Text>
      </View>
    );
  }

  if (erro) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', marginBottom: 10 }}>{erro}</Text>
        <Button title="Tentar novamente" onPress={() => buscarPublicacao(contador)} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Publicação #{publicacao?.id}</Text>
      <Text style={{ fontSize: 22, fontWeight: 'bold', marginVertical: 10, textAlign: 'center' }}>
        {publicacao?.title}
      </Text>
      <Text style={{ textAlign: 'center', marginBottom: 20 }}>{publicacao?.body}</Text>
      
      <Button title="Buscar próximo (GET)" onPress={incrementarContador} />

      <View style={{ marginTop: 20, gap: 10 }}>
        <Button title="Criar (POST)" onPress={criarPublicacao} color="green" />
        <Button title="Substituir (PUT)" onPress={() => substituirPublicacao(publicacao?.id || 1)} color="orange" />
        <Button title="Atualizar Título (PATCH)" onPress={() => atualizarParcialmente(publicacao?.id || 1)} color="purple" />
        <Button title="Deletar (DELETE)" onPress={() => deletarPublicacao(publicacao?.id || 1)} color="red" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});