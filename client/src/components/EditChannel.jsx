import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';

import { UserList } from './';
import { CloseCreateChannel } from '../assets/CloseCreateChannel.js';

const ChannelNameInput = ({ channelName = '', setChannelName }) => {
  const handleChange = (event) => {
      event.preventDefault();

      setChannelName(event.target.value);
  }

  return (
      <div className="channel-name-input__wrapper">
          <p>Název</p>
          <input value={channelName} onChange={handleChange} placeholder="název skupiny" />
          <p>Přidat uživatele</p>
      </div>
  )
}

const EditChannel = ({setIsEditing}) => {

  const { channel } = useChatContext();
  const [channelName, setChannelName] = useState(channel?.data?.name);
  const [selectedUsers, setSelectedUsers] = useState([])

  const updateChannel = async (event) => {
    event.preventDefault();

    const nameChanged = channelName !== (channel.data.name || channel.data.id);

    if(nameChanged) {
        await channel.update({ name: channelName }, { text: `Jméno skupiny bylo změněno na ${channelName}`});
    }

    if(selectedUsers.length) {
        await channel.addMembers(selectedUsers);
    }

    setChannelName(null);
    setIsEditing(false);
    setSelectedUsers([]);
  }

  return (
    <div className="edit-channel__container">
        <div className="edit-channel__header">
            <p>Upravit skupinu</p>
            <CloseCreateChannel setIsEditing={setIsEditing} />
        </div>
        <ChannelNameInput channelName={channelName} setChannelName={setChannelName} />
        <UserList setSelectedUsers={setSelectedUsers} />
        <div className="edit-channel__button-wrapper" onClick={updateChannel}>
            <p>Uložit změny</p>
        </div>
    </div>
)
}

export default EditChannel