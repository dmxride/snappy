import i18next from 'i18next';
import * as RNLocalize from "react-native-localize";
import AsyncStorage from '@react-native-community/async-storage'
import { getCurrentStore } from '../index'

export default (resources) => {
  return new Promise(async resolve => {
    try {
      const storageData = await AsyncStorage.getItem("persist:root");
      let { locale } = storageData

      let localize = RNLocalize.getLocales()[0].languageTag
      locale = locale || localize

      const snappyStore = getCurrentStore()
      snappyStore._store.dispatch(snappyStore._actions['set_locale'](locale))
      await snappyStore._persistor.flush()

      await i18next.init({
        lng: locale,
        debug: true,
        resources: resources
      })
      resolve()

    } catch (error) {
      // Error retrieving data
      console.log("Language set error -> ", error)
    }
  })
}
