import React, { useEffect, useState } from 'react'
import { HeaderMenu } from '../components/HeaderMenu'
import { useLocation, useNavigate } from 'react-router-dom';


function Result() {

    const location = useLocation();
    const navigate = useNavigate();

    const [result, setResult] = useState(null);

    useEffect(() => {
        setResult(location.state.msg);

    }, [])

    const handleNavigate = () => {
        navigate('/');
    }

    return (
        <>
            <HeaderMenu />
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>

            <main>
                <section className='generate-section'>
                    <p className='p2 bold'>El resultado de la prediccion es: </p>
                    {result ?
                        <h3>
                            {result}
                        </h3>
                        :
                        null
                    }
                    <button
                        onClick={handleNavigate}
                        type="button"
                    >
                        volver a la pagina principal
                    </button>
                </section>
            </main>
        </>
    );
}

export { Result }