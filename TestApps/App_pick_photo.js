/**
 * An extremely silly React Native + Tensorflow App for identifying squirrels.
 */

import React, {Component} from 'react';
import { Button, Platform, StyleSheet, Text, View, Image } from 'react-native';
import ImagePicker from 'react-native-image-picker';

type Props = {};
export default class App extends Component<Props> {
constructor() {
  super()
  this.initImage = require('./assets/squirrel2.jpg');
  this.state = {photo: this.initImage};

  // need to explicitly bind in order to be able to call this.setState inside askForPhoto
  // otherwise, setState doesn't know what "this" is (JS way of handling static vs instance functions)
  this.askForPhoto = this.askForPhoto.bind(this); }

componentDidMount() {

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
    // TODO: use react-native fs stat from https://github.com/itinance/react-native-fs/pull/480/files
    // get originalFilepath on the StatResult
    
    RNFS.exists(response.uri)
    .then( (exists) => {
        if (exists) {
          console.log("file at response.uri EXISTS");
          this.setState({photo: {uri: response.uri}});
        } else {
          console.log("file at response.uri DOES NOT EXIST");
          RNFS.stat(response.uri).then((statResult) => {
            console.log("real path: " + statResult.originalFilepath)
            var realPath = "file://" + statResult.originalFilepath
            this.setState({photo: {uri: realPath}});

          }).catch((err) => {console.log("RNFS stat problem: " + err)} ); 
        }
    });

    

    // https://github.com/itinance/react-native-fs/issues/470
    

    }
  });
}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Is this a squirrel?</Text>
        <Image source={this.state.photo} style={styles.image} />
        <Button
  onPress={this.askForPhoto}
  title="Choose photo"
  color="#841584"
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
