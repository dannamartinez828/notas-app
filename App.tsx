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

  const [modalVisible, setModalVisible] = useState(false);
  const [titulo, setTitulo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const mostrarModal = (t: string, m: string) => {
    setTitulo(t);
    setMensaje(m);
    setModalVisible(true);
  };

  // =========================
  // CONSULTAR
  // =========================
  const consultar = async () => {
    if (!cedula.trim()) {
      mostrarModal("🌸 Atención", "Ingresa una cédula");
      return;
    }

    try {
      setLoadingConsulta(true);

      const res = await axios.get(`${API}/estudiantes/${cedula}`);
      setResultado(res.data);

      mostrarModal("💖 Éxito", "Consulta realizada");

    } catch (error) {
      setResultado(null);
      mostrarModal("😿 No encontrado", "No existe estudiante");
    } finally {
      setLoadingConsulta(false);
    }
  };

  // =========================
  // REGISTRAR ESTUDIANTE
  // =========================
  const registrarEstudiante = async () => {
    if (!cedula || !nombre || !correo) {
      mostrarModal("🌸 Atención", "Completa los campos");
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

      mostrarModal("🐰 Guardado", "Estudiante registrado");

      setCedula('');
      setNombre('');
      setCorreo('');
      setCelular('');

    } catch (error) {
      mostrarModal("😿 Error", "No se pudo registrar");
    } finally {
      setLoadingEstudiante(false);
    }
  };

  // =========================
  // REGISTRAR NOTAS
  // =========================
  const registrarNotas = async () => {
    if (!cedula || !materia) {
      mostrarModal("🌸 Atención", "Completa datos");
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

      mostrarModal("✨ Guardado", "Notas registradas");

      setMateria('');
      setNota1('');
      setNota2('');
      setNota3('');
      setNota4('');

    } catch (error) {
      mostrarModal("😿 Error", "No se pudo guardar");
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

  return (
    <SafeAreaView style={styles.safe}>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >

        <View style={[
          styles.container,
          { maxWidth: isDesktop ? 700 : '100%' }
        ]}>

          <ScrollView
            contentContainerStyle={{ paddingBottom: 140 }}
            keyboardShouldPersistTaps="handled"
          >

            <Text style={[
              styles.mainTitle,
              { fontSize: isDesktop ? 34 : 28 }
            ]}>
              🎀 Sistema de Notas 🎀
            </Text>

            {/* CONSULTA */}
            {screen === 'consulta' && (
              <View style={styles.card}>

                <Text style={styles.title}>🌸 Consulta</Text>

                <Text style={styles.label}>Cédula</Text>
                <TextInput
                  style={styles.input}
                  value={cedula}
                  onChangeText={setCedula}
                  keyboardType="numeric"
                />

                <Text style={styles.label}>Nombre</Text>
                <TextInput
                  style={styles.input}
                  editable={false}
                  value={resultado?.estudiante?.nombre || ''}
                />

                <TouchableOpacity style={styles.btnPink} onPress={consultar}>
                  <Text style={styles.btnText}>Consultar</Text>
                </TouchableOpacity>

                {loadingConsulta &&
                  <ActivityIndicator
                    size="large"
                    color="#ff69b4"
                    style={{ marginTop: 15 }}
                  />
                }

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

                <Text style={styles.label}>Cédula</Text>
                <TextInput style={styles.input} value={cedula} onChangeText={setCedula} />

                <Text style={styles.label}>Nombre</Text>
                <TextInput style={styles.input} value={nombre} onChangeText={setNombre} />

                <Text style={styles.label}>Correo</Text>
                <TextInput style={styles.input} value={correo} onChangeText={setCorreo} />

                <Text style={styles.label}>Celular</Text>
                <TextInput style={styles.input} value={celular} onChangeText={setCelular} />

                <TouchableOpacity style={styles.btnBlue} onPress={registrarEstudiante}>
                  <Text style={styles.btnText}>Registrar Estudiante</Text>
                </TouchableOpacity>

                {loadingEstudiante &&
                  <ActivityIndicator
                    size="large"
                    color="#7ec8ff"
                    style={{ marginTop: 15 }}
                  />
                }

              </View>
            )}

            {/* NOTAS */}
            {screen === 'notas' && (
              <View style={styles.card}>

                <Text style={styles.title}>🍓 Registrar Nota</Text>

                <Text style={styles.label}>Cédula</Text>
                <TextInput style={styles.input} value={cedula} onChangeText={setCedula} />

                <Text style={styles.label}>Materia</Text>
                <TextInput style={styles.input} value={materia} onChangeText={setMateria} />

                {['1', '2', '3', '4'].map((n, i) => (
                  <View key={i}>
                    <Text style={styles.label}>Nota {n}</Text>
                    <TextInput
                      style={styles.input}
                      keyboardType="numeric"
                      value={[nota1, nota2, nota3, nota4][i]}
                      onChangeText={
                        [setNota1, setNota2, setNota3, setNota4][i]
                      }
                    />
                  </View>
                ))}

                <View style={styles.row}>
                  <Text style={styles.scoreBox}>
                    {definitiva.toFixed(2)}
                  </Text>

                  <Text style={styles.greenBtn}>
                    Definitiva
                  </Text>
                </View>

                <TouchableOpacity style={styles.btnPink} onPress={registrarNotas}>
                  <Text style={styles.btnText}>Guardar Notas</Text>
                </TouchableOpacity>

                {loadingNotas &&
                  <ActivityIndicator
                    size="large"
                    color="#ff69b4"
                    style={{ marginTop: 15 }}
                  />
                }

              </View>
            )}

          </ScrollView>

          {/* MENU */}
          <View style={styles.menu}>

            <TouchableOpacity
              style={[
                styles.menuBtn,
                screen === 'consulta' && styles.menuPink
              ]}
              onPress={() => setScreen('consulta')}
            >
              <Text style={styles.menuText}>Consulta</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuBtn,
                screen === 'estudiante' && styles.menuBlue
              ]}
              onPress={() => setScreen('estudiante')}
            >
              <Text style={styles.menuText}>Estudiante</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.menuBtn,
                screen === 'notas' && styles.menuPink
              ]}
              onPress={() => setScreen('notas')}
            >
              <Text style={styles.menuText}>Notas</Text>
            </TouchableOpacity>

          </View>

        </View>

        {/* MODAL */}
        <Modal transparent visible={modalVisible} animationType="fade">
          <View style={styles.modalBg}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>{titulo}</Text>
              <Text style={styles.modalText}>{mensaje}</Text>

              <TouchableOpacity
                style={styles.modalBtn}
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

  safe: {
    flex: 1,
    backgroundColor: '#fff5fb'
  },

  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
    padding: 15
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
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4',
    textAlign: 'center',
    marginBottom: 15
  },

  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff69b4'
  },

  label: {
    marginTop: 8,
    marginBottom: 4,
    fontWeight: '600'
  },

  input: {
    borderWidth: 2,
    borderColor: '#ffd6ea',
    borderRadius: 12,
    padding: 12,
    backgroundColor: '#fff'
  },

  btnPink: {
    backgroundColor: '#ffd6ea',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14
  },

  btnBlue: {
    backgroundColor: '#d6ecff',
    padding: 14,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 14
  },

  btnText: {
    fontWeight: 'bold',
    fontSize: 16
  },

  resultBox: {
    marginTop: 15
  },

  noteBox: {
    backgroundColor: '#fff7fc',
    padding: 12,
    borderRadius: 14,
    marginTop: 10
  },

  bold: {
    fontWeight: 'bold'
  },

  green: {
    color: 'green',
    fontWeight: 'bold'
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15
  },

  scoreBox: {
    backgroundColor: '#d8ffd8',
    padding: 10,
    borderRadius: 10,
    fontWeight: 'bold'
  },

  greenBtn: {
    backgroundColor: '#c7f7c7',
    padding: 10,
    borderRadius: 10
  },

  menu: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 2,
    borderColor: '#ffd6ea'
  },

  menuBtn: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    minWidth: 110,
    borderRadius: 14,
    alignItems: 'center'
  },

  menuPink: {
    backgroundColor: '#ffd6ea'
  },

  menuBlue: {
    backgroundColor: '#d6ecff'
  },

  menuText: {
    fontWeight: 'bold'
  },

  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center'
  },

  modalBox: {
    width: '82%',
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 22,
    alignItems: 'center'
  },

  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ff69b4'
  },

  modalText: {
    marginVertical: 15,
    textAlign: 'center'
  },

  modalBtn: {
    backgroundColor: '#ffd6ea',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 14
  }

});