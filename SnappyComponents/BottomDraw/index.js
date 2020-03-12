import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text } from 'react-native'
import Proptypes from 'prop-types'
import * as Animatable from 'react-native-animatable'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const BottomDraw = ({ 
  componentId, 
  onClose, 
  onSelect, 
  component, 
  barBackgroundColor, 
  drawBackgroundColor,
  backgroundColor,
  ...props 
}) => {
	const [animations, setAnimations] = useState(['fadeIn', 'slideInUp']);

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
			style={Styles.root(backgroundColor)}
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
				style={Styles.container(drawBackgroundColor)}
				easing="ease-out"
				duration={200}
			>

				<View style={Styles.bar(barBackgroundColor)} />

        {component && component}		
			</Animatable.View>
		</Animatable.View >
	)



}

BottomDraw.propTypes = {
  onClose: Proptypes.func,
  barBackgroundColor: Proptypes.string,
  drawBackgroundColor: Proptypes.string,
  backgroundColor: Proptypes.string

}

BottomDraw.defaultProps = {
  barBackgroundColor: '#666666',
  drawBackgroundColor: '#282827',
  backgroundColor: 'rgba(0, 0, 0, 0.8)'
}

export default BottomDraw