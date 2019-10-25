import Store from './store'

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
					//@TODO check using type is not working for some reason
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
				//@TODO check using type is not working for some reason
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

		//set reducers
		this.reducers = (state = initialState, action) => {
			let payload = {}

			for (let reducerKey in reducers) {
				const actions = reducers[reducerKey][1]

				//id 3rd parameter is true then persist data in memory
				if (!this.persistedStates.includes(reducerKey) && reducers[reducerKey][2]) {
					this.persistedStates.push(reducerKey)
				}

				for (let actionKey in actions) {
					payload[reducerKey] = reducerFnc[actionKey](state, action.payload)
				}
			}

			if (this.types.includes(action.type)) {
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
