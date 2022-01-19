import * as Font from 'expo-font';
import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, } from 'react-native';
import { theme } from './colors';


export default function App() {

  const [ok, setOk] = useState(false);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  // todo를 object화 하면 id만 알아도 삭제를 쉽게 구현 가능
  const [todos, setTodos] = useState({})
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload)
  const addTodo = () => {
    if(text === ""){
      return
    }
    const newTodos = Object.assign({}, todos, {[Date.now()]: { text, work:working }})
    setTodos(newTodos)
    setText("")
    console.log(todos)
  }


  useState(async () => {
    await Font.loadAsync({
      "anton": require("./assets/fonts/anton.ttf"),
    });
    setOk(true);
  }, []);
 


  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {ok && (
      <View style={styles.header}>
        <TouchableOpacity onPress={work}><Text style={{...styles.btnText, color:working? "white": theme.grey}}>Work</Text></TouchableOpacity>
        <TouchableOpacity onPress={travel}><Text style={{...styles.btnText, color: working? theme.grey : "white"}}>Go</Text></TouchableOpacity>
      </View>
      )}
        <TextInput value={text} returnKeyType={"done"} onSubmitEditing={addTodo} autoCapitalize={"characters"} onChangeText={onChangeText} placeholder={working? "다 울었니? 이제 할 일을 하자." : "움직이는 게 곧 살아있는 것이다."} style={styles.input} />
        <ScrollView>
        {Object.keys(todos).map((key) => (
          <View style={styles.todo} key={key}>
            <Text style={styles.todoText}>{todos[key].text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.background,
    paddingHorizontal:20,
  },
  header:{
    flexDirection:'row',
    marginTop:100,
    justifyContent:"space-between",
  },
  btnText:{
    fontSize:36,
    color:"white",
    fontFamily: 'anton',
    // color:theme.grey
  },
  input:{
    backgroundColor:"white",
    marginTop:30,
    paddingVertical:15,
    paddingHorizontal:10,
    borderRadius:10,
    fontSize:16
  },
  todo:{
    marginTop: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomColor: theme.grey,
    borderBottomWidth: 1,
  },
  todoText:{
    fontSize:16,
    color:"white"
  }
});
