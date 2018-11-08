/**
 * An extremely silly React Native + Tensorflow App for identifying squirrels.
 */

import React, {Component} from 'react';
import { Platform, StyleSheet, Text, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { TfImageRecognition } from 'react-native-tensorflow';
import Header from './src/components/Header';
import Button from './src/components/Button';

const GRAPH_FILE = './assets/retrained_graph.pb'
const LABEL_FILE = './assets/retrained_labels.txt'
const IMAGE_MEAN = 128 // settings from TF for Poets
const IMAGE_STD = 128 // // settings from TF for Poets

const SQ_ORANGE = '#FF8700';
const SQ_BLUE = '#00B6FF';

type Props = {};
export default class App extends Component<Props> {
constructor() {
  super()
  this.initImage = require('./assets/squirrel2.jpg');
  this.initCircle = require('./assets/circle_squirrel.png');
  this.state = {photo: this.initImage,
                result: "",
                confidence: "",
                topCircle: this.initCircle,
                topColor: SQ_BLUE};
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

processResult(firstResult) {
  if (firstResult == "squirrel") {
    this.setState({result: "SQUIRREL!", topColor: SQ_ORANGE})
  }
  else {
    this.setState({result: "Not squirrel :(", topColor: SQ_BLUE})
  }
}

async recognizeImage() {
  try {
    const tfImageRecognition = new TfImageRecognition({
      model: require(GRAPH_FILE),
      labels: require(LABEL_FILE),
      imageMean: IMAGE_MEAN,
      imageStd: IMAGE_STD
});
    
    const results = await tfImageRecognition.recognize({
    image: this.state.photo,
    inputName: "input", //Optional, defaults to "input"
    inputSize: 224, //Optional, defaults to 224
    outputName: "final_result", //Optional, defaults to "output"
    maxResults: 3, //Optional, defaults to 3
    threshold: 0.1, //Optional, defaults to 0.1
    })
    
    this.processResult(results[0].name)
    // const confidenceText = "Confidence: " + results[0].confidence

    await tfImageRecognition.close()  
  } catch(err) {
    alert(err)
  }
}

  render() {
    return (
      <View style={styles.container}>
      <Header 
      headerText={this.state.result}
      customHeaderColor={this.state.topColor}/>
      
      <View style={styles.imageContainer}>
        <Image source={this.state.photo} 
        style={styles.imageStyle}
        resizeMode={'cover'} />
      </View>

      <View style={styles.buttonContainer}>
        <Button 
        whenPressed={() => this.askForPhoto()}>
          Take / Choose Photo
        </Button>
      </View>
      
      <View style={styles.circleContainer}>
        <Image source={this.state.topCircle} style={styles.topCircle} />
      </View>
        
        <Text style={styles.results}>{this.state.result}</Text>
        <Text style={styles.results}>{this.state.confidence}</Text>
        

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  topCircle: {
    width: 80,
    height: 80,
    borderWidth: 2,
    borderColor: '#FFFFFF',
    borderRadius: 999,
  },
  circleContainer: {
    top: 60, // todo: replace with calc based on screen size
    left: 165, // todo: replace with calc based on screen size
    position: 'absolute',
  },
  imageStyle: {
    width: '100%',
    height: '100%',
  },
  imageContainer: {
    flex: 7,

  },
  buttonContainer: {
    flex: 1,
    alignContent: 'center',
    backgroundColor: '#00B6FF',
  },
  results: {
    display: 'none',
    textAlign: 'center',
  },
});
