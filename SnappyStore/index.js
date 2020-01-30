import Store from './store'
import { snappyReducers } from '../consts'

export default class SnappyStore {
	constructor({ reducers, sagas }) {
		this.types = []
		this.actions = {}
		this.reducers = null
		this.persistedStates = []
		this.sagas = null

		this.setStore(reducers, sagas)

		const { store, persistor } = Store({ reducers: this.reducers, sagas: this.sagas, persist: this.persistedStates })

		this.store = store
		this.persistor = persistor
	}

	setStore = (reducers, sagas) => {
		//combine snappyReducers with generated reducers
		reducers = { ...reducers, ...snappyReducers }

		//for in is faster
		//set initialState and actions
		let initialState = {}
		let reducerFnc = {}

		for (let reducerKey in reducers) {
			initialState[reducerKey] = reducers[reducerKey][0]
			const actions = reducers[reducerKey][1]

			for (let actionKey in actions) {
				reducerFnc[actionKey] = actions[actionKey]
				type = actionKey.toUpperCase()

				if (!this.types.includes(type)) {
					this.types.push(type)
					this.actions[actionKey] = (payload) => ({ type: actionKey.toUpperCase(), payload })
				}
			}
		}

		//for in is faster
		//set sagas actions
		for (let sagasKey in sagas) {
			type = sagasKey.toUpperCase()

			if (!this.types.includes(type)) {
				this.types.push(type)
				this.actions[sagasKey] = (payload) => ({ type: sagasKey.toUpperCase(), payload })
			}
		}

		//set the sagas
		this.sagas = function* () {
			for (let sagasKey in sagas) {
				type = sagasKey.toUpperCase()
				yield sagas[sagasKey](type, this.actions)
			}
		}.bind(this)

		//set the persistedState
		for (let reducerKey in reducers) {
			//if 3rd parameter is true then persist data in memory
			if (!this.persistedStates.includes(reducerKey) && reducers[reducerKey][2]) {
				this.persistedStates.push(reducerKey)
			}
		}

		//set reducer general function
		this.reducers = (state = initialState, action) => {
			let payload = {}
			let actionKey = action.type.toLowerCase()

			//find the states for this action
			if (reducerFnc[actionKey]) {
				for (let reducerKey in reducers) {
					if (reducers[reducerKey][1][actionKey]) {
						payload[reducerKey] = reducerFnc[actionKey](state, action.payload)
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
