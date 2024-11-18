import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AnimalList from './pages/AnimalList';
import AnimalForm from './pages/AnimalForm';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/animal-list" component={AnimalList} />
        <Route exact path="/animal-form" component={AnimalForm} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
