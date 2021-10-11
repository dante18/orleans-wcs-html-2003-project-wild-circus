class Form {
  constructor (formId, fieldClass) {
    this.formId = formId
    this.fieldClass = fieldClass
  }

  fieldIsEmpty (field) {
    return this.getFieldValue(field).length
  }

  getFieldValue (field) {
    return field.value
  }

  getAllFieldForm () {
    return document.querySelectorAll(this.fieldClass)
  }

  getFormData () {
    return new FormData(document.querySelector(this.formId))
  }

  sendRequest (request, form) {
    fetch(request)
      .then(function (response) {
        if (response.ok) {
          return response.json()
        }
      })
      .then(function (data) {
        console.log(data.response.message)
        if (data.response.message === 'Success') {
          form.reset()
        }
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  submit () {
    const currentForm = document.querySelector(this.formId)
    const formData = this.getFormData()
    const formErrors = this.getAllFieldForm()
    let numberError = 0

    for (let i = 0; i < formErrors.length - 1; i++) {
      if (formErrors[i].value.length === 0) {
        numberError += 1
      }
    }

    if (numberError === 0) {
      const request = new Request(
        currentForm.action,
        {
          method: currentForm.method,
          body: formData,
          headers: new Headers({
            'X-Requested-With': 'XMLHttpRequest'
          })
        }
      )

      this.sendRequest(request, currentForm)
    } else {
      console.log('Errors detected')
    }
  }
}

export default Form
