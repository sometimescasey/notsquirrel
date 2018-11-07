# notsquirrel
(WIP) A silly React Native + Tensorflow Lite Android app to tell you whether or not something is a squirrel.

Inspired by the incredibly aggressive squirrels that climb up the (heavily oiled!) bird feeder pole in my backyard. Inspiration and end-goal is something like [this](https://www.slideshare.net/kgrandis/pycon-2012-militarizing-your-backyard-computer-vision-and-the-squirrel-hordes) fantastic Arduino + Python squirrel super soaker sentry from PyCon 2012.

For now, just following in [Jinyang's](https://www.youtube.com/watch?v=vIci3C4JkL0) shoes. Is it a squirrel or not-squirrel?

Uses the following resources and libraries:

* `retrained_graph.pb` and `retrained_labels.txt` from a Tensorflow Lite graph retrained on images of squirrels and squirrel-like rodents, per the tutorial at [TensorFlow for Poets 2: TFLite Android](https://codelabs.developers.google.com/codelabs/tensorflow-for-poets-2-tflite/#0)
* A slightly modified fork of react-native-tensorflow ([Original](https://github.com/reneweb/react-native-tensorflow))([Fork](https://github.com/sometimescasey/react-native-tensorflow/tree/revision))
* [react-native-fs](https://github.com/itinance/react-native-fs)
* [react-native-image-picker](https://github.com/react-community/react-native-image-picker/)

# Building
Run Bundler:
```
\\ from root folder
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/
```

Using Gradle to build the signed release APK (see https://facebook.github.io/react-native/docs/signed-apk-android.html):
```
cd android
./gradlew assembleRelease

```
Test release APK:
```
\\ from root folder
react-native run-android --variant=release
```

Install to phone:
```
cd android
./gradlew installRelease
```
