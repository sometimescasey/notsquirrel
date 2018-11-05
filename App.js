/**
 * An extremely silly React Native + Tensorflow App for identifying squirrels.
 */

import React, {Component} from 'react';
import { Button, Platform, StyleSheet, Text, View, Image } from 'react-native';
import { TfImageRecognition } from 'react-native-tensorflow';
import ImagePicker from 'react-native-image-picker';

type Props = {};
export default class App extends Component<Props> {
constructor() {
  super()
  this.image = require('./assets/squirrel2.jpg');
  this.state = {result: "", confidence: "", photo: ""}
}

componentDidMount() {
  this.recognizeImage()
}

askForPhoto() {
var RNGRP = require('react-native-get-real-path');

  const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
  }
};

ImagePicker.showImagePicker(options, (response) => {
  console.log('Response = ', response);

  if (response.didCancel) {
    console.log('User cancelled image picker');
  } else if (response.error) {
    console.log('ImagePicker Error: ', response.error);
  } else if (response.customButton) {
    console.log('User tapped custom button: ', response.customButton);
  } else {
    console.log("response.uri is:" + response.uri);

    RNGRP.getRealPathFromURI(response.uri).then(path => console.log(path)).catch("Error: getRealPathFromURI( promise failed) ");

    }
  });
}

async recognizeImage() {
  try {
    const tfImageRecognition = new TfImageRecognition({
      model: require('./assets/retrained_graph.pb'),
      labels: require('./assets/retrained_labels.txt'),
      imageMean: 117, // Optional, defaults to 117
      imageStd: 1 // Optional, defaults to 1
  })

  const results = await tfImageRecognition.recognize({
  image: this.image,
  inputName: "input", //Optional, defaults to "input"
  inputSize: 224, //Optional, defaults to 224
  outputName: "final_result", //Optional, defaults to "output"
  maxResults: 3, //Optional, defaults to 3
  threshold: 0.1, //Optional, defaults to 0.1
  })
      
  console.log("Name: " + results[0].name + "\nConfidence: " + results[0].confidence)
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
        <Image source={this.image} style={styles.image} />
        <Text style={styles.results}>{this.state.result}</Text>
        <Text style={styles.results}>{this.state.confidence}</Text>
        <Button
  onPress={this.askForPhoto}
  title="Choose image"
  color="#841584"
  accessibilityLabel="Press this button to choose a photo"
/>
<Image source={this.state.photo} style={styles.image}/>
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
