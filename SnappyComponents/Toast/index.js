import React, { useState, useEffect } from 'react';
import { Text } from 'react-native'
import Proptypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const Toast = ({ componentId, closeBtnTitle, message, dismiss, onClose }) => {
	const [animation, setAnimation] = useState('slideInDown')

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(() => {
		if (dismiss) setTimeout(_dismissScreen, 1700)
	});

	_dismissScreen = () => {
		setAnimation('slideOutUp')
	}

	return (
		<Animatable.View
			useNativeDriver
			animation={animation}
			onAnimationEnd={() => {
				if (animation === 'slideOutUp') {
					Navigate.dismissOverlay(componentId)
				}
			}}
			easing="ease-in"
			duration={200}
			style={Styles.root}
		>
			<Text style={Styles.message}>{message}</Text>
		</Animatable.View >
	)



}

Toast.propTypes = {
	message: Proptypes.string,
}

Toast.defaultProps = {
	message: 'This is a toast'
}

export default Toast