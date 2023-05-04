import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
function Shomer() {
  const [user, setUser] = useState<string>();
  const [shmira, setShmira] = useState<any>();
  const getUserShmira = async () => {// fetching the shmira by userName
    await firestore()
      .collection('shmirot')
      .where('shomer', '==', user)
      .onSnapshot(querySnapshot => {
        querySnapshot?.forEach((dt, i) => {
          setShmira({id: dt.id, ...dt.data()}); 
        });
      });
  }
  const getUserFullname = async () => {// fetching full name of user
    const email = auth().currentUser?.email;
    await firestore()
      .collection('shomrim')
      .where('email', '==', email)
      .onSnapshot(querySnapshot => {
        querySnapshot?.forEach((usr, i) => {
          setUser(usr.data().fullName);
        });
      });
  };
  useEffect(() => {
    user && getUserShmira();
  }, [user]);
  useEffect(() => {
    getUserFullname();
  }, []);
  const isDisabled = shmira?.isDone || (new Date()) < shmira?.dt.toDate();
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View><Text>הי {user}</Text></View>
      <View><Text>יש לך שמירה ב {shmira?.date}</Text></View>
      <TouchableOpacity
        disabled={isDisabled}
        style={[styles.button, isDisabled ? styles.buttonDisabled : styles.buttonOpen]}
        onPress={async () => {
           await firestore().doc(`shmirot/${shmira.id}`).update({isDone: true})
          .then(() => {
            console.log('welldone!');
          });
        }}>
        <Text style={styles.textStyle}>סיימתי</Text>
       
      </TouchableOpacity>
      <View>
         {(new Date()) >= shmira?.dt.toDate() && shmira?.isDone && <Image source={require('./assets/checked.png')}/>}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundStyle: {
    padding: 10,
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
  },
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    flexDirection: 'row',
    alignContent: 'center'
  },
});
export default Shomer;
