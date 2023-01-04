/* Vyhledávací pole */

import React, { useState, useEffect } from 'react';
import { useChatContext } from 'stream-chat-react';
import { ResultsDropdown } from './'
import { SearchIcon } from '../assets/SearchIcon.js';

const ChannelSearch = ({ setToggleContainer }) => {
    const { client, setActiveChannel } = useChatContext();
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [teamChannels, setTeamChannels] = useState([])
    const [directChannels, setDirectChannels] = useState([])

    useEffect(() => {
        if(!query) {
            setTeamChannels([]);
            setDirectChannels([]);
        }
    }, [query])

    const getChannels = async (text) => { //async - čeká se na načtení skupin, přijme se text, který se bude vyhledávat
        try {
            const channelResponse = client.queryChannels({
                type: 'team',
                name: { $autocomplete: text }, 
                members: { $in: [client.userID]}
            });
            const userResponse = client.queryUsers({
                id: { $ne: client.userID },
                name: { $autocomplete: text }
            })

            const [channels, { users }] = await Promise.all([channelResponse, userResponse]);

            if(channels.length) setTeamChannels(channels);
            if(users.length) setDirectChannels(users);
        } catch (error) {
            setQuery('') //při eroru nastaví dotaz opět na práznou hodnotu
        }
    }

    const onSearch = (event) => {
        event.preventDefault(); //neprovádět akci, dokud nebude událost explicitně zpracována
        setLoading(true); 
        setQuery(event.target.value); //nastaví hodnotu dotazu
        getChannels(event.target.value) //získá seznam skupin, parametr je vložený text do vyhledávání text
    }

    const setChannel = (channel) => {
        setQuery('');
        setActiveChannel(channel);
    }

    return (
        <div className="channel-search__container">
            <div className="channel-search__input__wrapper">
                <div className="channel-serach__input__icon">
                    <SearchIcon /* vložení ikonky vyhledávání */ />
                </div>
                <input 
                    className="channel-search__input__text" 
                    placeholder="Hledat" //napovídající text uvnitř komponenty
                    type="text" 
                    value={query} //dotaz
                    onChange={onSearch} //event vyhledávání
                />
            </div>
            { query && (
                <ResultsDropdown 
                    teamChannels={teamChannels}
                    directChannels={directChannels}
                    loading={loading}
                    setChannel={setChannel}
                    setQuery={setQuery}
                    setToggleContainer={setToggleContainer}
                />
            )}
        </div>
    )
}

export default ChannelSearch