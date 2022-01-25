import * as Font from 'expo-font';
import React, { useEffect, useState } from "react";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView, Alert, } from 'react-native';
import { theme } from './colors';
import { Fontisto, FontAwesome } from "@expo/vector-icons";
// https://react-native-async-storage.github.io/async-storage/docs/usage/
import AsyncStorage from '@react-native-async-storage/async-storage';

const storage_key = "@todos";

export default function App() {

  const [ok, setOk] = useState(false);
  const [edited, setEdited] = useState(false);
  const [done, setDone] = useState(false);
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [editText, setEditText] = useState("")
  // todo를 object화 하면 id만 알아도 삭제를 쉽게 구현 가능
  const [todos, setTodos] = useState({})
  const travel = () => {
    setWorking(false);
  };
  const work = () => setWorking(true);
  const saveTodos = async (toSave) => {
    const string = JSON.stringify(toSave)
    await AsyncStorage.setItem(storage_key,  string)
  }
  const loadTodos = async () => {
    try {
      const string = await AsyncStorage.getItem(storage_key);
      return string != null ? setTodos(JSON.parse(string)) : null;
      } catch (error) {
      console.log(error);
      }
  }

  // ** delete with alert
  // const deleteToDo = (key) => {
  //   Alert.alert("Delete To Do", "Are you sure?", [
  //     { text: "Cancel" },
  //     {
  //       text: "I'm Sure",
  //       style: "destructive",
  //       onPress: () => {
  //         const newToDos = { ...toDos };
  //         delete newToDos[key];
  //         setToDos(newToDos);
  //         saveToDos(newToDos);
  //       },
  //     },
  //   ]);
  // };

  const deleteTodo = async(id) => {
    // 새 Object를 생성해서 그 안에서 key를 가진 데이터를 삭제시켜준다.
    const newTodos = {...todos}
    delete newTodos[id];
    setTodos(newTodos);
    await saveTodos(newTodos);
  }

  const changeTodo = async(key) => {
    const newTodos = {...todos}
    newTodos[key].edited = !newTodos[key].edited
    setEditText(newTodos[key].text)
    if(!newTodos[key].edited){
      newTodos[key].text = editText
    }
    setTodos(newTodos);
    await saveTodos(newTodos);
  }


  // const getTabState = async() => {
  //   const currentTab = await AsyncStorage.getItem('current')
  //   console.log(JSON.parse(currentTab))
  //   setWorking(JSON.parse(currentTab))
  // }

  const doneTodo = async(id) => {
    const newTodos = {...todos};
    newTodos[id].done = !newTodos[id].done
    setTodos(newTodos);
    await saveTodos(newTodos);
  }
  useEffect(async() => {
    loadTodos();
  }, [])
  const onChangeText = (payload) => setText(payload)
  const onEditedText = (payload) => setEditText(payload)
  const addTodo = async () => {
    if(text === ""){
      return
    }
    const newTodos = Object.assign({}, todos, {[Date.now()]: { text, working, done, edited }})
    setTodos(newTodos);
    await saveTodos(newTodos);
    setText("");
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
          todos[key].working === working ? 
          (<View style={{...styles.todo, borderBottomColor:todos[key].edited ? "dodgerblue" : theme.grey}} key={key}>
            {todos[key].edited === true ? (<TextInput value={editText} autoCapitalize={"characters"} onChangeText={onEditedText} style={styles.edit} />):(<Text style={todos[key].done? styles.doneText : styles.todoText}>{todos[key].text}</Text>)}
            <View style={styles.icons}>
              <TouchableOpacity style={styles.done} onPress={() => {doneTodo(key)}}>
              {todos[key].done? (<Fontisto name="checkbox-active" size={18} color="white" />):<Fontisto name="checkbox-passive" size={18} color="grey" />}
              </TouchableOpacity>
              <TouchableOpacity style={styles.change} onPress={() => {changeTodo(key)}}>
                <FontAwesome name="pencil" size={18} color={todos[key].edited ? "white" : "grey"} />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => {deleteTodo(key)}}>
                <Fontisto name="trash" size={18} color="grey" />
              </TouchableOpacity>
            </View>
          </View>) : null
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
    paddingHorizontal: 10,
    borderBottomColor: theme.grey,
    borderBottomWidth: 1,
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between"
  },
  todoText:{
    fontSize:16,
    color:"white",
    flex:1
  },
  icons:{
    flexDirection:"row",
    alignItems:"center",
    justifyContent:"space-between",
    marginLeft:5
  },
  done:{
    marginRight:15,
  },
  change:{
    marginRight:15
  },
  doneText:{
    fontSize:16,
    color:"grey",
    textDecorationLine: 'line-through',
    flex:1
  },
  edit:{
    color:"white",
    fontSize:16,
    flex:1
  }
});
