import './App.css'
import '@mantine/core/styles.css';
import { MantineProvider } from '@mantine/core';
import { HomeScreen } from './components/HomeScreen';

function App() {
  return (
    <MantineProvider>
      <HomeScreen />
    </MantineProvider>
  )
}

export default App
