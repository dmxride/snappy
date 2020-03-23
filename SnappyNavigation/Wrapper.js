import React, { Component } from 'react'
import { BackHandler, View, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'

import NetInfo from "@react-native-community/netinfo"

import * as SnappyTheme from './../SnappyTheme'
import * as SnappyConnection from './../SnappyConnection'
import SnappyTranslations from './../SnappyTranslations'

import { resetPrevScreen } from './navigate'

export default function Wrapper(_ChildComponent, screenName) {
	return function (props) {
		class EnhancedComponent extends Component {
			shouldStart = null
			theme = null
			translations = null
			store = null
			netinfo = null
			finishedCallback = null

			state = {
				isReady: false
			}

			render() {
				const { isReady } = this.state

				let ChildComponent = _ChildComponent(props, (startScreenId, theme, translations, store, finishedCallback) => {
					this.shouldStart = startScreenId === props.componentId
					this.theme = theme
					this.translations = translations
					this.store = store
					this.finishedCallback = finishedCallback
				})

				if (!isReady && this.shouldStart) return null
				if (isReady || !this.shouldStart) return <ChildComponent />
			}

			//WorkAround for bug when backButton does not PopScreens or hides modals
			componentDidMount() {
				//console.reportErrorsAsExceptions = false;
				BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)
				this.shouldStart && this._setInitialState()
			}

			componentWillUnmount() {
				BackHandler.removeEventListener('hardwareBackPress', this._handleBackPress)
			}

			_setInitialState = async () => {
				//await for i18n to be set in order to inject in the component
				await SnappyTranslations(this.translations, this.store)
				//save the main theme before navigating to the startScreen
				await SnappyTheme.set(this.theme, this.store)
				this.setState({ isReady: true }, () => {
					this.netinfo = NetInfo.addEventListener(async ({ isConnected }) => await SnappyConnection.set_internet_connection(isConnected, this.store))
					this.finishedCallback()
				})
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