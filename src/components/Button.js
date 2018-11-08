import React, { Component } from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';

const Button = (props) => {
	const {buttonStyle, textStyle} = styles;
	return(
		<TouchableOpacity style={buttonStyle} onPress={props.whenPressed}>
			<Text style={textStyle}>
				{props.children}
			</Text>
		</TouchableOpacity>
	);
};

const styles = StyleSheet.create({
	buttonStyle: {
			justifyContent: 'center',
			flex: 1,
			// alignSelf: 'stretch',
			backgroundColor: '#FF8700',
			borderWidth: 1,
			borderRadius: 10,
			borderColor: '#FFFFFF',
			margin: 10,

	},
	textStyle: {
		alignSelf: 'center',
		color: '#FFFFFF',
		fontSize: 16,
		fontWeight: '600',
		paddingTop: 20,
		paddingBottom: 20,

	},
});

export default Button;