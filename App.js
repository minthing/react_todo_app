import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, TouchableHighlight } from 'react-native';
import * as Font from 'expo-font';
import { theme } from './colors';

Font.loadAsync({
  anton: require('./assets/fonts/anton.ttf'),
});

export default function App() {
  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <TouchableOpacity><Text style={styles.btnText}>Work</Text></TouchableOpacity>
        <TouchableHighlight underlayColor="red" onPress={() => console.log("pressed")}><Text style={styles.btnText}>Go</Text></TouchableHighlight>
      </View>
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
  }
});
