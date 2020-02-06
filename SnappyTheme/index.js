
export const set = (theme, snappyStore) => {
	return new Promise(async resolve => {
		snappyStore._store.dispatch(snappyStore._actions['set_theme'](theme))
		await snappyStore._persistor.flush()
		resolve()
	})
}
