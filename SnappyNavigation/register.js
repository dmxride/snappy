import { Navigation } from 'react-native-navigation'

import * as SnappyComponents from '../SnappyComponents'

import Wrapper from './Wrapper'
import DumbWrapper from './DumbWrapper'

export default function (screens) {

	//startUp the components instances

	let i = 0;
	for (let screenKey in screens) {
		Navigation.registerComponent(screens[screenKey].id, () => Wrapper(new SnappyInstance({ sagas: snappyInstances[i].sagas, reducers: snappyInstances[i].reducers, persistedStates }, snappyInstances[i].WrappedComponent), screens[screenKey].id))
		i++
	}

	for (let screenKey in SnappyComponents.screens) {
		Navigation.registerComponent(SnappyComponents.screens[screenKey].id, () => DumbWrapper(SnappyComponents.screens[screenKey].component, SnappyComponents.screens[screenKey].id))
	}

	console.info('All screens have been registered...')
}