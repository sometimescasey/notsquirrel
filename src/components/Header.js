import React, {Component} from 'react';
import {Text, StyleSheet, View} from 'react-native';

SQ_ORANGE = '#FF8700';
SQ_BLUE = '#00B6FF';

// Make component
export default class Header extends Component {
	constructor(props){
        super(props);
    }
	render() {
		// bgStyle = {  };
		// const combinedViewStyle = StyleSheet.flatten([viewStyle, bgStyle]);
		return (
			<View style={[styles.viewStyle, {backgroundColor: this.props.customHeaderColor}]}>
				<Text style={styles.textStyle}>{ this.props.headerText }</Text>
			</View>
			);
	}
}

Header.defaultProps = {
  customHeaderColor: SQ_BLUE,
};

// Make stylesheet
const styles = StyleSheet.create({
	textStyle: {
		fontSize: 20,
		fontWeight: '600',
		color: '#FFFFFF',
	},
	viewStyle: {
		justifyContent: 'flex-start', // vertical. flex-start, flex-end
		alignItems: 'center', // horizontal. same values
		height: 100,
		paddingTop: 20,
		shadowColor: '#000000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.2,
		position: 'relative',
	}

	}); 

// make this available to other parts of the app - combined into class declaration
// export default Header;