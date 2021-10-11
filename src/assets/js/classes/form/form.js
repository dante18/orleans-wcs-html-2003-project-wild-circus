import { Variables } from '../../variables'
import { contactFormManager } from '../../modules/contactFormManager'

class Form {
  constructor (formId, fieldClass) {
    this.formId = formId
    this.fieldClass = fieldClass
  }

  /**
   * Checks if a field is completed
   *
   * @param field
   * @returns {*}
   */
  fieldIsEmpty (field) {
    return this.getFieldValue(field).length
  }

  /**
   * Retrieve the content of a field
   *
   * @param field
   * @returns {*}
   */
  getFieldValue (field) {
    return field.value
  }

  /**
   * List the fields of a form
   *
   * @returns {NodeListOf<*>}
   */
  getAllFieldForm () {
    return document.querySelectorAll(this.fieldClass)
  }

  /**
   * Format the form data
   *
   * @returns {FormData}
   */
  getFormData () {
    return new FormData(document.querySelector(this.formId))
  }

  /**
   * Performs an Ajax request
   *
   * @param request
   * @param form
   */
  sendRequest (request, form) {
    fetch(request)
      .then(function (response) {
        if (response.ok) {
          return response.json()
        }
      })
      .then(function (data) {
        if (data.response.message === 'Success') {
          document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = 'Your message has been sent.'
          document.querySelector(Variables.contact.form.notification.id).classList.add('alert-success')
          document.querySelector(Variables.contact.form.notification.id).classList.remove('d-none')

          form.reset()
          document.querySelector(Variables.contact.form.btnFormId).disabled = true
          contactFormManager.contactFormManager()
        }
      })
      .catch(function (error) {
        document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = error
        document.querySelector(Variables.contact.form.notification.id).classList.add('alert-danger')

        if (document.querySelector(Variables.contact.form.notification.contentCssClass).innerText.indexOf('SyntaxError') === -1) {
          document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = 'Sorry, an error was encountered.'
        }

        if (document.querySelector(Variables.contact.form.notification.contentCssClass).innerText.indexOf('TypeError') === -1) {
          document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = 'Sorry, an error was encountered.'
        }

        document.querySelector(Variables.contact.form.notification.id).classList.remove('d-none')
      })
  }

  /**
   * Submit a form
   */
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
