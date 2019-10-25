/**
 * Snappy
 *
 * @author <csilva@ubiwhere.com>,<ngago@ubiwhere.com>
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

let screens = {}

export const SnappyEffects = SagasEffects

export const SnappyNavigation = {
	RegisterScreens: (_screens) => {
		RegisterScreens(_screens)

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

export default ({ sagas, reducers }) => (WrappedComponent) => {
	const snappyStore = new SnappyStore({ sagas, reducers })
	this.actions = {}
	this.navigate = Navigate
	this.screens = screens

	//assign action to store dispatcher
	for (let actionKey in snappyStore._actions) {
		this.actions[actionKey] = (payload) => snappyStore._store.dispatch(snappyStore._actions[actionKey](payload))
	}

	const mapStateToProps = state => {
		return { ...state }
	}

	const ConnectedComponent = connect(mapStateToProps, null)(WrappedComponent.bind(this))

	return (() =>
		<Provider store={snappyStore._store}>
			<PersistGate loading={null} persistor={snappyStore._persistor}>
				<ConnectedComponent />
			</PersistGate>
		</Provider>
	)
}
