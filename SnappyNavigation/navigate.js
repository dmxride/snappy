import { Navigation } from 'react-native-navigation'
import { screenDefaultOptions } from 'src/ui/theme'

prevScreen = null

export const resetPrevScreen = () => {
	prevScreen = null
}

singleNavigation = func => func()

setNavigationRoot = (navtree, defaultOptions) => {
	defaultOptions && Navigation.setDefaultOptions(defaultOptions)

	Navigation.setRoot({
		root: navtree
	})

}

goToNavigation = (screen, props = {}, options = {}, defaultOptions = screenDefaultOptions) => {
	setNavigationRoot({
		stack: {
			children: [
				screen(props, options)
			]
		}
	}, defaultOptions)
}

goToNavigationModal = (screen, props = {}, options = screenDefaultOptions, cb) => {
	if (prevScreen !== screen) {

		prevScreen = screen

		singleNavigation(() => {
			props.onPassProp = (data) => {
				cb && cb(data)
			}
			Navigation.showModal({
				stack: {
					children: [
						screen(props, options)
					]
				}
			})
		})
	}

}

dismissNavigationModal = (id, props = {}) => {
	prevScreen = null
	props.onPassProp && props.onPassProp(props)
	Navigation.dismissModal(id);
}

goToTabNavigation = (tabs, props, defaultOptions) => {
  /*tabs = [{
    screen,
    options
  }]*/

	setNavigationRoot({
		bottomTabs: {
			children: tabs(props.idiom).map(tab =>
				tab.screen(props, tab.options)
			)
		}
	}, defaultOptions)

}

goToCustomTabNavigation = (tab, tabs, props, defaultOptions = screenDefaultOptions) => {
	setNavigationRoot({
		bottomTabs: {
			children: tabs.map(tab =>
				tab.screen(props, tab.options)
			)
		}
	}, defaultOptions)

	Navigation.showOverlay(tab(props));
}

showOverlay = (screen, props = {}, options = {}) => {
	if (prevScreen !== screen) {
		prevScreen = screen
		singleNavigation(() => Navigation.showOverlay(screen(props, options)))
	}
}

dismissOverlay = (id) => {
	prevScreen = null
	Navigation.dismissOverlay(id)
}

goToScreen = (screen, props, options = {}) => {
	if (prevScreen !== screen) {
		prevScreen = screen
		singleNavigation(() => Navigation.push(props.componentId, screen(props), options))
	}
}

goBack = (id, options = {}) => {
	prevScreen = null
	Navigation.pop(id, options)
}

goBackTo = id => {
	prevScreen = null
	Navigation.popTo(id)
}

goToRoot = id => {
	prevScreen = null
	Navigation.popToRoot(id)
}

export default {
	goToNavigation,
	goToNavigationModal,
	dismissNavigationModal,
	goToTabNavigation,
	goToCustomTabNavigation,
	goToScreen,
	showOverlay,
	dismissOverlay,
	goBack,
	goBackTo,
	goToRoot
}