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
import AsyncStorage from '@react-native-community/async-storage'
import i18n from 'i18next'

import { deepParseJson } from './utils'

import Navigate from './SnappyNavigation/navigate'
import RegisterScreens from './SnappyNavigation/register'

import SnappyStore from './SnappyStore'
import * as _SnappyComponents from './SnappyComponents'
import _SnappyForm from './SnappyForm'

// SNAPPY GLOBALS 
let snappyInstances = []
let persistedStates = []

let screens = {}
let startScreenId = null
let theme = null
let translations = null
let finishedCallback = null

// SNAPPY EXPORTS 
export const SnappyEffects = SagasEffects

export const SnappyForm = _SnappyForm

export const SnappyComponents = _SnappyComponents

export const currentStoredData = async () => {
	let storage = await AsyncStorage.getItem("persist:root")
	return deepParseJson(storage)
}

export const setStoredData = async (key, data) => {
	const storage = await currentStoredData()
	storage[key] = data

	await AsyncStorage.setItem("persist:root", JSON.stringify(storage))
	return storage
}

export const SnappyNavigation = {
	//initialized in appStartup
	registerScreens: (_screens, _theme, _translations, _finishedCallback) => {

		//startUp the components instances
		for (let instance in snappyInstances) {
			new SnappyInstance({ sagas: snappyInstances[instance].sagas, reducers: snappyInstances[instance].reducers, persistedStates }, snappyInstances[instance].WrappedComponent)
		}

		theme = _theme
		translations = _translations
		finishedCallback = _finishedCallback

		//search for the startScreen in cascading order
		let startScreen = null

		for (let screenKey in _screens) {
			screens[screenKey] = _screens[screenKey].structure

			if (_screens[screenKey].startUp) {
				startScreenId = _screens[screenKey].id
				startScreen = screens[screenKey]
			}
		}

		RegisterScreens(_screens)

		Navigation.events().registerAppLaunchedListener(() => Navigate.goToNavigation(startScreen))
	},
	navigate: Navigate,
	screens: screens
}

class SnappyInstance {
	constructor({ connectStorage, sagas, reducers }, WrappedComponent) {

		this.actions = {}
		this.navigate = Navigate
		this.screens = screens
		this.sagas = sagas
		this.reducers = reducers
		this.connectStorage = connectStorage

		return this.setComponent(WrappedComponent)
	}

	setComponent(WrappedComponent) {
		return (props, cb) => {

			this.snappyStore = new SnappyStore({ sagas: this.sagas, reducers: this.reducers, connectStorage: this.connectStorage })

			//assign action to store dispatcher
			for (let actionKey in this.snappyStore._actions) {
				this.actions[actionKey] = (payload) => this.snappyStore._store.dispatch(this.snappyStore._actions[actionKey](payload))
			}

			const mapStateToProps = state => {
				return { ...state }
			}

			const ConnectedComponent = connect(mapStateToProps, null)(WrappedComponent)

			//THIS HAPPENS WHEN REGISTERING SCREENS BEFORE NAVIGATION 
			//AND SETS PARAMETERS AFTER COMPONENTDIDMOUNT
			cb(startScreenId, theme, translations, this.snappyStore, finishedCallback)

			return (() =>
				<Provider store={this.snappyStore._store}>
					<PersistGate loading={null} persistor={this.snappyStore._persistor}>
						<ConnectedComponent
							actions={this.actions}
							navigate={async () => {
								await this.snappyStore._persistor.flush()
								return this.navigate
							}}
							screens={this.screens}
							i18n={i18n}
							{...props}
						/>
					</PersistGate>
				</Provider>
			)

		}
	}
}

//create new instance of Snappy to avoid decontextualization
export default ({ sagas, reducers }) => (WrappedComponent) => {

	//set the persistedState
	for (let reducerKey in reducers) {
		//if 3rd parameter is true then persist data in memory
		if (!persistedStates.includes(reducerKey) && reducers[reducerKey][2]) {
			persistedStates.push(reducerKey)
		}
	}

	snappyInstances.push({ sagas, reducers, WrappedComponent })
}
