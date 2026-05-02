import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Modal,
  useWindowDimensions,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import axios from 'axios';

const API = "https://backend-notas-production.up.railway.app";

export default function App() {

  const { width } = useWindowDimensions();
  const isDesktop = width >= 768;

  const [screen, setScreen] = useState<'consulta' | 'estudiante' | 'notas'>('consulta');

  const [cedula, setCedula] = useState('');
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [celular, setCelular] = useState('');

  const [materia, setMateria] = useState('');
  const [nota1, setNota1] = useState('');
  const [nota2, setNota2] = useState('');
  const [nota3, setNota3] = useState('');
  const [nota4, setNota4] = useState('');

  const [resultado, setResultado] = useState<any>(null);

  const [loadingConsulta, setLoadingConsulta] = useState(false);
  const [loadingEstudiante, setLoadingEstudiante] = useState(false);
  const [loadingNotas, setLoadingNotas] = useState(false);

  // 🎀 MODAL KAWAII
  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [tipo, setTipo] = useState<'ok' | 'error' | 'warning'>('ok');

  const mostrarModal = (t: string, m: string, tipoModal: any = 'ok') => {
    setTitulo(t);
    setMensaje(m);
    setTipo(tipoModal);
    setModalVisible(true);
  };

  // =========================
  // CONSULTAR
  // =========================
  const consultar = async () => {
    if (!cedula.trim()) {
      mostrarModal("🌸 Atención", "Ingresa una cédula", "warning");
      return;
    }

    try {
      setLoadingConsulta(true);

      const res = await axios.get(`${API}/estudiantes/${cedula}`);
      setResultado(res.data);

      mostrarModal("💖 Éxito", "Consulta realizada", "ok");

    } catch (error) {
      setResultado(null);
      mostrarModal("😿 No encontrado", "No existe estudiante", "error");
    } finally {
      setLoadingConsulta(false);
    }
  };

  // =========================
  // REGISTRAR ESTUDIANTE
  // =========================
  const registrarEstudiante = async () => {
    if (!cedula || !nombre || !correo) {
      mostrarModal("🌸 Atención", "Completa los campos", "warning");
      return;
    }

    try {
      setLoadingEstudiante(true);

      await axios.post(`${API}/estudiantes`, {
        cedula,
        nombre,
        correo,
        celular
      });

      mostrarModal("🐰 Guardado", "Estudiante registrado correctamente", "ok");

      setCedula('');
      setNombre('');
      setCorreo('');
      setCelular('');

    } catch (error: any) {

      if (error.response?.status === 409) {
        mostrarModal(
          "💔 Ups...",
          "Este estudiante ya está registrado 💔",
          "warning"
        );
      } else {
        mostrarModal(
          "😿 Error",
          error.response?.data?.message || "No se pudo registrar",
          "error"
        );
      }

    } finally {
      setLoadingEstudiante(false);
    }
  };

  // =========================
  // REGISTRAR NOTAS
  // =========================
  const registrarNotas = async () => {
    if (!cedula || !materia) {
      mostrarModal("🌸 Atención", "Completa datos", "warning");
      return;
    }

    try {
      setLoadingNotas(true);

      await axios.post(`${API}/notas`, {
        cedula,
        materia,
        nota1: Number(nota1),
        nota2: Number(nota2),
        nota3: Number(nota3),
        nota4: Number(nota4)
      });

      mostrarModal("✨ Guardado", "Notas registradas correctamente", "ok");

      setMateria('');
      setNota1('');
      setNota2('');
      setNota3('');
      setNota4('');

    } catch (error) {
      mostrarModal("😿 Error", "No se pudo guardar", "error");
    } finally {
      setLoadingNotas(false);
    }
  };

  const definitiva =
    (
      Number(nota1 || 0) +
      Number(nota2 || 0) +
      Number(nota3 || 0) +
      Number(nota4 || 0)
    ) / 4;

  const colorModal =
    tipo === 'ok' ? '#ffb6d9' :
    tipo === 'warning' ? '#ffeaa7' :
    '#ff7675';

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>

        <View style={[styles.container, { maxWidth: isDesktop ? 700 : '100%' }]}>
          <ScrollView contentContainerStyle={{ paddingBottom: 140 }} keyboardShouldPersistTaps="handled">

            <Text style={[styles.mainTitle, { fontSize: isDesktop ? 34 : 28 }]}>
              🎀 Sistema de Notas 🎀
            </Text>

            {/* CONSULTA */}
            {screen === 'consulta' && (
              <View style={styles.card}>
                <Text style={styles.title}>🌸 Consulta</Text>

                <Text style={styles.label}>Cédula</Text>
                <TextInput style={styles.input} value={cedula} onChangeText={setCedula} keyboardType="numeric" />

                <Text style={styles.label}>Nombre</Text>
                <TextInput style={styles.input} editable={false} value={resultado?.estudiante?.nombre || ''} />

                <TouchableOpacity style={styles.btnPink} onPress={consultar}>
                  <Text style={styles.btnText}>Consultar</Text>
                </TouchableOpacity>

                {loadingConsulta && <ActivityIndicator size="large" color="#ff69b4" style={{ marginTop: 15 }} />}

                {resultado && (
                  <View style={styles.resultBox}>
                    <Text style={styles.subtitle}>💖 Datos</Text>
                    <Text>Correo: {resultado.estudiante.correo}</Text>
                    <Text>Celular: {resultado.estudiante.celular}</Text>

                    {resultado.notas.map((n: any, i: number) => (
                      <View key={i} style={styles.noteBox}>
                        <Text style={styles.bold}>{n.materia}</Text>
                        <Text>Nota1: {n.nota1}</Text>
                        <Text>Nota2: {n.nota2}</Text>
                        <Text>Nota3: {n.nota3}</Text>
                        <Text>Nota4: {n.nota4}</Text>
                        <Text style={styles.green}>
                          Definitiva: {Number(n.definitiva).toFixed(2)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {/* REG ESTUDIANTE */}
            {screen === 'estudiante' && (
              <View style={styles.card}>
                <Text style={styles.title}>🐰 Registrar Estudiante</Text>

                <TextInput style={styles.input} placeholder="Cédula" value={cedula} onChangeText={setCedula} />
                <TextInput style={styles.input} placeholder="Nombre" value={nombre} onChangeText={setNombre} />
                <TextInput style={styles.input} placeholder="Correo" value={correo} onChangeText={setCorreo} />
                <TextInput style={styles.input} placeholder="Celular" value={celular} onChangeText={setCelular} />

                <TouchableOpacity style={styles.btnBlue} onPress={registrarEstudiante}>
                  <Text style={styles.btnText}>Registrar</Text>
                </TouchableOpacity>

                {loadingEstudiante && <ActivityIndicator size="large" color="#7ec8ff" style={{ marginTop: 15 }} />}
              </View>
            )}

            {/* NOTAS */}
            {screen === 'notas' && (
              <View style={styles.card}>
                <Text style={styles.title}>🍓 Registrar Nota</Text>

                <TextInput style={styles.input} placeholder="Cédula" value={cedula} onChangeText={setCedula} />
                <TextInput style={styles.input} placeholder="Materia" value={materia} onChangeText={setMateria} />

                {[nota1, nota2, nota3, nota4].map((v, i) => (
                  <TextInput
                    key={i}
                    style={styles.input}
                    placeholder={`Nota ${i + 1}`}
                    keyboardType="numeric"
                    value={v}
                    onChangeText={[setNota1, setNota2, setNota3, setNota4][i]}
                  />
                ))}

                <Text style={styles.scoreBox}>{definitiva.toFixed(2)}</Text>

                <TouchableOpacity style={styles.btnPink} onPress={registrarNotas}>
                  <Text style={styles.btnText}>Guardar</Text>
                </TouchableOpacity>

                {loadingNotas && <ActivityIndicator size="large" color="#ff69b4" />}
              </View>
            )}

          </ScrollView>

          {/* MENU */}
          <View style={styles.menu}>
            <TouchableOpacity style={styles.menuBtn} onPress={() => setScreen('consulta')}>
              <Text>Consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => setScreen('estudiante')}>
              <Text>Estudiante</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuBtn} onPress={() => setScreen('notas')}>
              <Text>Notas</Text>
            </TouchableOpacity>
          </View>

        </View>

        {/* 🎀 MODAL BONITO */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalBg}>
            <View style={[styles.modalBox, { borderColor: colorModal }]}>
              <Text style={styles.modalTitle}>{titulo}</Text>
              <Text style={styles.modalText}>{mensaje}</Text>

              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: colorModal }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.btnText}>Aceptar 💖</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff5fb' },
  container: { flex: 1, padding: 15 },
  
subtitle: {
  fontSize: 18,
  fontWeight: 'bold',
  color: '#ff69b4',
  marginTop: 10
},
  mainTitle: {
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#ff69b4',
    marginBottom: 20
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 18,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ffd6ea'
  },

  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ff69b4',
    textAlign: 'center'
  },

  label: { marginTop: 8 },

  input: {
    borderWidth: 2,
    borderColor: '#ffd6ea',
    borderRadius: 12,
    padding: 12,
    marginTop: 6
  },

  btnPink: {
    backgroundColor: '#ffd6ea',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center'
  },

  btnBlue: {
    backgroundColor: '#d6ecff',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    alignItems: 'center'
  },

  btnText: { fontWeight: 'bold' },

  resultBox: { marginTop: 10 },
  noteBox: { marginTop: 10 },

  bold: { fontWeight: 'bold' },
  green: { color: 'green' },

  scoreBox: {
    marginTop: 10,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold'
  },

  menu: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10
  },

  menuBtn: {
    padding: 10,
    backgroundColor: '#ffd6ea',
    borderRadius: 10
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalBox: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 20,
    borderWidth: 3
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center'
  },

  modalText: {
    marginVertical: 10,
    textAlign: 'center'
  },

  modalBtn: {
    padding: 12,
    borderRadius: 12,
    alignItems: 'center'
  }
});