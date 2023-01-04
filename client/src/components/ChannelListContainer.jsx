/* Postranní panel s možností odhlášení a přehledem skupin a uživatelů pro přímé zprávy */

import React, { useState } from 'react';
import { ChannelList, useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';

import { ChannelSearch, TeamChannelList, TeamChannelPreview } from './'; //componenty pro vyhledávání, seznam kanálů a přímých zpráv
import ChatIcon from '../assets/chatpicture.png'
import LogoutIcon from '../assets/logout.png'

const cookies = new Cookies();

/* Postranní panel - import ikonek chatu a logout */
const SideBar = ({ logout }) => (
    <div className="channel-list__sidebar">
        <div className="channel-list__sidebar__icon1">
            <div className="icon1__inner">
                <img src={ChatIcon} alt="ChatPicture" width="30" />
            </div>
        </div>
        <div className="channel-list__sidebar__icon2">
            <div className="icon1__inner" onClick={logout}>
                <img src={LogoutIcon} alt="Logout" width="30" />
            </div>
        </div>
    </div>
);


/* Záhlaví postranního panelu s nadpisem */
const CompanyHeader = () => (
    <div className="channel-list__header">
        <p className="channel-list__header__text">Chatování s přáteli</p>
    </div>
)

const customChannelTeamFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'team');
}

const customChannelMessagingFilter = (channels) => {
    return channels.filter((channel) => channel.type === 'messaging');
}


const ChannelListContent = ({ isCreating, setIsCreating, setCreateType, setIsEditing, setToggleContainer }) => {
    const { client } = useChatContext();

    //při logout se odstraní cookies a znovu se našte stránka - objeví se přihlašovací stránka
    const logout = () => {
        cookies.remove("token");
        cookies.remove('userId');
        cookies.remove('username');
        cookies.remove('fullName');
        cookies.remove('avatarURL');
        cookies.remove('hashedPassword');

        window.location.reload();
    }
    const filters = { members: { $in: [client.userID] } };

    return (
    <>
        <SideBar logout={logout} /* postranní panel s logout ikonkou  a tlačítkem odhlášení*//> 
        <div className="channel-list__list__wrapper"> 
            <CompanyHeader /* záhlaví s nadpisem *//>
            <ChannelSearch setToggleContainer={setToggleContainer} /* Vyhledávací pole *//>
            <ChannelList /* Seznam skupin */
                filters={filters} //objekt, který povoluje filtrovat mezi zprávami
                channelRenderFilterFn={customChannelTeamFilter} //přidání skupin do filtru
                List={(listProps) => ( //rendorování vlastního vytvořeného listu s názevm "skupiny"
                    <TeamChannelList //vložení komponenty pro skupinové zprávy - nadpis
                        {...listProps} //vložení vlastních komponent získá stejné vlastnosti, které nabízí stream ChannelList
                        type="team" //pro skupinový chat
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType} 
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
                Preview={(previewProps) => (
                    <TeamChannelPreview //vložení komponenty pro skupinové zprávy - seznam skupin
                        {...previewProps}
                        setIsCreating={setIsCreating}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                        type="team"
                    />
                )}
            />
            <ChannelList /* Seznam zpráv */
                filters={filters}
                channelRenderFilterFn={customChannelMessagingFilter}
                List={(listProps) => (
                    <TeamChannelList 
                        {...listProps}
                        type="messaging"
                        isCreating={isCreating}
                        setIsCreating={setIsCreating}
                        setCreateType={setCreateType} 
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                    />
                )}
                Preview={(previewProps) => (
                    <TeamChannelPreview 
                        {...previewProps}
                        setIsCreating={setIsCreating}
                        setIsEditing={setIsEditing}
                        setToggleContainer={setToggleContainer}
                        type="messaging"
                    />
                )}
            />          
        </div>
    </>
    );
}

const ChannelListContainer = ({ setCreateType, setIsCreating, setIsEditing }) => {
    const [toggleContainer, setToggleContainer] = useState(false);

    return (
        <>
            <div className="channel-list__container">
              <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing} 
              />
            </div>

            <div className="channel-list__container-responsive"
                style={{ left: toggleContainer ? "0%" : "-89%", backgroundColor: "#005fff"}}
            >
                <div className="channel-list__container-toggle" onClick={() => setToggleContainer((prevToggleContainer) => !prevToggleContainer)}>
                </div>
                <ChannelListContent 
                setIsCreating={setIsCreating} 
                setCreateType={setCreateType} 
                setIsEditing={setIsEditing}
                setToggleContainer={setToggleContainer}
              />
            </div>
        </>
    )

}

export default ChannelListContainer;