import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Modal,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import CheckBox from '@react-native-community/checkbox';

type ItemData = {
  key: string;
  date: string;
  shomer: string;
  isDone: boolean;
};

type ItemProps = {
  item: ItemData;
  onPress: () => void;
};

const Item = ({item, onPress}: ItemProps) => (
  <TouchableOpacity
    onPress={onPress}
    style={{paddingHorizontal: 12, flexDirection: 'row'}}>
    <CheckBox value={item.isDone} />
    <Text style={{flex: 1, padding: 2}}>{item.date}</Text>
    <Text style={{flex: 1, padding: 2}}>{item.shomer}</Text>
  </TouchableOpacity>
);

const Admin = ({navigation}: {navigation: any}): JSX.Element => {
  const [email, setEmail] = useState<string>();
  const [phone, setPhone] = useState<string>();
  const isDarkMode = useColorScheme() === 'dark';
  const [selectedId, setSelectedId] = useState<string>();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [DATA, setDATA] = useState();
  const renderItem = ({item}: {item: ItemData}) => {
    return <Item item={item} onPress={() => {} /*setSelectedId(item.id)*/} />;
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  const checkUser = async () => {
    const usr = auth().currentUser;
    if (!usr) {
      setModalVisible(true);
      return false;
    } else if (!usr.email?.includes('moosh')) {
      //not moshe
      navigation.navigate('Shomer');
    } else {
      return true;
    }
  };

  const loadData = async () => {
    const d = new Date();
    let currMonth = d.getMonth();
    let currYear = d.getFullYear();
    let user = await checkUser();
    if (!user) return;
    firestore()
      .collection('shmirot')
      .onSnapshot(querySnapshot => {
        const data: any = [];
        querySnapshot?.forEach((u, i) => {
          let dt = new Date(u.data().dt.toDate());
          if (dt.getMonth() !== currMonth || dt.getFullYear() !== currYear)
            return;
          data.push({
            ...u.data(),
            key: u.id,
          });
        });
        setDATA(data);
      });
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <FlatList
        data={DATA}
        renderItem={renderItem}
        keyExtractor={item => item.key}
        extraData={selectedId}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TextInput
              value={email}
              onChangeText={setEmail}
              style={styles.modalText}
              placeholder="email"
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              style={styles.modalText}
              placeholder="phone"
            />
            <TouchableOpacity
              style={[styles.button, styles.buttonClose]}
              onPress={() => {
                auth().signInWithEmailAndPassword(email || '', phone || '');
                const usr = auth().currentUser;
                if (!usr) return;
                if (!usr.email?.includes('moosh')) {
                  //not moshe
                  navigation.navigate('Shomer');
                }
                setModalVisible(!modalVisible);
                loadData();
              }}>
              <Text style={styles.textStyle}>כניסה</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});

export default Admin;
