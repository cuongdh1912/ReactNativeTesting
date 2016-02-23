'use strict';

var React = require('react-native');
var TimerMixin = require('react-timer-mixin');

var {
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  ScrollView,
  Image,
  AlertIOS,
  Component
} = React;

// init for timer
var Component = React.createClass({
  mixins:[TimerMixin],
  componentDidMount:function(){
    
  },
  render() {
    return (<View> </View>);
  }
});

var nextAppointmentAPI = 'http://private-13da2-nextappointment.apiary-mock.com/questions'; // next appointment api
var appointmentDate=null; // date got from querying api

class Appointment extends Component{
  // initial method: create default values
  constructor(props) {
    super(props);
    // variables which bring appointment information
    this.state = {
      appointmentTitle: '',
      appointmentAddress: '',
      appointmentTime:'          ',
      appointmentAMPM:'',
      appointmentDayOfWeek:'',
      appointmentMonthDay:'',
      appointmentYear:'',
      appointmentTimeCountdown:''
    };
    this.queryNextAppointment();
    this.checkCountdown();
  }

  // generate ui
  render() {
    return (
      <ScrollView style={styles.container}>
          <View style={styles.viewAppointment}>
            <Text style={styles.mainTitle}>
              Your next appointment
            </Text>
            <View style={styles.viewRow}>
              <View style={styles.dateTimeView}>
                <Text style={styles.whiteNormalText}> 
                  {this.state.appointmentDayOfWeek}
                </Text>
                <Text style={styles.whiteBoldText}> 
                  {this.state.appointmentMonthDay}
                </Text>
                <Text style={styles.whiteNormalText}> 
                  {this.state.appointmentYear}
                </Text>
                <Text style={styles.bigBlackBoldText}> 
                  {this.state.appointmentTime}
                </Text>
                <Text style={styles.blackBoldText}>
                  {this.state.appointmentAMPM}
                </Text>
                <Text style={styles.yellowBoldText}>
                  {this.state.appointmentTimeCountdown}
                </Text>
              </View>
              <View style={styles.wrapView}>
                <Text style={styles.appointmentTitle}>
                  {this.state.appointmentTitle}
                </Text>
                <Text style={styles.addressText}>
                  {this.state.appointmentAddress}
                </Text>
              </View>
            </View>
            <View style={styles.lineView}>
            </View>

            <TouchableHighlight style={styles.touchableRow} underlayColor='#99d9f4'              
                onPress={this.onFindRoute2Hospital.bind(this)}>
                <View style={styles.viewRow}>
                  <View style={styles.viewAlignLeft}>
                    <Text style={styles.rowTitle}>It is time to get going!</Text>
                    <Text style={styles.rowDetail}>Find the fastest route to the hospital!</Text> 
                  </View>
                  <View style={styles.viewAlignRight}>
                    <Image source={require('./resource/icon_pin.png')} style={styles.iconRow}/>
                  </View>
                  
                </View>              
              </TouchableHighlight>

          </View>
          <View style={styles.viewAppointment}>
            <TouchableHighlight style={styles.touchableRow} underlayColor='#99d9f4'              
                onPress={this.onFindRoute2Hospital.bind(this)}>
              <View>
                <View style={styles.viewAlignLeft}>
                  <Text style={styles.rowTitle}>ROAD TO RECOVERY</Text>
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.rowDetail}>With this tool you can prepare yourself for the upcoming surgery, and organize your life after surgery.</Text> 
                  <View style={styles.viewAlignRight}>                              
                    <Image source={require('./resource/icon_next.png')} style={styles.iconButton}/>
                  </View>
                </View>  
                
              </View>              
            </TouchableHighlight>

          </View>
          <View style={styles.viewRow}>
            <TouchableHighlight style={styles.touchableLeft} underlayColor='#99d9f4'              
                  onPress={this.onFindRoute2Hospital.bind(this)}>
              <View>
                <Text style={styles.buttonTitle}>Re-schedule{"\n"}calls</Text>
                <View style={styles.whiteLineView}>               
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.bottomDate}>March 19, 2015</Text> 
                  <View style={styles.viewAlignRight}>                              
                    <Image source={require('./resource/icon_phone.png')} style={styles.iconButton}/>
                  </View>
                </View>  
                
