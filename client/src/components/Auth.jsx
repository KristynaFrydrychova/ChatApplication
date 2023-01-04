/* Přihlašovací/registrační stránka */

import React, { useState } from 'react';
import Cookies from 'universal-cookie';
import axios from 'axios';

import signinImage from '../assets/chatBackground.jpg';

const cookies = new Cookies();

//object pro data z formuláře
const initialState = {
    username: '',
    fullName: '',
    avatarURL: '',
    password: '',
    confirmPassword: '',
}

const Auth = () => {
    const [form, setForm] = useState(initialState);
    const [isSignup, setIsSignup] = useState(true);

     //uchování dat z formuláře při každé změně
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    }

    //nereloadnout stránku při stisknutí tlačítka Registrovat se/Přihlásit se
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const { username, password, avatarURL } = form; //získá data z formuláře
        const URL = 'https://chatappdragell.herokuapp.com/auth';

        //získá data ze serveru
        const { data: { token, userId, hashedPassword, fullName } } = await axios.post(`${URL}/${isSignup ? 'signup' : 'login'}`, { 
            username, password, fullName: form.fullName, avatarURL,
        });
        //přidání dat do cookies pro použití v aplikaci
        cookies.set('token', token);
        cookies.set('username', username);
        cookies.set('fullName', fullName);
        cookies.set('userId', userId);

        if(isSignup) {
            cookies.set('avatarURL', avatarURL);
            cookies.set('hashedPassword', hashedPassword);
        }

        window.location.reload(); //reload aplikace, aby v App.jsx byl nastaven authtoken a nezobrazila se opět přihlašovací stránka
    }
    /* Při přepnutí tlačítka se zobrazí formulář pro přihlášení a naopak */
    const switchMode = () => {
        setIsSignup((prevIsSignup) => !prevIsSignup); //negování předchozí hodnoty
    }

    /* Formulář pro registraci (isSignup) a přihlášení (!isSignup) */
    return (
        <div className="auth__form-container">
            <div className="auth__form-container_fields">
                <div className="auth__form-container_fields-content">
                    <p>{isSignup ? 'Registrovat se' : 'Přihlásit se'}</p> 
                    <form onSubmit={handleSubmit}>                   
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="username">Uživatelské jméno</label>
                            <input 
                                name="username" 
                                type="text"
                                placeholder="Uživatelské jméno"
                                onChange={handleChange}
                                required
                            />
                        </div>
                        {isSignup && (
                        <div className="auth__form-container_fields-content_input">
                            <label htmlFor="fullName">Celé jméno</label>
                                <input 
                                    name="fullName" 
                                    type="text"
                                    placeholder="Celé jméno"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="avatarURL">Avatar URL</label>
                                <input 
                                    name="avatarURL" 
                                    type="text"
                                    placeholder="Avatar URL"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="auth__form-container_fields-content_input">
                                <label htmlFor="password">Heslo</label>
                                <input 
                                    name="password" 
                                    type="password"
                                    placeholder="Heslo"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                        {isSignup && (
                            <div className="auth__form-container_fields-content_input">
                                <label htmlFor="confirmPassword">Heslo znovu</label>
                                <input 
                                    name="confirmPassword" 
                                    type="password"
                                    placeholder="Heslo znovu"
                                    onChange={handleChange}
                                    required
                                />
                            </div>
                            )}
                        <div className="auth__form-container_fields-content_button">
                            <button>{isSignup ? "Registrovat se" : "Přihlásit se"}</button>
                        </div>
                    </form>
                    <div className="auth__form-container_fields-account">
                        <p>
                            {isSignup
                             ? "Už máš účet? " 
                             : "Ještě nemáš účet? "
                             }
                             <span onClick={switchMode}>
                             {isSignup ? 'Přihlásit se' : 'Registrovat se'}
                             </span>
                        </p>
                    </div>
                </div>
            </div>
            <div className="auth__form-container_image">
                <img src={signinImage} alt="sign in" />
            </div>
        </div>
    )
}

export default Auth