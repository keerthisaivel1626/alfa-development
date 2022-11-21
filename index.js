/**
 * @format
 */

import {AppRegistry,LogBox} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

LogBox.ignoreAllLogs(['deprecated-react-native-prop-types']);
AppRegistry.registerComponent(appName, () => App);


// https://alfa-api.collegify.com

// git push https://nagsandy.nag:nagsandip123456@gitlab.com/nagsandy.nag/alfa.git
