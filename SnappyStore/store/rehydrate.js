
export const rehydrate = snappyStore => {
	return new Promise(async resolve => {
		snappyStore.dispatch({
			type: 'persist/REHYDRATE'
		})
		resolve()
	})
}
