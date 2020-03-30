import { StyleSheet } from 'react-native'

export default StyleSheet.create({
	root: backgroundColor => ({
		backgroundColor,
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0,
  }),
  bar: backgroundColor => ({
    backgroundColor,
    width: 60,
    height: 5,
		borderRadius: 5,
		marginVertical: 16
  }),
	wrapper: {
		position: 'absolute',
		top: 0,
		left: 0,
		bottom: 0,
		right: 0
	},
	container: (backgroundColor, minHeight) => ({
		backgroundColor,
		width: '100%',
		minHeight,
		position: 'absolute',
		bottom: 0,
		right: 0,
		left: 0,
		alignItems: 'center',
		borderTopLeftRadius: 6,
		borderTopRightRadius: 6
	})
})