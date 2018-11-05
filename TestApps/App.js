/**
 * A silly React Native + Tensorflow App for identifying squirrels.
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Image} from 'react-native';
import { TfImageRecognition } from 'react-native-tensorflow';
import ImagePicker from 'react-native-image-picker';

async function getResults() {
  const results = await tfImageRecognition.recognize({
  image: require('./assets/squirrel.jpg'),
  inputName: "input", //Optional, defaults to "input"
  inputSize: 224, //Optional, defaults to 224
  outputName: "final_result", //Optional, defaults to "output"
  maxResults: 3, //Optional, defaults to 3
  threshold: 0.1, //Optional, defaults to 0.1
  })
  return results
} 
 
getResults().then((result) => {
  for (let line of result) {
    console.log(line.id, line.name, line.confidence);
    }
  }
)
 
async () => {await tfImageRecognition.close()} // Necessary in order to release objects on native side

type Props = {};
export default class App extends Component<Props> {
constructor() {
	super()
	this.image = require('./assets/squirrel.jpg');
	this.state = {result: ""}
}

componentDidMount() {
	this.recognizeImage
}

pickPhoto() {
  const options = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images',
    },
  };
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
        image: this.image
      })
      
    const resultText = "Name: ${results[0].name} - Confidence: ${results[0].confidence}"
    this.setState({result: resultText})

    await tfImageRecognition.close() 	
	} catch(err) {
		alert(err)
	}
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Image source={this.image} style={styles.image} />
        <Text style={styles.results}>{this.state.result}</Text>
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
  results: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  image: {
    width: 150,
    height: 100
  },
});
