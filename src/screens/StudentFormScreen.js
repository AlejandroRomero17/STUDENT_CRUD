import React, { useState } from "react";
import { View, Text, TextInput, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import StudentModel from "../models/StudentModel";

const StudentFormScreen = ({ navigation, route }) => {
  const { onStudentAdded } = route.params || {};
  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [grade, setGrade] = useState("");
  const [average, setAverage] = useState("");

  const handleSave = async () => {
    try {
      const student = new StudentModel(
        Date.now(),
        name,
        lastname,
        grade,
        average
      );

      const existingStudents = await AsyncStorage.getItem("students");
      const studentsArray = existingStudents
        ? JSON.parse(existingStudents)
        : [];
      studentsArray.push(student);

      await AsyncStorage.setItem("students", JSON.stringify(studentsArray));

      if (onStudentAdded) {
        onStudentAdded();
      }

      navigation.goBack();
    } catch (error) {
      console.error("Error saving student", error);
    }
  };

  return (
    <View>
      <Text>Student Form</Text>
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={(text) => setName(text)}
      />
      <TextInput
        placeholder="Lastname"
        value={lastname}
        onChangeText={(text) => setLastname(text)}
      />
      <TextInput
        placeholder="Grade"
        value={grade}
        onChangeText={(text) => setGrade(text)}
      />
      <TextInput
        placeholder="Average"
        value={average}
        onChangeText={(text) => setAverage(text)}
      />
      <Button title="Save" onPress={handleSave} />
    </View>
  );
};

export default StudentFormScreen;
