import React from "react";
import { Text, TouchableOpacity, View,StyleSheet, TextInput, Image } from "react-native";
import { BarCodeScanner} from 'expo-barcode-scanner'
import * as Permissions from 'expo-permissions'
import * as firebase from 'firebase'
import db from '../config'
export default class TransactionScreen extends React.Component {
  constructor() {
    super()
    this.state={
      hasCameraPermissions:null,
      scanned:false,
      scannedBookId:'',
      scannedStudentId:'',
      scannedData:'',
      buttonState:'normal',
      transactionMessage:''
    }
  }
  getCameraPermissions=async(id)=>{
    const {status} =await Permissions.askAsync(Permissions.CAMERA)
    this.setState({
      hasCameraPermissions:status==="granted",
      buttonState:id,
      scanned:false
    })
  }
  handleBarCodeScanned=async({type,data})=>{
    const {buttonState}=this.state
    if (buttonState==="BookId") {
      
    
    this.setState({
      scanned:true,
      scannedBookId:data,
      buttonState:'normal'
    })
  }
  else if (buttonState==="StudentId") {
    this.setState({
      scanned:true,
      scannedStudentId:data,
      buttonState:'normal'
    })
  }
  }
  initiateBookIssue=async()=>{db.collection("transaction").add({
    'studentId':this.state.scannedStudentId,
    'bookId':this.state.scannedBookId,
    'date':firebase.firestore.Timestamp.now().toDate(),
    'transactionType':'Issue'
  })
  db.collection("books").doc(this.state.scannedBookId).update({
    'bookAvailability':false
  })
  db.collection("students").doc(this.state.scannedStudentId).update( { 
    'numberOfBookIssued':firebase.firestore.FieldValue.increment(1)
  })
  this.setState({scannedBookId:'',scannedStudentId:''})}
  initiateBookReturn=async()=>{db.collection("transaction").add({
    'studentId':this.state.scannedStudentId,
    'bookId':this.state.scannedBookId,
    'date':firebase.firestore.Timestamp.now().toDate(),
    'transactionType':'Return'
  })
  db.collection("books").doc(this.state.scannedBookId).update({
    'bookAvailability':false
  })
  db.collection("students").doc(this.state.scannedStudentId).update( { 
    'numberOfBookIssued':firebase.firestore.FieldValue.increment(-1)
  })
  this.setState({scannedBookId:'',scannedStudentId:''})}

handleTransaction=async()=>{
var transactionMessage
db.collection("books").doc(this.state.scannedBookId).get()
.then((doc)=>{
  var book= doc.data()
  if (book.bookAvailability) {
    this.initiateBookIssue()
    transactionMessage="bookIssue"
  }
  else{
    this.initiateBookReturn()
    transactionMessage="bookReturn"
  }
})
this.setState({
  transactionMessage:transactionMessage
})
}

  render(){
    const hasCameraPermissions=this.state.hasCameraPermissions
    const scanned=this.state.scanned
    const buttonState=this.state.buttonState
    if (buttonState!=="normal"&& hasCameraPermissions) {
      return(
        <BarCodeScanner onBarCodeScanned={scanned?undefined:this.handleBarCodeScanned}
        style={ StyleSheet.absoluteFillObject}/>
      )
    }
    else if (buttonState==="normal") {
      return(
        <View style= {style.container}>
          <View>
            <Image source={require(".././assets/booklogo.jpg")}
            style={{width:200,height:200}}/>
            <Text style={{textAlign:'center',fontSize:30}}>wily</Text> 
            </View>
        <View style={style.inputView} >

          <TextInput style={style.inputBox}
          placeholder="Book Id"
          value={this.state.scannedBookId}/>
          <TouchableOpacity style={style.scanButton}
          onPress={()=>{
            this.getCameraPermissions("BookId ")
          }}>
            <Text style={style.buttonText}>scan </Text>
          </TouchableOpacity>
           </View>
           <View style={style.inputView}>
           <TextInput style={style.inputBox}
          placeholder="Student Id"
          
          value={this.state.scannedStudentId}/>
          <TouchableOpacity style={style.scanButton}
          onPress={()=>{
            this.getCameraPermissions("StudentId ")
          }}>
            <Text style={style.buttonText}>scan </Text>
          </TouchableOpacity>
           </View>
           <TouchableOpacity style={style.submitButton}
           onPress={async()=>{this.handleTransaction()}}>
             <Text style={style.submitButtonText}> submit </Text>
           </TouchableOpacity>
           </View>
  )
  }
}
}
const style=StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center',
  },
  displayText:{
    fontSize:15,
    TextDecorationLine:'underline'
  },
  scanButton:{
    backgroundColor:"red",
    padding:10,
    margin:10
  },
  buttonText:{
    fontSize:20,
    textAlign:'center',
    margin:10,
  },
  buttonText:{
    fontSize:15,
    textAlign:'center',
    marginTop:10,
  },
  inputView:{
    flexDirection:'row',
    margin:20,
  },
  inputBox:{
    width:200,
    height:40,
    borderWidth:1.5,
    borderRightWidth:0,
    fontSize:20,
  },
  scanButton:{
    backgroundColor:"red",
    width:50,
    borderWidth:1.5,
    borderLeftWidth:0,
  },
  submitButton:{
    backgroundColor:"black",
    width:100,
    height:50,
  },
  submitButtonText:{
    padding:10,
    textAlign:'center',
    fontSize:20,
    fontWeight:'bold',
    color:"red",
  }
})
