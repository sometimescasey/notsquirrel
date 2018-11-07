/**
 * An extremely silly React Native + Tensorflow App for identifying squirrels.
 */

import React, {Component} from 'react';
import { Button, Platform, StyleSheet, Text, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { TfImageRecognition } from 'react-native-tensorflow';

const GRAPH_FILE = './assets/retrained_graph.pb'
const LABEL_FILE = './assets/retrained_labels.txt'

type Props = {};
export default class App extends Component<Props> {
constructor() {
  super()
  this.initImage = require('./assets/squirrel2.jpg');
  this.state = {photo: this.initImage,
                result: "",
                confidence: ""};
  // need to explicitly bind in order to be able to call this.setState inside askForPhoto
  // otherwise, setState doesn't know what "this" is (JS way of handling static vs instance functions)
  this.askForPhoto = this.askForPhoto.bind(this);
}

componentDidMount() {
  this.recognizeImage();
}

askForPhoto() {
  var RNFS = require('react-native-fs');

  const imagePickerOptions = {
  title: 'Select Photo',
  customButtons: [],
  storageOptions: {
    cameraRoll: true,
    waitUntilSaved: true,
    path: 'images',
  }
};

ImagePicker.showImagePicker(imagePickerOptions, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    console.log("response.uri is:" + response.uri);
    
    RNFS.exists(response.uri)
    .then( (exists) => {
        if (exists) {
          // Handle library picker
          this.setState({photo: {uri: response.uri}}, ()=>{this.recognizeImage();});
        } else {
          // Handle photo taken from camera
          RNFS.stat(response.uri).then((statResult) => {
            // console.log("real path: " + statResult.originalFilepath)
            var realPath = "file://" + statResult.originalFilepath
            this.setState({photo: {uri: realPath}}, ()=>{this.recognizeImage();});

          }).catch((err) => {console.log("RNFS.stat() caught exception: " + err)} ); 
        }
    }).catch((err) => {console.log("RNFS.exists() caught exception: " + err)} );
    }
  });
}

async recognizeImage() {
  try {
    const tfImageRecognition = new TfImageRecognition({
      model: require(GRAPH_FILE),
      labels: require(LABEL_FILE),
      imageMean: 117, // Optional, defaults to 117
      imageStd: 1 // Optional, defaults to 1
});
    
    const results = await tfImageRecognition.recognize({
    image: this.state.photo,
    inputName: "input", //Optional, defaults to "input"
    inputSize: 224, //Optional, defaults to 224
    outputName: "final_result", //Optional, defaults to "output"
    maxResults: 3, //Optional, defaults to 3
    threshold: 0.1, //Optional, defaults to 0.1
    })
    
    const resultText = "Name: " + results[0].name
    const confidenceText = "Confidence: " + results[0].confidence
    this.setState({result: resultText})
    this.setState({confidence: confidenceText})

    await tfImageRecognition.close()  
  } catch(err) {
    alert(err)
  }
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Is this a squirrel?</Text>
        <Image source={this.state.photo} style={styles.image} />
        <Text style={styles.results}>{this.state.result}</Text>
        <Text style={styles.results}>{this.state.confidence}</Text>
        <Button
  onPress={this.askForPhoto}
  title="Choose photo"
  color="#00B6FF"
  accessibilityLabel="Press this button to choose a photo"
/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  image: {
    width: 150,
    height: 100
  },
  results: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
