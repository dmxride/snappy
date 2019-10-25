import React, { Component } from 'react'
import { BackHandler, StatusBar } from 'react-native'
import { Navigation } from 'react-native-navigation'

import { resetPrevScreen } from './navigate'

export default function Wrapper(ChildComponent, screenName) {
	return function inject(props) {

		class EnhancedComponent extends Component {
			render() {
				return (
					<>
						<StatusBar barStyle="light-content" backgroundColor={'#000'} />
						{/*<ChildComponent {...props} persistor={persistor} />*/}
						<ChildComponent {...props} />
					</>
				)
			}

			//WorkAround for bug when backButton does not PopScreens or hides modals
			componentDidMount() {
				//console.reportErrorsAsExceptions = false;
				BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
			}

			componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
			}

			_handleBackPress = async () => {
				resetPrevScreen()

				try {
					await Navigation.pop(props.componentId)
					return true
				} catch (e) {
					BackHandler.exitApp()
					return false
				}
			}

		}

		return <EnhancedComponent />
	}
}