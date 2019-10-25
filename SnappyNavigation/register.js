import { Navigation } from 'react-native-navigation'
import Wrapper from './Wrapper'

export default function (screens) {
	for (let screenKey in screens) {
		Navigation.registerComponent(screens[screenKey].id, () => Wrapper(screens[screenKey].component, screens[screenKey].id))
	}

	console.info('All screens have been registered...')
}