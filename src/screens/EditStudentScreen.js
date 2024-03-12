// screens/EditStudentScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EditStudentScreen = ({ route, navigation }) => {
  const { studentId, onStudentUpdated } = route.params;
  const [student, setStudent] = useState({
    name: '',
    lastname: '',
    grade: '',
    average: '',
  });

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const existingStudents = await AsyncStorage.getItem('students');
      const studentsArray = existingStudents ? JSON.parse(existingStudents) : [];
      const selectedStudent = studentsArray.find((s) => s.id === studentId);

      if (selectedStudent) {
        setStudent(selectedStudent);
      }
    } catch (error) {
      console.error('Error loading student for editing', error);
    }
  };

  const handleSaveChanges = async () => {
    try {
      const existingStudents = await AsyncStorage.getItem('students');
      const studentsArray = existingStudents ? JSON.parse(existingStudents) : [];
      const updatedStudentsArray = studentsArray.map((s) =>
        s.id === studentId ? { ...s, ...student } : s
      );

      await AsyncStorage.setItem('students', JSON.stringify(updatedStudentsArray));

      // Llama a la función de devolución de llamada para actualizar la lista de estudiantes en StudentListScreen
      if (onStudentUpdated) {
        onStudentUpdated();
      }

      navigation.navigate('StudentList');
    } catch (error) {
      console.error('Error saving update', error);
    }
  };

  return (
    <View>
      <Text>Edit Student</Text>
      <TextInput
        placeholder="Name"
        value={student.name}
        onChangeText={(text) => setStudent({ ...student, name: text })}
      />
      <TextInput
        placeholder="Lastname"
        value={student.lastname}
        onChangeText={(text) => setStudent({ ...student, lastname: text })}
      />
      <TextInput
        placeholder="Grade"
        value={student.grade}
        onChangeText={(text) => setStudent({ ...student, grade: text })}
      />
      <TextInput
        placeholder="Average"
        value={student.average}
        onChangeText={(text) => setStudent({ ...student, average: text })}
      />
      <Button title="Save Changes" onPress={handleSaveChanges} />
    </View>
  );
};

export default EditStudentScreen;
