import autoMergeLevel2 from 'redux-persist/lib/stateReconciler/autoMergeLevel2'
import AsyncStorage from '@react-native-community/async-storage'

export default (persistReducers = []) => ({
	key: 'root',
	storage: AsyncStorage,
	stateReconciler: autoMergeLevel2,
	whitelist: persistReducers,
	timeout: null
})