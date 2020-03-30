import { getStoredState } from 'redux-persist'
import persistConfig from '../SnappyStore/store/persistConfig'
import { rehydrate } from '../SnappyStore/store/rehydrate'

export const set_internet_connection = (isConnected, snappyStore, persistedStates = {}) => {	
	return new Promise(async resolve => {
		const { offline } = await snappyStore._store.getState()
		
		if (
			!snappyStore ||
			offline === undefined || 
			(offline === !isConnected)
		) return
		
		snappyStore._store.dispatch(snappyStore._actions['set_offline'](!isConnected))
		await snappyStore._persistor.flush()

		const storedState = await getStoredState(persistConfig(persistedStates))
		await rehydrate(snappyStore, storedState)
		resolve()
	})
}


