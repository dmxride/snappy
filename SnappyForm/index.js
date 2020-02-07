import { useState, useEffect, useRef } from 'react'

import * as snappyValidations from './validations'

const SnappyForm = ({ children, initialValues = {}, validations }) => {
	const wasValidatedOnStart = useRef(false)
	const [values, setValues] = useState({});
	const [error, setErrors] = useState({});
	const [success, setSuccess] = useState({});
	const [isDirty, setDirty] = useState({});

	useEffect(() => {
		let fields = {}
		let dirtyFields = {}

		//get key in validations to set values
		for (field in validations) {
			fields[field] = undefined
		}

		const formFields = { ...fields, ...initialValues }

		//get key in validations to set values
		for (field in formFields) {
			if (formFields[field] !== undefined) {
				dirtyFields[field] = true
			}
		}

		setValues(formFields)
		setDirty(dirtyFields)
	}, []);

	useEffect(() => {

		if (wasValidatedOnStart.current === false && Object.keys(values).length !== 0) {
			wasValidatedOnStart.current = true
			validateAll()
		}
	}, [values]);

	const setValue = (field, value) => {
		values[field] = value

		//check if input requires onChange validation and validate
		if (validations) {
			if (validations[field]) {
				if (validations[field][0]) {
					if (validations[field][0].onChange) {
						validateField(field, value)
						setErrors({ ...error })
						setSuccess({ ...success })
					}
				}
			}
		}

		setValues({ ...values })

		if (!isDirty[field]) {
			isDirty[field] = true
			setDirty(isDirty)
		}
	}

	const validateAll = () => {
		for (field in validations) {
			//validate field if it exist in values
			values[field] && validateField(field, values[field])
		}

		setErrors({ ...error })
		setSuccess({ ...success })
	}

	const submit = (submitCallback) => {
		let invalid = false

		//check all inputs which require onSubmit validation, if error is found set invalid
		// and do not call submissionCallback
		for (field in validations) {
			if (validations) {
				if (validations[field][0].onSubmit) {
					const validField = validateField(field, values[field])

					if (!validField && !invalid) {
						invalid = true
					}

				}
			}
		}

		setErrors({ ...error })
		setSuccess({ ...success })

		if (!invalid) {
			submitCallback()
		}
	}


	const validateField = (field, value) => {
		const fieldValidations = validations[field][1]

		for (validationKey in fieldValidations) {
			const successMessage = validations[field][0].success
			const errorMessage = fieldValidations[validationKey].error

			//if gives error else
			if (!snappyValidations[validationKey](value)) {
				error[field] = errorMessage
				delete success[field]
				//validates first item if error in validations
				break
			} else {
				delete error[field]
				success[field] = successMessage
			}
		}

		if (error[field]) return false
		return true
	}

	return children({
		setValue: (field, value) => setValue(field, value),
		onSubmit: (callback) => submit(callback),
		values,
		error,
		success,
		isDirty
	})
}

export default SnappyForm