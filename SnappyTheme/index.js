import { getCurrentStore } from '../index'

export const set = (theme) => {
	const snappyStore = getCurrentStore()
	snappyStore._store.dispatch(snappyStore._actions['set_theme'](theme))
}
