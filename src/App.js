import React from 'react';
import './App.css';
import Main from './components/Main/Main';
import {TeamProvider} from './context/Team/context';
import {AlertProvider} from './context/Alert/context';
import {AlertRelativeProvider} from './context/AlertRelative/context';

function App({}) {
  return (
    <TeamProvider>
      <AlertProvider>
        <AlertRelativeProvider>
          <div className="App">
            <Main/>
          </div>
        </AlertRelativeProvider>
      </AlertProvider>
    </TeamProvider>
  );
}

export default App;
