import { useCallback, useEffect, useRef, useState } from 'react';
import { GiftedChat } from 'react-native-gifted-chat';
import Config from '../lib/Config';
import { v4 as uuid } from 'uuid';
// import { SafeAreaView, Text, StyleSheet, View } from 'react-native';

const Chat = ({ route }) => {
  const { requestUserId, currentUserId } = route.params;

  // const [user2, setUser2] = useState({});
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);

  if (!requestUserId) {
    alert('requestUserId not defined');
  }
  if (!currentUserId) {
    alert('currentUserId not defined');
  }

  // const fetchUser2 = async () => {
  //   try {
  //     const res = await fetch(`${Config.apiUrl}/users/${requestUserId}`, {
  //       method: 'GET',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //     });
  //     const resJson = await res.json();
  //     if (res.status === 200) {
  //       let json_data = resJson.body;
  //       setUser2(json_data);
  //     } else {
  //       alert(res.error);
  //     }
  //   } catch (err) {
  //     alert(err.message);
  //   }
  // };

  const fetchChat = async () => {
    try {
      const res = await fetch(
        `${Config.apiUrl}/chat/${requestUserId}/${currentUserId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      const resJson = await res.json();

      return resJson;
    } catch (err) {
      alert(err.message);
    }
  };

  useEffect(() => {
    // fetchUser2();
    // enter your websocket url
    ws.current = new WebSocket(
      `${Config.webSocketUrl}?userId1=${requestUserId}&userId2=${currentUserId}`
    );
    ws.current.onopen = () => {
      console.log('connection establish open');
    };
    ws.current.onclose = () => {
      console.log('connection establish closed');
      return (ws.current = new WebSocket(
        `${Config.webSocketUrl}?userId1=${requestUserId}&userId2=${currentUserId}`
      ));
    };
    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    ws.current.onmessage = (e) => {
      const response = JSON.parse(e.data);
      if (response.user._id !== currentUserId) {
        setMessages((previousMessages) =>
          GiftedChat.append(previousMessages, response)
        );
      }
    };
  }, []);

  useEffect(() => {
    fetchChat().then((res) => {
      // setChat(res.body)
      try {
        const msgs = JSON.parse(res.body.messages);
        const msgsToSet = msgs
          .map((msg) => {
            return {
              _id: msg.id || uuid(),
              text: msg.text,
              createdAt: msg.timestamp,
              user: {
                _id: msg.userId,
                name: 'msg.userName',
              },
            };
          })
          .sort((a, b) => (b.createdAt < a.createdAt ? -1 : 1));
        setMessages(msgsToSet);
      } catch (error) {
        console.error(error);
      }
    });
  }, []);

  const onSend = useCallback((newMessage = []) => {
    ws.current.send(
      JSON.stringify({
        action: 'sendMessage',
        message: newMessage[0],
        senderId: currentUserId,
        receiverId: requestUserId,
      })
    );

    setMessages((previousMessages) => {
      return GiftedChat.append(previousMessages, newMessage);
    });
  }, []);

  return (
    <GiftedChat
      wrapInSafeArea={true}
      messages={messages}
      onSend={(message) => onSend(message)}
      user={{
        _id: currentUserId,
      }}
      showAvatarForEveryMessage={true}
      renderAvatar={null}
    />
  );
};
export default Chat;
