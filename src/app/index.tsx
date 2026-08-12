
// Importamos React y el hook "useState", que sirve para guardar datos que pueden cambiar (llamados "estado") y hacer que la pantalla se vuelva a dibujar cuando cambian.
import React, { useState } from 'react';


import {
  SafeAreaView, // SafeAreaView: evita que el contenido choque con el "notch" del celular.
  ScrollView, // ScrollView: contenedor que permite hacer scroll.
  View, // View: un contenedor genérico, como un <div> en la web.
  Text, // Text: para mostrar texto.
  TextInput, // TextInput: la caja donde el usuario escribe.
  Button, // Button: un botón sencillo.
  FlatList, // FlatList: lista optimizada para mostrar muchos elementos.
  Alert, // Alert: para mostrar la ventana de confirmación de eliminacion de tarea.
  StyleSheet, // StyleSheet: para organizar nuestros estilos.
} from 'react-native';

// Definimos qué forma tiene una "tarea": un objeto con un id único (para que React pueda identificar cada elemento de la lista) y un texto con la descripción de la tarea.
type Task = {
  id: string;
  text: string;
};

// Este es el componente principal de la aplicación. En React Native, un "componente" es una función que devuelve lo que se debe dibujar en pantalla.
export default function App() {


  //*** / ESTADO (datos que cambian con el tiempo)***

  // "tasks" guarda el array de tareas. Empezamos con un array vacío [].
  // "setTasks" es la función que usamos para actualizar ese arreglo.
  const [tasks, setTasks] = useState<Task[]>([]);

  // "isAdding" controla si el TextInput está visible o no.
  // Empieza en "false" porque al abrir la app no se ve el input.
  const [isAdding, setIsAdding] = useState(false);

  // "newTaskText" guarda lo que el usuario va escribiendo en el TextInput.
  const [newTaskText, setNewTaskText] = useState('');


  // ***FUNCIONES (lo que pasa cuando el usuario presiona algo)***

  //Al presionar "Nueva tarea", se muestra el TextInput.
  function handleNuevaTarea() {
    setIsAdding(true); // Se cambia el estado a "true" -> el input aparece
  }

  function handleGuardar() {
    // Evitamos guardar tareas vacías (solo espacios en blanco)
    if (newTaskText.trim() === '') {
      Alert.alert('Atención', 'Escribe una tarea antes de guardar.');
      return; // Sale de la función sin hacer nada más
    }

    // Creando el nuevo objeto de tarea.
    // Se usa Date.now() convertido a texto como un id "único" simple.
    const nuevaTarea: Task = {
      id: Date.now().toString(),
      text: newTaskText.trim(),
    };

    // Actualizamos el arreglo de tareas.
    // "...tasks" copia todas las tareas que ya existían,
    // y agregamos la nueva al final.
    setTasks([...tasks, nuevaTarea]);

    // Limpiamos el input y lo ocultamos de nuevo.
    setNewTaskText('');
    setIsAdding(false);
  }

  //Al presionar "Eliminar" en una tarea, mostramos
  // una confirmación. Si el usuario acepta, la quitamos del arreglo.
  function handleEliminar(id: string) {
    Alert.alert(
      'Confirmar eliminación', // Título de la alerta
      '¿Está seguro que desea eliminar la tarea?', // Mensaje
      [
        {
          text: 'Cancelar',
          style: 'cancel', // No hace nada, solo cierra la alerta
        },
        {
          text: 'Eliminar',
          style: 'destructive', // En iOS se muestra en rojo
          onPress: () => {
            // "filter" crea un nuevo arreglo con todas las tareas
            // EXCEPTO la que tiene el id que queremos eliminar.
            setTasks(tasks.filter((tarea) => tarea.id !== id));
          },
        },
      ],
    );
  }

  // FUNCIÓN QUE DIBUJA CADA ELEMENTO DE LA LISTA
  // FlatList llama a esta función una vez por cada tarea en "tasks".
  // "item" es una de las tareas del arreglo.
  function renderTask({ item }: { item: Task }) {
    return (
      <View style={styles.taskRow} >
        {/* Mostramos el texto de la tarea. flex:1 hace que ocupe
            todo el espacio posible antes del botón. */}
        < Text style={styles.taskText} > {item.text} </Text>

        {/* Botón eliminar: le pasamos el id de esta tarea */}
        <Button
          title="Eliminar"
          color="#d9534f"
          onPress={() => handleEliminar(item.id)
          }
        />
      </View>
    );
  }


  // LO QUE SE DIBUJA EN PANTALLA
  return (
    // SafeAreaView asegura que el contenido no quede debajo de la cámara del celular.
    <SafeAreaView style={styles.container} >
      {/*el contenedor principal es un ScrollView */}
      < ScrollView contentContainerStyle={styles.scrollContent} >
        <Text style={styles.title}> Lista de tareas </Text>

        {/*botón que muestra el TextInput */}
        <Button title="Nueva tarea" onPress={handleNuevaTarea} />

        {/* El TextInput solo se muestra si isAdding es true.
            "isAdding && (...)" es una forma corta de decir:
            "si isAdding es verdadero, muestra lo que sigue". */}
        {
          isAdding && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Escribe la tarea..."
                value={newTaskText}
                // Cada vez que el usuario escribe, actualizamos el estado
                onChangeText={setNewTaskText}
              />
              {/*botón que guarda la tarea */}
              < Button title="Guardar" onPress={handleGuardar} />
            </View>
          )
        }

        {/*Lista de tareas con FlatList.
            - data: el arreglo que queremos mostrar
            - renderItem: la función que dibuja cada elemento
            - keyExtractor: le dice a React cómo identificar cada elemento
            - scrollEnabled={false}: dejamos que el ScrollView de afuera
              controle el scroll, para no tener dos scrolls anidados */}
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          ListEmptyComponent={
            < Text style={styles.emptyText} > Aún no hay tareas.</Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
