import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	root: backgroundColor => ({
		backgroundColor,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
		alignItems: 'center',
		justifyContent: 'center'
  }),
  bar: backgroundColor => ({
    backgroundColor,
    width: 60,
    height: 5,
    borderRadius: 5
  }),
	wrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	container: backgroundColor => ({
		backgroundColor,
		width: '100%',
    minHeight: 200,
    maxHeight: '100%'
	})
})