              </View>              
            </TouchableHighlight>
            <TouchableHighlight style={styles.touchableRight} underlayColor='#99d9f4'              
                  onPress={this.onFindRoute2Hospital.bind(this)}>
              <View>
                <Text style={styles.buttonTitle}>Re-schedule{"\n"}Appointments</Text>
                <View style={styles.whiteLineView}> 
                </View>
                <View style={styles.viewRow}>
                  <Text style={styles.bottomDate}>March 19, 2015</Text> 
                  <View style={styles.viewAlignRight}>                              
                    <Image source={require('./resource/icon_calendar.png')} style={styles.iconButton}/>
                  </View>
                </View>  
                
              </View>              
            </TouchableHighlight>
          </View>
        </ScrollView>
    );
  }

  // trigger when click Find Route row
  onFindRoute2Hospital(event){
    console.log('Will open Find Route view...');
  }
  // query to get json data
  queryNextAppointment() {
    fetch(nextAppointmentAPI)
    .then(response => response.json())
    .then(json => this.handleResponse(json.next_appointment))
    .catch(error => this.errorQueryAPI());
      
  }
  errorQueryAPI(){
    AlertIOS.alert(
      'Query API Error!',
      'Error while call api to get next appointment json data',
      [
        {
          text: 'OK',
          onPress: () => console.log('Wrong query api'),
        },
      ]
    );
  }

  // parsing json data
  handleResponse(appointmentJSON) {    
    // get datetime from json data
    var date = new Date(appointmentJSON.datetime);
    appointmentDate = date;
    var dateStr = date.toDateString();
    var dateSplit = dateStr.split(' ');
    // get day of week
    var dayOfWeek = this.calculateDayOfWeek(date);
    var year = dateSplit[3];
    var monthDay = dateSplit[1] + ' ' + dateSplit[2];
    // calculate appointment time
    var hours = date.getHours();    
    var minutes = date.getMinutes();
    var timeAMPM = 'AM';
    if (hours>=12){
      hours-=12;
      timeAMPM='PM';
    }
    var time = hours+':'+minutes;
    
    // calculate countdown time
    var countdown = this.calcuateCoutDown(date);
  
    this.setState({appointmentTitle: appointmentJSON.title,
                  appointmentAddress:appointmentJSON.address,
                  appointmentYear:year,
                  appointmentMonthDay:monthDay,
                  appointmentDayOfWeek:dayOfWeek,
                  appointmentTime:time,
                  appointmentAMPM:timeAMPM,
                  appointmentTimeCountdown:countdown});
  }

  // get day of week from a date
  calculateDayOfWeek(date){
      var intDay = date.getDay();
      switch(intDay){
        case 0:
          return 'Sunday';
        case 1:
          return 'Monday';
        case 2:
          return 'Tuesday';
        case 3:
          return 'Wednesday';        
        case 4:
          return 'Thursday';
        case 5:
          return 'Friday';    
        case 6:
          return 'Saturday';  
      }
  }
  // get countdown time
  calcuateCoutDown(date){
    var intervalAppointment = date.getTime();
    var intervalNow = new Date();// get current date
    var intervalCountdown = intervalAppointment - intervalNow;
    
    var minutes = 1000 * 60;
    var hours = minutes * 60;
    var days = hours * 24;
    // skip if appoinment date is over
    if (intervalCountdown<=0)
      return '';
    if (intervalCountdown >= days)
    {
      var dayNum = Math.round(intervalCountdown / days);
      if (dayNum > 1)
        return 'In ' + dayNum + ' days';
      else return 'In ' + dayNum + ' day'
    }
    else if (intervalCountdown >= hours)
    {
      var hourNum = Math.round(intervalCountdown / hours);
      if (hourNum > 1)
        return 'In ' + hourNum + ' hours';
      else return 'In ' + hourNum + ' hour'
    }      
    else{
      var minuteNum = Math.round(intervalCountdown / minutes);
      if (minuteNum > 1)
        return 'In ' + minuteNum + ' minutes';
      else
        return 'In ' + minuteNum + ' minute';
    }
      
  }

  checkCountdown(){
    this.setTimeout(
      () => {this.updateCountdown(); this.checkCountdown()}, 
      15000
      );
  }
  updateCountdown(){
    if (appointmentDate==null)
      return;
    var countdown = this.calcuateCoutDown(appointmentDate);
    // refresh timer countdown if it changes
    if (this.state.appointmentTimeCountDown!=countdown)
      this.setState({
        appointmentTimeCountDown:countdown});
  }
}

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor:'#dedede',
    padding: 0
  },
  viewAppointment: {
    backgroundColor:'#ffffff',
    padding: 15,
    marginTop:5,
    margin:2
  },
  mainTitle: {
    fontSize: 20,
    textAlign: 'left',
    marginTop:5,
    marginBottom:15
  },
  lineView:{
    backgroundColor:'#dddddd',
    height:1,
    marginTop:15,
    marginBottom:10
  },
  whiteLineView:{
    backgroundColor:'#ffffff',
    height:1,
    marginTop:3,
    alignSelf: 'stretch',
    flexDirection:'column'
  },
  viewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch'
  },
  viewColumn: {
    flex:1,
    justifyContent:'center'
  },
  viewActivityIndicator:{
    backgroundColor:'#ededed',
    flex:1,
    alignItems: 'center',
    alignSelf: 'stretch',
    opacity:0.65
  },
  viewAlignLeft:{
    alignItems: 'flex-start'
  }, 
  viewAlignRight:{
    flex:0.1,
    alignItems: 'flex-end'
  },
  touchableRight:{
    flex:0.5,
    alignSelf: 'stretch',
    marginTop:5,
    marginLeft:2,
    marginRight:2,
    marginBottom:5,
    padding:1,
    backgroundColor:'#239791'
  },
  touchableLeft:{
    flex:0.5,
    alignSelf: 'stretch',
    marginTop:5,
    marginLeft:2,
    marginRight:2,
    marginBottom:5,
    padding:1,
    backgroundColor:'#239791',
    flexDirection: 'column',
  },  
  dateTimeView:{
    backgroundColor:'#28AFCD',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight:13,
    marginTop:4,
    marginBottom:4,
    paddingTop:10,
    paddingBottom:10,
    paddingLeft:26,
    paddingRight:26
  },
  whiteNormalText:{
    fontSize: 16,
    color:'#ffffff',
    textAlign:'center',
    fontWeight:'bold'
  },
  whiteBoldText:{
    fontSize: 23,
    color:'#ffffff',
    fontWeight:'bold',
    textAlign:'center'
  },
  bigBlackBoldText:{
    color:'black',
    fontWeight:'bold',
    fontSize:28
  },
  blackBoldText:{
    color:'black',
    fontWeight:'bold',
    fontSize:18,
    marginBottom:5
  },
  yellowBoldText:{
    fontSize: 16,
    color:'#ffff00',
    fontWeight:'bold',
    textAlign:'center'
  },
  appointmentTitle: {
    fontSize: 16,
    textAlign: 'left',
    fontWeight:'bold',
    marginBottom:10
  },
  addressText:{
    fontSize: 14,
    color:'#333333',
    textAlign:'left',
    marginBottom:5
  },
  rowTitle: {
    fontSize: 16,
    textAlign: 'left',
    marginBottom:5,
    flex:1
  },
  rowDetail: {
    fontSize: 13,
    textAlign: 'left',
    flex:1
  },
  
  buttonTitle: {
    fontSize: 18,
    textAlign: 'left',
    color:'#ffffff',
    fontWeight:'bold',
    marginTop:12,
    marginBottom:12,
    paddingLeft:15
  },

  bottomDate: {
    fontSize: 14,
    textAlign: 'left',
    color:'#ffffff',
    marginTop:8,
    marginBottom:8,
    paddingLeft:15
  },

  touchableRow:{
    marginTop:6,
    marginBottom:6
  },
  wrapView:{
    flex:1
  },
  iconRow:{
    width:20,
    height:25
  },

  iconButton:{
    width:22,
    height:22,
    marginRight:8
  }
 });

module.exports = Appointment;