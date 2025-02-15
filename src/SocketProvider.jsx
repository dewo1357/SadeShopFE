import { createContext,useContext,useEffect,useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// eslint-disable-next-line react/prop-types
export const SocketProvider = ({children})=>{
    const [socket,setSocket] = useState(null)

    useEffect(()=>{
        const Mysocket = io("http://localhost:5000");
      
        setSocket(Mysocket);

        return ()=>{
            Mysocket.disconnect();
        }
    },[])

    return(
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
}

// eslint-disable-next-line react-refresh/only-export-components
export const useSocket = ()=>useContext(SocketContext)