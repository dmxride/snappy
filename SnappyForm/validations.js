export const isRequired = (value) => {
	if (!value) return false
	//check for whiteSpacees or empty
	const regex = /^$|\s+/
	return !regex.test(value);
}

export const isEmail = (value) => {
	const regex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
	return regex.test(value);
}

export const isNumber = (value) => {
	if (!value) return false
	return !isNaN(parseFloat(value))
}