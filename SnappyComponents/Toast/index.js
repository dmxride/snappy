import React, { useState, useEffect } from 'react';
import { Text } from 'react-native'
import Proptypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const Toast = ({ componentId, closeBtnTitle, message, dismiss, onClose, styles, bottom }) => {
	const [animation, setAnimation] = useState(bottom ? 'slideInUp' : 'slideInDown')

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(() => {
		if (dismiss) setTimeout(_dismissScreen, 1700)
	});

	_dismissScreen = () => {
		setAnimation(bottom ? 'slideOutDown' :'slideOutUp')
	}

	return (
		<Animatable.View
			useNativeDriver
			animation={animation}
			onAnimationEnd={() => {
				const currentAnimation = bottom ? 'slideOutDown' : 'slideOutUp'
				if (animation === currentAnimation) {
					Navigate.dismissOverlay(componentId)
				}
			}}
			easing="ease-in"
			duration={200}
			style={[Styles.root(bottom), styles.root]}
		>
			<Text style={[Styles.message, styles.message]}>{message}</Text>
		</Animatable.View >
	)
}

Toast.propTypes = {
	bottom: Proptypes.bool,
	message: Proptypes.string,
	styles: Proptypes.object
}

Toast.defaultProps = {
	bottom: false,
	message: 'This is a toast',
	styles: {}
}

export default Toast