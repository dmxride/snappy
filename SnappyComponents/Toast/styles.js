import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	root: bottom => {
		if (bottom) return {
			backgroundColor: 'red',
			height: 42,
			position: 'absolute',
			bottom: 0,
			left: 0,
			right: 0,
			alignItems: 'center',
			justifyContent: 'center'
		}

		return {
			backgroundColor: 'red',
			height: 42,
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			alignItems: 'center',
			justifyContent: 'center'
		}
	},
	message: {
		color: '#fff',
		fontSize: 12
	}
})