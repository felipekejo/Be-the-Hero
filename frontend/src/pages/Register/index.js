import React, { useState, useEffect } from 'react';

import axios from 'axios';

import { Map, TileLayer, Marker} from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet'
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import './style.css';
import Logoimg from '../../assests/logo.svg'

import api from '../../services/api'

const Register = () => {

    const [selectedUF, setSelectedUF] = useState('0')
    const [selectedCity, setSelectedCity] = useState('0')

    const [selectedPosition, setSelectedPosition] = useState([0, 0])

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    
    const history = useHistory();

    const [ufs, setUfs] = useState([])
    const [cities, setCities] = useState([])

    async function handleRegister(e) {
        e.preventDefault();

        const uf = selectedUF
        const city = selectedCity

        const data = {
            name,
            email,
            whatsapp,
            city,
            uf,
        };
        try {
            const response = await api.post('/ongs', data);

            alert(`Seu ID de acesso: ${response.data.id} `);

            history.push('/');
        } catch (err) {
            alert('Erro no cadastro, tente novamente.');
        }


    }

    useEffect(() => {
        axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
            .then(response => {
                const ufInitials = response.data.map(uf => uf.sigla).sort();

                setUfs(ufInitials)
            })
    }, []);

    useEffect(() => {
        if (selectedUF === '0') {
            return;
        }
        axios
            .get(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
            .then(response => {
                const cityNames = response.data.map(city => city.nome).sort();

                setCities(cityNames);
            });
    }, [selectedUF]);

    function handleSelectUf(event) {
        const uf = event.target.value
        setSelectedUF(uf);
    };

    function handleSelectCity(event) {
        const city = event.target.value

        console.log(event.target)
        setSelectedCity(city);
    }
    return (
        <div className="register-container">
            <div className="content">
                <section>
                    <img src={Logoimg} alt="Be The Hero" />

                    <h1>Cadastro</h1>
                    <p>
                        Faça seu cadastro, entre na plataforma e ajude pessoas a
                        encontrarem os casos da sua ONG.
                        </p>
                    <Link className="back-link" to="/">
                        <FiArrowLeft size={16} color="#e02041" />
                        Não tenho cadastro

                        </Link>
                </section>

                <form onSubmit={handleRegister}>

                    <input
                        placeholder="Nome da ONG"
                        value={name}
                        onChange={e => setName(e.target.value)}
                    />
                    <input
                        type="email" placeholder="E-mail"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                    />
                    <input
                        placeholder="Whatsapp"
                        value={whatsapp}
                        onChange={e => setWhatsapp(e.target.value)}
                    />

                    <div className="select-group">
                        
                            <select name="uf" id="uf" value={selectedUF} onChange={handleSelectUf}>
                                <option value="0">Selecione uma UF</option>
                                {ufs.map(uf => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        
                        
                            <select name="city" id="city" value={selectedCity} onChange={handleSelectCity}>
                                <option value="0">Selecione uma Cidade</option>
                                {cities.map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        
                    </div>
                    <button className="button" type="submit">Cadastrar</button>

                </form>

            </div>

        </div>
    );
}

export default Register;