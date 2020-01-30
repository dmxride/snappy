import { Navigation } from 'react-native-navigation'

import * as SnappyComponents from '../SnappyComponents'

import Wrapper from './Wrapper'

export default function (screens) {
	for (let screenKey in screens) {
		Navigation.registerComponent(screens[screenKey].id, () => Wrapper(screens[screenKey].component, screens[screenKey].id))
	}

	for (let screenKey in SnappyComponents.screens) {
		Navigation.registerComponent(SnappyComponents.screens[screenKey].id, () => Wrapper(SnappyComponents.screens[screenKey].component, SnappyComponents.screens[screenKey].id))
	}

	console.info('All screens have been registered...')
}