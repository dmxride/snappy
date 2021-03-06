import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import Proptypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const Popup = ({ componentId, popupTitle, actionBtnTitle, closeBtnTitle, message, dismiss, onAction, onClose, styles }) => {
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
				style={[Styles.wrapper, styles.wrapper]}
				onPress={() => {
					_dismissScreen()
				}}
			/>
			<Animatable.View
				useNativeDriver
				animation={animations[1]}
				style={[Styles.container, styles.container]}
				easing="ease-out"
				duration={200}
			>

				<View style={[Styles.containerPlaceholder, styles.containerPlaceholder]}>
					<Text>{popupTitle || 'PLACEHOLDER'}</Text>
				</View>

				<View style={[Styles.containerMessage, styles.containerMessage]}>
					{message && <Text style={[Styles.message, styles.message]}>{message}</Text>}
				</View>

				<TouchableOpacity
					style={[Styles.actionBtn, styles.actionBtn]}
					onPress={() => {
						onAction && onAction()
					}}
				>
					<Text style={[Styles.actionBtnTitle, styles.actionBtnTitle]}>{actionBtnTitle}</Text>
				</TouchableOpacity>

				<TouchableOpacity
					style={Styles.closeBtn}
					onPress={() => {
						onClose && onClose()
						_dismissScreen()
					}}
				>
					<Text style={[Styles.closeBtnTitle, styles.closeBtnTitle]}>{closeBtnTitle}</Text>
				</TouchableOpacity>
			</Animatable.View>
		</Animatable.View >
	)
}

Popup.propTypes = {
	popupTitle: Proptypes.string,
	message: Proptypes.string,
	dismiss: Proptypes.bool,
	actionBtnTitle: Proptypes.string,
	closeBtnTitle: Proptypes.string,
	onAction: Proptypes.func,
	onClose: Proptypes.func,
	styles: Proptypes.object
}

Popup.defaultProps = {
	dismiss: false,
	popupTitle: '',
	actionBtnTitle: "Action",
	closeBtnTitle: "Close",
	styles: {}
}

export default Popup