/* Nadpis "skupiny" nebo "přímé zprávy" */

import React from 'react';

import { AddChannel } from '../assets/AddChannel.js';

const TeamChannelList = ({setToggleContainer, children, error = false, loading, type, isCreating, setIsCreating, setCreateType, setIsEditing}) => { //children (dědičné vlastnosti streamu), type (group chat vs direct message)
    //žádné existující skupiny - vypíše error × žádné existující zprávy - nic nevypíše
    if(error) {
        return type === 'team' ? (
            <div className="team-channel-list">
                <p className="team-channel-list__message">
                    Chyba připojení, chvíli počkejte a zkuste to znovu.
                </p>
            </div>
        ) : null
    }

    //skupiny nebo zprávy se načítají
    if(loading) {
        return (
            <div className="team-channel-list">
                <p className="team-channel-list__message loading">
                    {type === 'team' ? 'Skupiny' : 'Zprávy'} se načítají...
                </p>
            </div>
        )
    }

    //Vrátí nadpis Skupiny nebo Přímé zprávy
    return (
        <div className="team-channel-list">
            <div className="team-channel-list__header">
                <p className="team-channel-list__header__title">
                    {type === 'team' ? 'Skupiny' : 'Přímé zprávy'}
                </p>
                <AddChannel 
                    isCreating={isCreating}
                    setIsCreating={setIsCreating}
                    setCreateType={setCreateType} 
                    setIsEditing={setIsEditing}
                    type={type === 'team' ? 'team' : 'messaging'}
                    setToggleContainer={setToggleContainer}
                />
            </div>
            
            {children /* všechno, co bylo vloženo do TeamChannelList si dědí vlastnosti ze Stream */ } 
        </div>
    )
}

export default TeamChannelList