import { useCallback, useEffect, useState } from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import Config from '../lib/Config'
import { v4 as uuid } from 'uuid'
import { KeyboardAvoidingView } from 'react-native'
import { Manager } from 'socket.io-client'

const Chat = ({ route }) => {
  const socketManager = new Manager(Config.webSocketUrl)
  const socket = socketManager.socket('/')

  const { id, userId1, userId2, msgs } = route.params

  const [chatId, setChatId] = useState('')
  const [messages, setMessages] = useState([])
  const [user1, setUser1] = useState('')
  const [user2, setUser2] = useState('')

  const fetchUser2 = async () => {
    try {
      const res = await fetch(`${Config.apiUrl}/users/${userId2}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resJson = await res.json()
      if (res.status === 200) {
        let json_data = resJson.body
        setUser2(json_data)
      } else {
        alert(res.error)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  const fetchChat = async () => {
    try {
      const res = await fetch(`${Config.apiUrl}/chats/${id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const resJson = await res.json()
      if (res.status === 200) {
        let json_data = resJson.body
        setChatId(json_data.id)
        setMessages(json_data.messages)
      } else {
        alert(res.error)
      }
    } catch (err) {
      alert(err.message)
    }
  }

  useEffect(() => {
    socketManager.connect((err) => {
      if (err) {
        console.error(err)
      } else {
        console.log('connection successful')
      }
    })
    setChatId(id)
    setMessages(
      JSON.parse(msgs)?.map((msg, index) => {
        console.log(index)
        return {
          _id: uuid(),
          text: msg.text,
          createdAt: msg.timestamp,
          user: {
            _id: msg.userId,
            name: 'msg.userName',
          },
        }
      })
    )
    setUser1(userId1)
    setUser2(userId2)
  }, [])

  const onSend = useCallback((messages = []) => {
    socket.emit('sendMessage', { message: 'hello, everyone!' })

    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    )
  }, [])

  return (
    <>
      <GiftedChat
        messages={messages}
        onSend={(message) => onSend(message)}
        user={{
          _id: user1,
          name: 'Richard',
        }}
      />
      {<KeyboardAvoidingView behavior="padding" />}
    </>
  )
}
export default Chat
