import React, { useEffect, useState } from 'react'
import ChatStore from './chatStore';

export interface ChatStateInterface{
    User : string
    Message : string
}

const Chat : React.FC<{store: ChatStore}> = (props) => {

    console.log("store store", props.store)

    const [msgArchive, setMsgArchive] = useState<string[]>(["welcome to chat!"])
    const [data, setData] = useState<ChatStateInterface>({
        User: '',
        Message: ''
      })
      useEffect(() => {     
        props.store.createHubConnection()
        props.store.registerToMsg(setMsgArchive)
        props.store.registerToPrivateMsg(setMsgArchive)
        
      }, [props.store.messageData, props.store])


      console.log("data data", data)
      
    return (
    <div>
        <br />
        <input
        type="text"
        value={data.Message}
        onChange={e => setData({User: props.store.nick, Message: e.target.value })}
        />

        <button onClick={
            e => props.store.sendMessage(data)          
            }>Send</button>
            <button onClick={
            e => props.store.sendPrivateMessage(data)          
            }>Send Private</button>

        <div>
            {msgArchive}
        </div>

    
    </div>
  );
}
    


export default Chat