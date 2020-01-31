import i18next from 'i18next';
import * as RNLocalize from "react-native-localize";
import { getCurrentStore } from '../index'

export default async (resources) => {
  const snappyStore = getCurrentStore()
  const state = snappyStore._store.getState()
  const storeLang = state.locale

  await i18next.init({
    lng: storeLang || RNLocalize.getLocales()[0].languageTag,
    debug: true,
    resources: resources
  })

  return i18next
}