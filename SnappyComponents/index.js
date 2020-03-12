import SnappyPopup from '../SnappyComponents/Popup'
import SnappyToast from '../SnappyComponents/Toast'
import SnappyLoader from '../SnappyComponents/Loader'
import SnappyBottomDraw from '../SnappyComponents/BottomDraw'

import Navigate from '../SnappyNavigation/navigate'

export const screens = {
	SNAPPY_POPUP: {
		id: 'SnappyPopup',
		component: SnappyPopup,
		structure: (props, options = {}) => ({
			component: {
				id: 'SnappyPopup',
				name: 'SnappyPopup',
				passProps: {
					...props
				}
			}
		})
	},
	SNAPPY_LOADER: {
		id: 'SnappyBottomDraw',
		component: SnappyBottomDraw,
		structure: (props, options = {}) => ({
			component: {
				id: 'SnappyBottomDraw',
				name: 'SnappyBottomDraw',
				passProps: {
					...props
				}
			}
		})
	},
	SNAPPY_BOTTOMDRAW: {
		id: 'SnappyLoader',
		component: SnappyLoader,
		structure: (props, options = {}) => ({
			component: {
				id: 'SnappyLoader',
				name: 'SnappyLoader',
				passProps: {
					...props
				}
			}
		})
	},
	SNAPPY_TOAST: {
		id: 'SnappyToast',
		component: SnappyToast,
		structure: (props, options = {}) => ({
			component: {
				id: 'SnappyToast',
				name: 'SnappyToast',
				passProps: {
					...props
				},
				options: {
					...{
						overlay: {
							interceptTouchOutside: false
						},
						layout: {
							backgroundColor: 'transparent',
						},
						screenBackgroundColor: 'transparent'
					}, ...options
				}
			}
		})
	}
}

export const Popup = props => {
	Navigate.showOverlay(screens.SNAPPY_POPUP.structure, props)
}

export const Loader = (props, cb) => {
	Navigate.showOverlay(screens.SNAPPY_LOADER.structure, {
		...props,
		passRef: (ref) => cb(ref)
	})
}

export const BottomDraw = props => {
	Navigate.showOverlay(screens.SNAPPY_POPUP.structure, props)
}

export const Toast = props => {
	Navigate.showOverlay(screens.SNAPPY_TOAST.structure, props)
}