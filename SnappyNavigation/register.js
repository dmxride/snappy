import { Navigation } from 'react-native-navigation'

import * as SnappyComponents from '../SnappyComponents'
import { SnappyInstance } from '../index.js'

import Wrapper from './Wrapper'
import DumbWrapper from './DumbWrapper'

export default function (screens, snappyInstances, persistedStates) {

	//startUp the components instances
	for (let screenKey in screens) {

		let instance = new SnappyInstance({ 
			sagas: snappyInstances[screenKey].sagas, 
			reducers: snappyInstances[screenKey].reducers, 
			persistedStates 
		}, snappyInstances[screenKey].WrappedComponent)

		Navigation.registerComponent(screens[screenKey].id, () => Wrapper(instance, screens[screenKey].id, persistedStates))
	}

	for (let screenKey in SnappyComponents.screens) {
		Navigation.registerComponent(SnappyComponents.screens[screenKey].id, () => DumbWrapper(SnappyComponents.screens[screenKey].component, SnappyComponents.screens[screenKey].id))
	}

	console.info('All screens have been registered...')
}