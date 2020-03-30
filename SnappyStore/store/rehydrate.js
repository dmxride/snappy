export const rehydrate = (snappyStore, storedState) => {
	return new Promise(async resolve => {
		snappyStore._store.dispatch({ type: 'persist/REHYDRATE', payload: { ...storedState } })
		resolve()
	})
}
