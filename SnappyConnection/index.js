export const set_internet_connection = (isConnected, snappyStore) => {	
	return new Promise(async resolve => {
		const { offline } = await snappyStore._store.getState()

		if (
			offline === undefined || 
			(offline === !isConnected)
		) return
		
		snappyStore._store.dispatch(snappyStore._actions['set_offline'](!isConnected))
		await snappyStore._persistor.flush()
		resolve()
	})
}


