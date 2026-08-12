
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
