import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { ChatStateInterface } from "./chat";

export interface BaseChatMsg{
    connectionId : string
}

export default class ChatStore {
    
    public connectionHub ?: HubConnection
    public messageData ?: string[] = ["welcom to the message stuff!"]
    public nick : string 
    public connectionId : string = "wrongConnectionId"


    constructor(){
        this.nick =  window.prompt('Your name:', 'John') as 'string | null'
        this.createHubConnection()    
        
    }

    public getConnectionId = async () => {
        this.connectionId = await this.connectionHub!.invoke('GetConnectionId')
        console.log("connectionId taken", this.connectionId)

            }
      

    public createHubConnection =  () => {
        let connectHub = new HubConnectionBuilder()        
        connectHub =  connectHub.withUrl("http://localhost:5000/hubs/chat", {}).configureLogging(LogLevel.Information)
        console.log("connect hub store", connectHub)
        const temp = connectHub.build()
        temp.start().then().catch(e => console.log("couldnt start connection hub", e))  
       console.log("temp in store", temp)

        this.connectionHub = temp
        console.log("create connection hub", this.connectionHub)

      } 

    public registerToMsg = (messageArray : React.Dispatch<React.SetStateAction<string[]>>) => {
        this.connectionHub!.on('reciveMessage',(User, Message) => {
            const text = `${User}: ${Message}`   
            this.messageData?.push(text)      
            console.log("return message", text)
            messageArray([text])
          })
    }   

    public registerToPrivateMsg = (messageArray : React.Dispatch<React.SetStateAction<string[]>>) => {
        this.connectionHub!.on('recivePrivateMessage',(user, message) => {
            const text = `${user}: ${message}`   
            this.messageData?.push(text)      
            console.log("return private message", text)
            messageArray([text])
          })

    }  
    
    public sendMessage = (msg : ChatStateInterface) => {

            this.connectionHub!.invoke('SendToAll', msg)
              .catch(err => console.error(err));             
          }

    public sendPrivateMessage = async (msg : ChatStateInterface) => {
        await this.getConnectionId()   
        this.connectionHub!.invoke("SendPrivateMsg", msg, this.connectionId).catch(err => console.log(err))    
        console.log("send private message", msg.Message)

    }
}    


    