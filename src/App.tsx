import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import Landing from './pages/Landing';
import Home from './pages/Home';
import LoginRedirect from './pages/Redirect';
import EndRedirect from './pages/EndRedirect';
import { PrivateRoute } from './routes/PrivateRoute';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/landing" component={Landing} exact />
        <PrivateRoute path="/home" component={Home} exact />
        <Route path="/loginredirect" component={LoginRedirect} exact />
        <Route path="/endredirect" component={EndRedirect} exact />
        <Route exact path="/" render={() => <Redirect to="/landing" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
