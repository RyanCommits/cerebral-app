import React, {useState, useRef, useEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Image,
  TextInput,
  KeyboardAvoidingView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {ChatEngine, CHAT_DATA_URL} from './chat';

const BOT_NAME = 'Marlanne Singer';
const SENDER_MAP = {
  0: 'You',
  1: BOT_NAME,
};

const App = () => {
  const [value, setValue] = useState('');
  const [messages, setMessages] = useState([]);
  const [editable, setEditable] = useState(false);

  const chatInstance = useRef();
  const scrollRef = useRef();

  const sendMessage = () => {
    if (value.trim() === '') {
      return setValue('');
    }

    const response = chatInstance.current.check(value.trim().toLowerCase());

    const messageArr = messages;

    messageArr.push({sender: 0, value});
    messageArr.push({sender: 1, value: response});

    setMessages(messageArr);
    setValue('');
  };

  useEffect(() => {
    fetch(CHAT_DATA_URL)
      .then((response) => response.json())
      .then((data) => {
        chatInstance.current = new ChatEngine(data);
        chatInstance.current.initialize();
        const messageArr = messages;
        messageArr.push({
          sender: 1,
          value: chatInstance.current.currentQuestion.question,
        });
        setMessages(messageArr);
        setEditable(true);
      });
  }, []);

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.chatHeader}>
            <Image
              style={styles.chatProfileImage}
              source={{
                uri: 'https://reactnative.dev/img/tiny_logo.png',
              }}
            />
            <Text style={styles.chatProfileName}>{BOT_NAME}</Text>
          </View>
          <ScrollView
            ref={scrollRef}
            style={styles.messagesContainer}
            contentContainerStyle={styles.messsagesContentContainer}
            onContentSizeChange={() => {
              scrollRef.current.scrollToEnd({animated: true});
            }}>
            {messages.map((message, i) => {
              return (
                <View key={i} style={styles.messageContainer}>
                  <Text
                    style={[
                      styles.senderName,
                      message.sender === 0 && styles.senderSelf,
                    ]}>
                    {SENDER_MAP[message.sender]}:
                  </Text>
                  <Text>{message.value}</Text>
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.chatFooter}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => setValue(text)}
              value={value}
              placeholder="Type here..."
              multiline
              editable={editable}
            />
            <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
              <Text style={styles.buttonText}>Send</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebf4f6',
  },
  chatHeader: {
    backgroundColor: '#ebf4f6',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 18,
  },
  chatProfileImage: {
    width: 50,
    height: 50,
    borderRadius: 300,
    marginRight: 10,
  },
  chatProfileName: {
    fontSize: 18,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  messsagesContentContainer: {
    padding: 30,
  },
  messageContainer: {
    marginVertical: 8,
  },
  senderName: {
    fontSize: 16,
    fontWeight: '600',
  },
  senderSelf: {
    color: '#5093fe',
  },
  chatFooter: {
    backgroundColor: '#ebf4f6',
    padding: 25,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    textAlignVertical: 'top',
    backgroundColor: 'white',
    borderRadius: 3,
    height: 80,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 5,
    flex: 1,
  },
  sendButton: {
    marginLeft: 10,
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
    height: 80,
    width: 110,
    backgroundColor: '#5093fe',
  },
  buttonText: {
    fontSize: 18,
    color: 'white',
  },
});

export default App;
