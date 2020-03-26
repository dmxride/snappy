import React, { useState, useEffect } from 'react';
import { ActivityIndicator } from 'react-native'
import Proptypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const Loader = ({ componentId, passRef, actionBtnTitle, closeBtnTitle, message, dismiss, onAction, onClose, size, color }) => {
	const [animation, setAnimation] = useState('bounceIn');

	// Similar to componentDidMount and componentDidUpdate:
	useEffect(() => {
		passRef && passRef(this)
	}, []);

	_dismissScreen = () => {
		setAnimation('bounceOut')
	}

	return (
		<Animatable.View
			useNativeDriver
			animation={animation}
			onAnimationEnd={() => {
				if (animation === 'bounceOut') {
					Navigate.dismissOverlay(componentId)
				}
			}}
			easing="ease-in"
			duration={200}
			style={Styles.root}
		>
			<ActivityIndicator size={size} color={color} />
		</Animatable.View >
	)
}


Loader.propTypes = {
	message: Proptypes.string,
	passRef: Proptypes.func
}

Loader.defaultProps = {
	message: '',
	size: "large",
	color: "#0000ff"
}

export default Loader