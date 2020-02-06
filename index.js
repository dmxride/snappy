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
import i18n from 'i18next'

import Navigate from './SnappyNavigation/navigate'
import RegisterScreens from './SnappyNavigation/register'

import SnappyStore from './SnappyStore'
import * as _SnappyComponents from './SnappyComponents'
import _SnappyForm from './SnappyForm'

// SNAPPY GLOBALS 
let screens = {}
let startScreenId = null
let theme = null
let translations = null
let finishedCallback = null

// SNAPPY EXPORTS 
export const SnappyEffects = SagasEffects

export const SnappyForm = _SnappyForm

export const SnappyComponents = _SnappyComponents

export const SnappyNavigation = {
	//initialized in appStartup
	RegisterScreens: (_screens, _theme, _translations, _finishedCallback) => {
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
	}
}

class SnappyInstance {
	constructor({ sagas, reducers }, WrappedComponent) {
		this.actions = {}
		this.navigate = Navigate
		this.screens = screens
		this.sagas = sagas
		this.reducers = reducers

		return this.setComponent(WrappedComponent)
	}

	setComponent(WrappedComponent) {
		return (props, cb) => {

			this.snappyStore = new SnappyStore({ sagas: this.sagas, reducers: this.reducers })

			//assign action to store dispatcher
			for (let actionKey in this.snappyStore._actions) {
				this.actions[actionKey] = (payload) => this.snappyStore._store.dispatch(this.snappyStore._actions[actionKey](payload))
			}

			const mapStateToProps = state => {
				return { ...state }
			}

			const ConnectedComponent = connect(mapStateToProps, null)(WrappedComponent)

			//THIS HAPPENS IN REGISTERING SCREENS BEFORE NAVIGATION 
			//AND SETS PARAMETERS AFTER COMPONENTDIDMOUNT
			cb(startScreenId, theme, translations, this.snappyStore, finishedCallback)

			return (() =>
				<Provider store={this.snappyStore._store}>
					<PersistGate loading={null} persistor={this.snappyStore._persistor}>
						<ConnectedComponent
							actions={this.actions}
							navigate={this.navigate}
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
export default ({ sagas, reducers }) => (WrappedComponent) => new SnappyInstance({ sagas, reducers }, WrappedComponent)
