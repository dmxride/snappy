export const snappyReducers = {
	theme: [{}, {
		set_theme: (state, payload) => payload
	}, true],
	locale: [{}, {
		set_locale: (state, payload) => payload
	}, true]
}