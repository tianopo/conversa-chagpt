import React, { useState, useEffect } from 'react';


async function getResponse(prompt) {
    const engineId = 'text-davinci-003';
    const apiKey = ''; //Catch your api key in chatGPT
    
    const response = await fetch(`https://api.openai.com/v1/engines/${engineId}/completions`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
        prompt,
        max_tokens: 10,
        temperature: 0.7,
        }),
    });
    
    const data = await response.json();
    return data.choices[0].text;
}
    
function Chatbot() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  //Geração de texto através da fala
  const SpeechRecognition = typeof window !== 'undefined' && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;
  

  const startRecognition = () => {
    recognition.start();
  };

  const handle = async () => {
    const response = await getResponse(input);

    setOutput(response);
    speech(response);
  }

  useEffect(() => {
    if (recognition) {
      recognition.interimResults = true;
      recognition.lang = 'pt-BR';

      recognition.onresult = event => {
        const transcript = Array.from(event.results)
          .map(result => result[0])
          .map(result => result.transcript)
          .join('');

        setInput(transcript);
      };
    }
  }, [recognition, setInput]);

  //sintese da saída de voz
  const speech = async (e) =>{
    if ('speechSynthesis' in window) {
      const mensagem = new SpeechSynthesisUtterance();
      const voices = window.speechSynthesis.getVoices();

      mensagem.text = e;
      mensagem.voice = voices[1]; //voz
      mensagem.rate = 1 // aumenta a velcodaide
      mensagem.volume = 1; // reduz o volume da fala
      mensagem.pitch = 1.5; // aumenta o tom da fala

      window.speechSynthesis.speak(mensagem);

    } else {
      console.log("API Web Speech não suportada");
    }
  }

  return (
      <div>
        <button onClick={startRecognition}>Iniciar</button>
        <h3>{input}</h3>
        <button onClick={handle}>Read</button>
        <pre>{output}</pre>
        <button type='submit'>Atualizar</button>
      </div>
  );
}

function Home(){
      return(
        <div>
            <Chatbot />
        </div>
        
      )
}

export default Home;
