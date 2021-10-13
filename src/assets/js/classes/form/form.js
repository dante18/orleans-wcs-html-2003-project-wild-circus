class Form {
  /**
   * Retrieve the content of a form field
   *
   * @param field
   * @returns {*}
   */
  getFieldValue (field) {
    return field.value
  }

  /**
   * Retrieve the type of a form field
   *
   * @param field
   * @returns {string|string|*}
   */
  getFieldType (field) {
    return field.nodeName
  }

  /**
   * Format the form data
   *
   * @param form
   * @returns {FormData}
   */
  getFormData (form) {
    return new FormData(form)
  }
}

export default Form
