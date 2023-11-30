import { useState, useRef, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import axios from "axios";

import { HeaderMenu } from "../components/HeaderMenu";


import "../styles/paralax.scss";
import "../styles/Home.scss";
import Swal from 'sweetalert2'

const mimeType = "audio/webm";

function Home() {
    const navigate = useNavigate();
    const mediaRecorder = useRef(null);
    const [permission, setPermission] = useState(false);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [recordingDelay, setRecordingDelay] = useState(false);
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const [msg, setMsg] = useState("");


    useEffect(() => {
        const getMicrophonePermission = async () => {
            if ("MediaRecorder" in window) {
                try {
                    const streamData = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false,
                    });
                    setPermission(true);
                    setStream(streamData);
                } catch (err) {
                    Swal.fire({
                        title: 'Ha ocurrido un error!',
                        text: 'Ocurrio un error, por favor, reinicia los permisos del microfono para poder usar la IA.',
                        icon: 'error',
                        confirmButtonText: 'Cool',
                    });
                }
            } else {

                alert("The MediaRecorder API is not supported in your browser.");
            }
        };

        getMicrophonePermission()
            .catch(console.error)
    }, [])



    const startRecording = async () => {
        setRecordingDelay(false);
        setRecordingStatus("recording");
        const media = new MediaRecorder(stream, { type: mimeType });
        mediaRecorder.current = media;
        mediaRecorder.current.start();
        let localAudioChunks = [];

        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);

        setTimeout(() => {
            setRecordingDelay(true);
        }, 3000);

    };


    const stopRecording = () => {
        setRecordingStatus("inactive");

        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: mimeType });
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudio(audioUrl);

            console.log(audio)
            setAudioChunks([]);
        };
    };

    const handleUploadAudio = () => {
        const fd = new FormData();
        setMsg("Procesando...");

        fd.append('file', audio);


        axios.post('/predict', fd, {
            headers: {
                'Custom-Header': 'multipart/form-data',
            }
        })
            .then(res => {
                setMsg('Prediccion lista!')
                navigate("/result",{state:{msg:res.data.res}})
            })
            .catch(err => {
                setMsg('Ocurrio un error :(')
                console.error(err);
            });
    }

    return (
        <>
            <HeaderMenu />
            <div id="stars"></div>
            <div id="stars2"></div>
            <div id="stars3"></div>
            <main>
                <section className="load-section">
                    <h2>AmbulancIA </h2>
                    <p className="p2">
                        Hola, bienvenido a AmbulancIA, soy una IA que te permite identificar sonidos.
                    </p>
                    {!permission ?
                        <p className="p2">
                            Para comenzar, por favor da permiso al microfono y asi, comenzar a grabar el sonido a tu alrededor.
                        </p>
                        :
                        null
                    }

                    <div className="audio-controls">
                        {permission && recordingStatus === "inactive" ? (
                            <>
                                <button onClick={startRecording} type="button" className="red_button">
                                    <span className="material-symbols-outlined">
                                        mic
                                    </span>
                                </button>
                            </>
                        ) : null}
                        {recordingStatus === "recording" ? (
                            <div className="stop-recording">
                                {
                                    recordingDelay ?
                                        <button onClick={stopRecording} type="button" className='blue_button'>
                                            <span className="material-symbols-outlined">
                                                mic_off
                                            </span>
                                        </button>
                                        :
                                        <button onClick={stopRecording} type="button" className='gray_button inactive' disabled>
                                            <span className="material-symbols-outlined">
                                                mic_off
                                            </span>
                                        </button>
                                }

                                <p className="p1">
                                    La grabacion comenzo! para poder identificar el sonido, necesitamos que tu audio dure al menos 3 segundos... porfavor espera.
                                </p>
                            </div>
                        ) : null}
                    </div>

                    {audio ? (
                        <>
                            <div className="audio-container">
                                <audio src={audio} controls></audio>
                            </div>
                            {msg ?
                                <p className="p1 bold">
                                    {msg}
                                </p>
                                :
                                <p className="p1 bold">
                                    Tenemos tu audio, puedes escucharlo antes de enviarlo a la IA
                                </p>
                            }
                            <button
                                onClick={handleUploadAudio}
                                type="button"
                            >
                                Subir tu audio a la IA y realizar prediccion
                            </button>
                        </>
                    ) : null}
                </section>
            </main>
        </>
    );
}
export { Home };
