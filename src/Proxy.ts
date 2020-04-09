import { OutgoingPacket, InboxDto, IncomingPacket, MessageDto } from './chat'
import { EventProducer } from './EventProducer';

class Proxy extends EventProducer<ProxyEventMap> {
    inbox: InboxDto | null = null;
    private ws: WebSocket;
    constructor() {
        super();
        this.ws = new WebSocket("wss://raja.aut.bme.hu/chat/");

        this.ws.addEventListener("open", () => {
            // this.sendPacket( //TODO delete
            //     {
            //         type: "register",
            //         email: "gabor0414@hotmail.com",
            //         password: "123",
            //         displayName: "gb",
            //         staySignedIn: false
            //     }
            // )
        });

        this.ws.addEventListener("message", e => {
            console.log(e.data) //TODO delete
            let p = <IncomingPacket>JSON.parse(e.data);
            switch (p.type) {
                case "error":
                    alert(p.message);
                    break;
                case "login":
                    this.inbox = p.inbox;
                    this.dispatch("login");
                    break;
                case "message":
                    let cid = p.channelId;
                    this.inbox!.conversations.find(x => x.channelId === cid)?.lastMessages.push(p.message);
                    this.dispatch("message", cid, p.message)
                    break;
                case "conversationAdded":
                    this.inbox!.conversations.push(p.conversation);
                    this.dispatch('conversation', p.conversation.channelId)
                    break;
            }
        });
    }

    sendPacket(packet: OutgoingPacket) {
        this.ws.send(JSON.stringify(packet));
    }
}

interface ProxyEventMap
{
"login": () => void;
"message": ( channelId: string, message: MessageDto ) => void;
"conversation": ( channelId: string ) => void;
}

export var proxy = new Proxy();