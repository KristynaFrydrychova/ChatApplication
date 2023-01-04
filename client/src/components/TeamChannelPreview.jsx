/* Seznam skupin a uživatelů pro přímé zprávy */

import React from 'react';
import { Avatar, useChatContext } from 'stream-chat-react';

const TeamChannelPreview = ({ setActiveChannel, setIsCreating, setIsEditing, setToggleContainer, channel, type }) => {
    const { channel: activeChannel, client } = useChatContext(); //aktivní skupina a client se získká ze Stream API
    // zobrazí v seznamu skupin název skupiny
    const ChannelPreview = () => (
        <p className="channel-preview__item">
            {channel?.data?.name || channel?.data?.id /* ? pro jistotu, že existuje skupina před získáním dalších parametrů */} 
        </p>
    );

    // zobrazí v seznamu přímých zpráv uživatele s jejich avatarem
    const DirectPreview = () => {
        //pole s různými objekty (id + user data) - je potřeba získat konkrétní objekt a v něm hodnotu user, zobrazovaný user nesmí být client
        const members = Object.values(channel.state.members).filter(({ user }) => user.id !== client.userID);

        return (
            <div className="channel-preview__item single">
                <Avatar 
                    image={members[0]?.user?.image}
                    name={members[0]?.user?.fullName || members[0]?.user?.id}
                    size={24}
                />
                <p>{members[0]?.user?.fullName || members[0]?.user?.id}</p>
            </div>
        )
    }

    return (
        //odlišný vzhled, pokud je skupina nebo přímá zpráva rozkliknuta nebo ne
        <div className={
            channel?.id === activeChannel?.id
                ? 'channel-preview__wrapper__selected'
                : 'channel-preview__wrapper'
        }
        //na klik se zvolí aktuální skupina nebo přímé zprávy
        onClick={() => {
            setIsCreating(false);
            setIsEditing(false);
            setActiveChannel(channel);
            if(setToggleContainer) {
                setToggleContainer((prevState) => !prevState)
            }
            
        }}
        >
            {type === 'team' ? <ChannelPreview /> : <DirectPreview />}
        </div>
    );
}

export default TeamChannelPreview