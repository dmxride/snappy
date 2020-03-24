import React, { Component } from 'react'
import { BackHandler, View, Text } from 'react-native'
import { Navigation } from 'react-native-navigation'
import { getStoredState } from 'redux-persist'

import NetInfo from "@react-native-community/netinfo"

import * as SnappyTheme from './../SnappyTheme'
import * as SnappyConnection from './../SnappyConnection'
import SnappyTranslations from './../SnappyTranslations'

import persistConfig from '../SnappyStore/store/persistConfig'
import { rehydrate } from '../SnappyStore/store/rehydrate'

import { resetPrevScreen } from './navigate'

export default function Wrapper(_ChildComponent, screenName, persistedStates) {
	return function (props) {
		class EnhancedComponent extends Component {
			screenEventListener = null
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
				BackHandler.addEventListener('hardwareBackPress', this._handleBackPress)

				this.netinfo = NetInfo.addEventListener(async ({ isConnected }) => await SnappyConnection.set_internet_connection(isConnected, this.store, persistedStates))
				
				this.screenEventListener = Navigation.events().registerComponentDidAppearListener(async ({ componentId = props.componentId }) => {
					const storedState = await getStoredState(persistConfig(persistedStates))
					await rehydrate(this.store, storedState)
				})

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