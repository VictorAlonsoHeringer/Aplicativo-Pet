import React from 'react';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import AnimalList from './pages/AnimalList';
import AnimalForm from './pages/AnimalForm';
import ListaVacinas from './pages/ListaVacinas';
import FormVacinas from './pages/FormVacinas';
import AgendarVacina from './pages/AgendarVacina'; 
import AgendarVacinaForm from './pages/AgendarVacinaForm'; 
import SolicitacoesAgendamentos from './pages/SolicitacoesAgendamentos';
import Agendamentos from './pages/Agendamentos';
import HistoricoVacinas from './pages/HistoricoVacinas';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="/" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/animal-list" component={AnimalList} />
        <Route exact path="/animal-form" component={AnimalForm} />
        <Route exact path="/animal-form/:animalId" component={AnimalForm} />
        <Route exact path="/vacina-list" component={ListaVacinas} />
        <Route exact path="/agendar-vacina" component={AgendarVacina} />
        <Route exact path="/agendar/:vacinaId" component={AgendarVacinaForm} />
        <Route exact path="/vacina/" component={FormVacinas} />
        <Route exact path="/vacina/:vacinaId" component={FormVacinas} />
        <Route exact path="/solicitacoes-agendamentos" component={SolicitacoesAgendamentos} />
        <Route exact path="/historico-vacinas" component={HistoricoVacinas} />
        <Route exact path="/agendamentos" component={Agendamentos} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
