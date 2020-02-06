import React, { useState, useEffect } from 'react'

import * as snappyValidations from './validations'

const SnappyForm = ({ children, initialValues, validations }) => {

	const [values, setValues] = useState({});
	const [error, setErrors] = useState({});
	const [success, setSuccess] = useState({});

	useEffect(() => {
		setValues(initialValues)
	}, []);

	const setValue = (field, value) => {
		validations && validateField(field, value, validations)
		values[field] = value

		setValues({ ...values })
	}

	const submit = (value) => {
	}

	const validateField = (field, value, requestedValidations) => {
		const fieldValidations = requestedValidations[field][1]

		for (validationKey in fieldValidations) {
			const successMessage = requestedValidations[field][0].success
			const errorMessage = fieldValidations[validationKey].error

			//if gives error else
			if (!snappyValidations[validationKey](value)) {
				error[field] = errorMessage
				delete success[field]
			} else {
				delete error[field]
				success[field] = successMessage
			}
		}

		setErrors({ ...error })
		setSuccess({ ...success })
	}

	const validateAll = (value, requestedValidations) => {
		for (field in requestedValidations) {
			const fieldValidations = requestedValidations[field][1]

			for (validationKey in fieldValidations) {
				const successMessage = fieldValidations[validationKey][0].success
				const errorMessage = fieldValidations[validationKey].error

				//if gives error else
				if (!snappyValidations[validationKey](value)) {
					error[field] = errorMessage
					delete success[field]
				} else {
					delete error[field]
					success[field] = successMessage
				}

			}
		}

		setErrors({ ...error })
		setSuccess({ ...success })
	}

	return children({
		setValue: (field, value) => setValue(field, value),
		onSubmit: () => submit(),
		values,
		error,
		success
	})
}

export default SnappyForm