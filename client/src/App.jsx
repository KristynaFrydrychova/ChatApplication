/* Jádro aplikace */

import React, { useState } from 'react';
import { StreamChat } from 'stream-chat';
import { Chat } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelListContainer, ChannelContainer, Auth} from './components'; //import komponent
import 'stream-chat-react/dist/css/index.css';
import './App.css'; //import designu

const cookies = new Cookies();
const apiKey = 'sap64t5vf5sb'; //stream API
const authToken = cookies.get("token"); //nastavení tokenu po té, co proběhlo přihlášení
const client = StreamChat.getInstance(apiKey); //client

if(authToken) {
  client.connectUser({
      id: cookies.get('userId'),
      name: cookies.get('username'),
      fullName: cookies.get('fullName'),
      image: cookies.get('avatarURL'),
      hashedPassword: cookies.get('hashedPassword'),
  }, authToken)
}

const App = () => {
  const [createType, setCreateType] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

   /* pokud není přiřazen žádný autentizační token, zobrazí se přihlašovací stránka */
  if(!authToken) return <Auth />

  return (
    <div className="app__wrapper">
        <Chat client={client} theme="team light">
            <ChannelListContainer //komponenta pro postranní panel
               isCreating={isCreating}
               setIsCreating={setIsCreating}
               setCreateType={setCreateType}
               setIsEditing={setIsEditing}
            />
            <ChannelContainer //Komponenta pro chat
              isCreating={isCreating}
              setIsCreating={setIsCreating}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              createType={createType}
            />
        </Chat>        
    </div>
  );
}

export default App;