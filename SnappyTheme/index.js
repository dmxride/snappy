import { getCurrentStore } from '../index'

export const set = (theme) => {
	return new Promise(async resolve => {
		const snappyStore = getCurrentStore()
		snappyStore._store.dispatch(snappyStore._actions['set_theme'](theme))
		await snappyStore._persistor.flush()
		resolve()
	})
}
