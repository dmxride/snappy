import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import Proptypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const Popup = ({ componentId, actionBtnTitle, closeBtnTitle, message, dismiss, onAction, onClose }) => {
	const [animations, setAnimations] = useState(['fadeIn', 'slideInUp']);

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(() => {
		if (dismiss) setTimeout(_dismissScreen, 1700)
	});

	_dismissScreen = () => {
		setAnimations(['fadeOut', 'slideOutDown'])
	}

	return (
		<Animatable.View
			useNativeDriver
			animation={animations[0]}
			onAnimationEnd={() => {
				if (animations[0] === 'fadeOut') {
					Navigate.dismissOverlay(componentId)
				}
			}}
			easing="ease-in"
			duration={200}
			style={Styles.root}
		>
			<TouchableOpacity
				style={Styles.wrapper}
				onPress={() => {
					_dismissScreen()
				}}
			/>
			<Animatable.View
				useNativeDriver
				animation={animations[1]}
				style={Styles.container}
				easing="ease-out"
				duration={200}
			>

				<View style={Styles.containerPlaceholder}>
					<Text>PLACEHOLDER</Text>
				</View>

				<View style={Styles.containerMessage}>
					{message && <Text style={Styles.message}>{message}</Text>}
				</View>

				<TouchableOpacity
					style={Styles.actionBtn}
					onPress={() => {
						onAction && onAction()
					}}
				>
					<Text style={Styles.message}>{actionBtnTitle}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={Styles.closeBtn}
					onPress={() => {
						onClose && onClose()
						_dismissScreen()
					}}
				>
					<Text style={Styles.message}>{closeBtnTitle}</Text>
				</TouchableOpacity>
			</Animatable.View>
		</Animatable.View >
	)



}

Popup.propTypes = {
	message: Proptypes.string,
	dismiss: Proptypes.bool,
	actionBtnTitle: Proptypes.string,
	closeBtnTitle: Proptypes.string,
	onAction: Proptypes.func,
	onClose: Proptypes.func
}

Popup.defaultProps = {
	dismiss: false,
	actionBtnTitle: "Action",
	closeBtnTitle: "Close"
}

export default Popup