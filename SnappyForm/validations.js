const isArray = value => Array.isArray(value)
const isObject = value => !Array.isArray(value) && typeof value === 'object'

const checkCondition = (values, conditions) => {
	let hasCondition = new Set()
	
	for (condition in conditions) {

		if (isArray(values)) {

			for (value of values) {
			
				if (
					isObject(value) && 
					value[condition] &&
					value[condition] === conditions[condition]
				) hasCondition.add(condition)

			}

		}

		if (isObject(values)) {

			if (
				values[condition] && 
				values[condition] === conditions[condition]
			) hasCondition.add(condition)

		}

	}

	if (hasCondition.size !== Object.keys(conditions).length) return false
	return true
}


export const isRequired = (value, conditions) => {
	if (!value) return false
	
	//check for conditions
	if (conditions) return checkCondition(value, conditions)

	//check for whiteSpacees or empty
	//const regex = /^$|\s+/

	//check for empty string only
	const regex = /^$/
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