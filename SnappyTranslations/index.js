import i18next from 'i18next';
import * as RNLocalize from "react-native-localize";
import AsyncStorage from '@react-native-community/async-storage'

export default (resources, snappyStore) => {
	return new Promise(async resolve => {
		try {
			const storageData = await AsyncStorage.getItem("persist:root");
			let locale = null
			if (storageData) {
				locale = storageData.locale
			}

			let localize = RNLocalize.getLocales()[0].languageTag
			locale = locale || localize

			await i18next.init({
				lng: locale,
				debug: true,
				resources: resources
			})

			snappyStore._store.dispatch(snappyStore._actions['set_locale'](locale))
			await snappyStore._persistor.flush()

			resolve()

		} catch (error) {
			// Error retrieving data
			resolve()
			console.log("Language set error -> ", error)
		}
	})
}
