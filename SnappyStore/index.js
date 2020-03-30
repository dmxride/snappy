import Store from './store'
import { snappyReducers, snappySagas } from '../logic'

import Navigate from '../SnappyNavigation/navigate'

export default class SnappyStore {
	constructor({ reducers, sagas, persistedStates }) {
		this.types = []
		this.actions = {}
		this.reducers = null
		this.sagas = null

		this.setStore(reducers, sagas)
		const { store, persistor } = Store({ reducers: this.reducers, sagas: this.sagas, persist: persistedStates })

		this.store = store
		this.persistor = persistor
	}

	setStore = (reducers, sagas) => {
		//combine snappyReducers with generated reducers
		reducers = { ...reducers, ...snappyReducers }
		sagas = { ...sagas, ...snappySagas }

		//for in is faster
		//set initialState and actions
		let initialState = {}
		let reducerFnc = {}


		for (let reducerKey in reducers) {
			initialState[reducerKey] = reducers[reducerKey][0]
			reducerFnc[reducerKey] = {}
			
			const actions = reducers[reducerKey][1]

			for (let actionKey in actions) {
				reducerFnc[reducerKey][actionKey] = actions[actionKey]
				type = actionKey.toUpperCase()

				if (!this.types.includes(type)) {
					this.types.push(type)
					this.actions[actionKey] = (payload) => ({
						type: actionKey.toUpperCase(),
						payload
					})
				}
			}
		}

		//for in is faster
		//set sagas actions
		for (let sagasKey in sagas) {
			type = sagasKey.toUpperCase()

			if (!this.types.includes(type)) {
				this.types.push(type)
				this.actions[sagasKey] = (payload) => ({
					type: sagasKey.toUpperCase(),
					navigate: async () => {
						// This presistor is a reference
						if (this.persistor) {
							await this.persistor.flush()
							return Navigate
						}

						throw new Error({ message: 'undefined persistor, cannot navigate' })
					},
					payload
				})
			}
		}

		//set the sagas
		this.sagas = function* () {
			for (let sagasKey in sagas) {
				type = sagasKey.toUpperCase()
				yield sagas[sagasKey](type, this.actions)
			}
		}.bind(this)

		//set reducer general function
		this.reducers = (state = initialState, action) => {
			let payload = {}
			let actionKey = action.type.toLowerCase()
			//find the states for this action
			for (let reducerKey in reducers) {
				if (reducerFnc[reducerKey][actionKey]) {
					if (reducers[reducerKey][1][actionKey]) {
						payload[reducerKey] = reducerFnc[reducerKey][actionKey](state[reducerKey], action.payload)
					}
				}
			}

			if (payload) {
				return {
					...state,
					...payload
				}
			} else {
				return state
			}

		}

	}

	get _store() {
		return this.store
	}

	get _persistor() {
		return this.persistor
	}

	get _actions() {
		return this.actions
	}

}
