class Form {
  getFieldValue (field) {
    return field.value
  }

  getFieldType (field) {
    return field.nodeName
  }

  getFormData (form) {
    return new FormData(form)
  }

  submit () {}
}

export default Form
