import React, {useEffect, useState} from 'react';
import {StyleSheet, Text, View, Image, ActivityIndicator} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import {SafeAreaView} from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import {TouchableOpacity} from 'react-native-gesture-handler';
function Shomer() {
  const [user, setUser] = useState<string>();
  const [shmira, setShmira] = useState<any>();
  const [loadError, setLoadError] = useState<string>();
  const [loading, setLoading] = useState<boolean>(false);
  const getUserShmira = async () => {
    // fetching the shmira by userName
    await firestore()
      .collection('shmirot')
      .where('shomer', '==', user)
      .onSnapshot(querySnapshot => {
        if (!querySnapshot.docs.length) {
          setLoading(false);
          return;
        }
        querySnapshot?.forEach((dt, i) => {// not sure if it is correct to find single document this way
          setShmira({id: dt.id, ...dt.data()});
          setLoading(false);
        });
      }, (err) => {
        setLoading(false);
      });
  };
  const getUserFullname = async () => {
    // fetching fullName of user
    const email = auth().currentUser?.email;
    await firestore()
      .collection('shomrim')
      .where('email', '==', email)
      .onSnapshot(querySnapshot => {
        querySnapshot?.forEach((usr, i) => {
          setUser(usr.data().fullName);
        });
      }, (err) => {
        setLoading(false);
      });
  };
  useEffect(() => {
    user && getUserShmira();
  }, [user]);
  useEffect(() => {
    setLoading(true);
    // to fetch shmira we need:
    // 1. get users fullname by email from 'shomrim'
    // 2. get shmira by fullname from 'shmira'
    getUserFullname(); 
  }, []);

  // CASES WHEN BUTTON SHOULD DISABLE:
  // 1.if shmira already done
  // 2.if shmira time is not come yet
  // 3.if shmira time passed 10 hours ago
  const isDisabled =
    shmira?.isDone ||
    new Date() < shmira?.dt.toDate() ||
    new Date() >
      shmira?.dt.toDate().setHours(shmira?.dt.toDate().getHours() + 10);

  if (!shmira && !loading)
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <View>
          <Text style={{textAlign: 'center'}}>נראה שאין לך שמירות החודש</Text>
        </View>
      </SafeAreaView>
    );

  if (loading)
    return (
      <SafeAreaView style={styles.backgroundStyle}>
        <ActivityIndicator size="large" color="#00ff00" />
      </SafeAreaView>
    );
  return (
    <SafeAreaView style={styles.backgroundStyle}>
      <View>
        <Text>
          הי <Text style={styles.userText}>{user}</Text>
        </Text>
      </View>
      <View>
        <Text>
          {shmira?.isDone ? 'היתה לך שמירה ב ' : 'יש לך שמירה ב '}
          <Text style={styles.userText}>{shmira?.date}</Text>
        </Text>
      </View>
      <View style={{marginVertical: 10}} />
      <TouchableOpacity
        disabled={isDisabled}
        style={[
          styles.button,
          isDisabled ? styles.buttonDisabled : styles.buttonOpen,
        ]}
        onPress={async () => {
          await firestore()
            .doc(`shmirot/${shmira.id}`)
            .update({isDone: true})
            .then(() => {
              console.log('welldone!');
            });
        }}>
        <Text style={styles.textStyle}>סיימתי</Text>
      </TouchableOpacity>
      <View style={{marginVertical: 60}} />
      <View style={styles.checkStyle}>
        {new Date() >= shmira?.dt.toDate() && shmira?.isDone && (
          <Image
            style={styles.checkIcon}
            source={require('./assets/checked.png')}
          />
        )}
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
    alignContent: 'center',
    textAlignVertical: 'center',
    textAlign: 'center',
  },
  userText: {
    color: 'blue',
    fontSize: 21,
  },
  checkStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    width: 180,
  },
});
export default Shomer;
