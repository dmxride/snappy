import { SnappyEffects } from './index'
import { getCurrentStore } from './index'
import i18n from 'i18next'

export const snappyReducers = {
	theme: [{}, {
		set_theme: (state, payload) => payload
	}, true],
	locale: [null, {
		set_locale: (state, payload) => payload
	}, true]
}

export const snappySagas = {
	change_locale: (type, actions) => SnappyEffects.takeEvery(type, function* ({ payload }) {
		i18n.changeLanguage(payload)
		yield SnappyEffects.putResolve(actions.set_locale(payload))
		const snappyStore = getCurrentStore()
		yield SnappyEffects.call(snappyStore._persistor.flush)
	})
}