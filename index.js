/**
 * Snappy
 *
 * @author <csilva@ubiwhere.com>
 *
 * @format
 * @flow
 */

import React from 'react'
import { Provider, connect } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { Navigation } from 'react-native-navigation'
import * as SagasEffects from 'redux-saga/effects'

import Navigate from './SnappyNavigation/navigate'
import RegisterScreens from './SnappyNavigation/register'

import SnappyStore from './SnappyStore'
import * as SnappyTheme from './SnappyTheme'
import * as _SnappyComponents from './SnappyComponents'
import * as SnappyTranslations from './SnappyTranslations'

// SNAPPY GLOBALS 
let screens = {}
let _currentStore
let i18n

// SNAPPY EXPORTS 
export const SnappyEffects = SagasEffects

export const SnappyComponents = _SnappyComponents

export const SnappyNavigation = {
	//initialized in appStartup
	RegisterScreens: async (_screens, theme, translations) => {
		RegisterScreens(_screens)

		try {
			//save the main theme before navigating to the startScreen
			await SnappyTheme.set(theme)
			i18n = await SnappyTranslations(translations)
		} catch (err) {
			console.log("Translations error: ", err)
		}

		let startScreen = null

		for (let screenKey in _screens) {
			screens[screenKey] = _screens[screenKey].structure

			if (_screens[screenKey].startUp) {
				startScreen = screens[screenKey]
			}
		}

		Navigation.events().registerAppLaunchedListener(() => Navigate.goToNavigation(startScreen))
	}
}

class SnappyInstance {
	constructor({ sagas, reducers }, WrappedComponent) {
		this.snappyStore = new SnappyStore({ sagas, reducers })
		_currentStore = this.snappyStore

		this.actions = {}
		this.navigate = Navigate
		this.screens = screens

		return this.setComponent(WrappedComponent)
	}

	setComponent(WrappedComponent) {
		//assign action to store dispatcher
		for (let actionKey in this.snappyStore._actions) {
			this.actions[actionKey] = (payload) => this.snappyStore._store.dispatch(this.snappyStore._actions[actionKey](payload))
		}

		const mapStateToProps = state => {
			return { ...state }
		}

		const ConnectedComponent = connect(mapStateToProps, null)(WrappedComponent)

		return (() =>
			<Provider store={this.snappyStore._store}>
				<PersistGate loading={null} persistor={this.snappyStore._persistor}>
					<ConnectedComponent
						actions={this.actions}
						navigate={this.navigate}
						screens={this.screens}
						i18n={i18n}
					/>
				</PersistGate>
			</Provider>
		)
	}
}

//export a reference of the currently existing store
export const getCurrentStore = () => _currentStore

//create new instance of Snappy to avoid decontextualization
export default ({ sagas, reducers }) => (WrappedComponent) => new SnappyInstance({ sagas, reducers }, WrappedComponent)
