import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, TouchableOpacity, Text, PanResponder, Dimensions } from 'react-native'
import * as Animatable from 'react-native-animatable'
import Proptypes from 'prop-types'

import Navigate from '../../SnappyNavigation/navigate'

import Styles from './styles'

const BottomDraw = ({ 
	height,
  onClose, 
  onSelect, 
	draggable,
  component, 
	componentId, 
	backgroundColor,
  barBackgroundColor, 
  drawBackgroundColor,
  ...props 
}) => {
	let dimensions = Dimensions.get('window')

	let _panResponder = PanResponder.create({
		onStartShouldSetPanResponder: (e, gesture) => true,
		onPanResponderMove: (event, gestureState) => {		
			const { pageY } = event.nativeEvent
			if (!draggable) return 

			if (dimensions) {
				
				let heightValue = dimensions.height 
				heightValue -= pageY 
				heightValue -= 220 - 20
				heightValue = -((heightValue * 1e2 ) / 1e2)

				switch (true) {
					case heightValue < 0: return
					case dimensions.height - pageY < 60: 
						setTranslateY(220)
						setTimeOut(true)
						_dismissScreen()
						return  
					default: 
						setTranslateY(heightValue)
						return
				}
			}
		},
		onPanResponderRelease: (event, gestureState) => !timeout && setTranslateY(0)
	})
	
	const [animations, setAnimations] = useState(['fadeIn'])
	const [translateY, setTranslateY] = useState(220)  
	const [timeout, setTimeOut] = useState(false)

	_dismissScreen = () => {
		setAnimations(['fadeOut'])
	}

	useLayoutEffect(() => {
		setTranslateY(10)
	}, [])

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
			duration={100}
			style={Styles.root(backgroundColor)}
		>
      <TouchableOpacity
				style={Styles.wrapper}
				onPress={() => _dismissScreen()}
			/>

			<Animatable.View
				useNativeDriver
				transition="translateY"
				style={[
					Styles.container(drawBackgroundColor, height), 
					{ translateY }
				]}
				delay={0}
				duration={timeout ? 300 : 0}
			>
				{draggable && (
					<View 
						hitSlop={{ top: 16, bottom: 16, left: 16, right: 16 }}
						style={Styles.bar(barBackgroundColor)} 
						{..._panResponder.panHandlers}
					/>
				)}

        {component && component({
					_dismissScreen,
					...props
				})}		
			</Animatable.View>
		</Animatable.View>
	)
}

BottomDraw.propTypes = {
  onClose: Proptypes.func,
  barBackgroundColor: Proptypes.string,
  drawBackgroundColor: Proptypes.string,
  backgroundColor: Proptypes.string,
	draggable: Proptypes.bool,
	height: Proptypes.number
}

BottomDraw.defaultProps = {
	draggable: false,
  barBackgroundColor: '#666666',
  drawBackgroundColor: '#282827',
	backgroundColor: 'rgba(0, 0, 0, 0.8)',
	height: 230
}

export default BottomDraw