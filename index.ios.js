/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var Appointment = require('./Appointment');
import React, {
  AppRegistry,
  Component,
  AlertIOS,
  StyleSheet
} from 'react-native';

class NextAppointment extends Component {
  render() {
    return (

      <React.NavigatorIOS
        style={styles.container}
        barTintColor='#6bb53b'
        tintColor='#ffffff'
        titleTextColor='#ffffff'
        initialRoute={{
          component: Appointment,
          title: 'Dashboard',
          rightButtonIcon: require('./resource/icon_search.png'),
          onRightButtonPress: () => {
            AlertIOS.alert(
              'Search Button Action',
              'Recognized a tap on the bar button icon',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('Tapped Search Button'),
                },
              ]
            ); 
          },
          leftButtonIcon: require('./resource/icon_menu.png'),
          onLeftButtonPress: () => {
            AlertIOS.alert(
              'Menu Button Action',
              'Recognized a tap on the bar button icon',
              [
                {
                  text: 'OK',
                  onPress: () => console.log('Tapped Menu button'),
                },
              ]
            );  
          }          
        }}/>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});

AppRegistry.registerComponent('NextAppointment', () => NextAppointment);
