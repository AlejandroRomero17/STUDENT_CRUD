import React, { useState, useEffect } from "react";
import { View, Text, Button, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const storedStudents = await AsyncStorage.getItem("students");
      if (storedStudents) {
        setStudents(JSON.parse(storedStudents));
      }
    } catch (error) {
      console.error("Error loading students", error);
    }
  };

  const navigateToEditStudent = (studentId) => {
    navigation.navigate("EditStudent", {
      studentId,
      onStudentUpdated: loadStudents,
    });
  };

  const confirmDelete = (studentId) => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this student?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => handleDeleteStudent(studentId),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteStudent = async (studentId) => {
    try {
      const existingStudents = await AsyncStorage.getItem("students");
      const studentsArray = existingStudents
        ? JSON.parse(existingStudents)
        : [];
      const updatedStudentsArray = studentsArray.filter(
        (s) => s.id !== studentId
      );

      await AsyncStorage.setItem(
        "students",
        JSON.stringify(updatedStudentsArray)
      );

      // REFRESCAR LISTA DESPUÉS DE LA ELIMINACION
      loadStudents();
    } catch (error) {
      console.error("Error deleting student", error);
    }
  };

  return (
    <View>
      <Text>Students List</Text>
      <FlatList
        data={students}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>Name: {item.name}</Text>
            <Text>Lastname: {item.lastname}</Text>
            <Text>Grade: {item.grade}</Text>
            <Text>Average: {item.average}</Text>
            <Button
              title="Edit"
              onPress={() => navigateToEditStudent(item.id)}
            />
            <Button
              title="DELETE"
              onPress={() => confirmDelete(item.id)}
              color="red"
            />
          </View>
        )}
      />
      <Button
        title="Insert Student"
        onPress={() =>
          navigation.navigate("StudentForm", { onStudentAdded: loadStudents })
        }
      />
    </View>
  );
};

export default StudentListScreen;
