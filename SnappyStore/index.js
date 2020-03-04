import Store from './store'
import { snappyReducers, snappySagas } from '../logic'

import Navigate from '../SnappyNavigation/navigate'

export default class SnappyStore {
	constructor({ reducers, sagas }) {
		this.types = []
		this.actions = {}
		this.reducers = null
		this.persistedStates = []
		this.sagas = null

		const { store, persistor } = Store({ reducers: this.reducers, sagas: this.sagas, persist: this.persistedStates })
		
		this.setStore(reducers, sagas, persistor)

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

		// Due to multiple stores logic,
		// we do not have a good way to presist data 
		// from others stores.  
		let globalPersistor = []

		if (reducers.globalPersistor) {
			globalPersistor = reducers.globalPersistor
			delete reducers.globalPersistor
		}

		for (let reducerKey in reducers) {
			initialState[reducerKey] = reducers[reducerKey][0]
			const actions = reducers[reducerKey][1]

			for (let actionKey in actions) {
				reducerFnc[reducerKey] = {}
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
						await this.persistor.flush()
						return Navigate
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

		//set the persistedState
		for (let reducerKey in reducers) {
			//if 3rd parameter is true then persist data in memory
			if (!this.persistedStates.includes(reducerKey) && reducers[reducerKey][2]) {
				this.persistedStates.push(reducerKey)
			}
		}

		// Integrate presistedState with global presist
		if (globalPersistor && globalPersistor.length) {
			globalPersistor = [ ...this.persistedStates, ...globalPersistor ]
			globalPersistor = new Set(globalPersistor)
			this.persistedStates = [ ...globalPersistor ]
		}
		

		//set reducer general function
		this.reducers = (state = initialState, action) => {
			let payload = {}
			let actionKey = action.type.toLowerCase()
			//find the states for this action
			for (let reducerKey in reducers) {
				if (reducerFnc[reducerKey][actionKey]) {
					if (reducers[reducerKey][1][actionKey]) {
						payload[reducerKey] = reducerFnc[reducerKey][actionKey](state, action.payload)
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
