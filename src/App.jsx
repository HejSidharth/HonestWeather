import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChakraProvider, Input, Button, Spinner, Box, Heading, Text, Center, Textarea, Code, InputGroup, InputRightElement, Icon, Kbd } from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import ReactMarkdown from 'react-markdown';


function App() {



  const [generatedText, setGeneratedText] = useState('Hello User!');
  const [isLoading, setIsLoading] = useState(false);

  const generateText = () => {
    const apiKey = ''; // Replace with your actual API key
    const apiUrl = 'https://api.openai.com/v1/chat/completions';
  
    // Request data
    const requestData = {
      model: 'gpt-4-1106-preview',
      messages: [
        {
          role: 'system',
          content: 'You are a weather expert. Your job is to provide weather information and clothing recommendations based on the weather. Return your response in markdown format for the user to read. ONLY GIVE INDENTED' 
        },
        {
          role: 'user',
          content: 'What should I wear today?'
        },
        {
          role: 'assistant',
          content: `The current temperature is ${weather.main.temp} degrees F. It feels like it's ${weather.main.feels_like} degrees F, and the humidity is at ${weather.main.humidity}%.`
        }
      ],
      temperature: 0.7,
      max_tokens: 124,
    };
    setIsLoading(true); // Set loading state to true
  
    axios
      .post(apiUrl, requestData, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      })
      .then((response) => {
        setIsLoading(false); // Set loading state to false
        setGeneratedText(response.data.choices[0].message.content); // Set the generated text
      })
      .catch((error) => {
        setIsLoading(false); // Set loading state to false
        console.error(error);
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const userMessage = event.target.elements.userMessage.value;
    generateText(userMessage);
  };

  
  const [weather, setWeather] = useState(null);
  const API_KEY = 'a6612a43b3ca221747054cc71eade9bb'; // replace with your OpenWeather API key

  const getWeather = async () => {
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      console.log(latitude, longitude)
      try {
        const response = await axios.get(`http://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=imperial`);
        setWeather(response.data);
      } catch (error) {
        console.error(error);
      }
    }, (error) => {
      console.error(error);
    });
  };

  // Call getWeather function when the component mounts
  useEffect(() => {
    getWeather();
  }, []);

  return (
    <ChakraProvider>
      <Box backgroundColor="rgb(31, 31, 29)" height="100vh" width="100vw" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap={6}>
      
      <Heading color={"white"}> The temperature is {weather && weather.main.temp}&deg;F  </Heading>      
      <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px'}}>        
        <InputGroup>
        <Input autosize overflow="hidden" width="600px" height="40px" type="text" name="userMessage" color="white" resize="none" border="1px solid rgb(51,51,51)" placeholder="Enter your message here" style={{ padding: '3', lineHeight: '1', '::placeholder': { paddingLeft: '10px' } }} />        
        <Button  backgroundColor = "transparent" bottom = "0" type="submit"><SearchIcon color={"rgb(51,51,51)"} /></Button>
        </InputGroup>
      
      </form>
      
      <Box width="600px" display="flex" alignItems="center" justifyContent="center" color="white" className='vertical-rl' flexDirection={"column"}>
  {isLoading ? <Spinner color="white"/> : <ReactMarkdown>{generatedText}</ReactMarkdown>}
</Box>
      
      </Box>
      
    </ChakraProvider>
  );
}

export default App;

