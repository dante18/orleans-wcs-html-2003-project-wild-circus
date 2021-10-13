import Form from './form'
import { Variables } from '../../variables'
import Http from '../http/http'

class contactForm extends Form {
  /**
   * Checks if a field is valid
   *
   * @param field
   * @returns {boolean}
   */
  checkFieldIsValid (field) {
    if (this.getFieldType(field) === 'INPUT') {
      if (field.type === 'email') {
        if (this.getFieldValue(field).indexOf('@') > -1) {
          return true
        } else {
          return false
        }
      } else {
        if (this.getFieldValue(field).length > 0) {
          return true
        } else {
          return false
        }
      }
    } else if (this.getFieldType(field) === 'TEXTAREA') {
      if (this.getFieldValue(field).length > 0) {
        return true
      } else {
        return false
      }
    }
  }

  /**
   * Retrieve the form fields
   *
   * @returns {NodeListOf<Element>}
   */
  getAllFieldForm () {
    return document.querySelectorAll(Variables.contact.form.inputCustomClass)
  }

  /**
   * Processes the sending of the form
   *
   * @param form
   */
  submit (form) {
    super.submit()

    const httpClient = new Http()
    const fieldList = this.getAllFieldForm()
    const formErrors = []

    fieldList.forEach((field) => {
      if (this.checkFieldIsValid(field) === false) {
        formErrors.push('The field is ' + field.name + ' invalid')
      }
    })

    if (formErrors.length === 0) {
      httpClient.fetchData((data) => {
        if (data.response.message === 'Success') {
          document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = 'Your message has been sent.'
          document.querySelector(Variables.contact.form.notification.id).classList.add('alert-success')
          document.querySelector(Variables.contact.form.notification.id).classList.remove('d-none')

          form.reset()
          window.setTimeout(() => {
            if (document.querySelector(Variables.contact.form.notification.id).classList.contains('alert-success')) {
              document.querySelector(Variables.contact.form.notification.id).classList.remove('alert-success')
              document.querySelector(Variables.contact.form.notification.id).classList.add('d-none')
            }

            if (document.querySelector(Variables.contact.form.notification.id).classList.contains('alert-danger')) {
              document.querySelector(Variables.contact.form.notification.id).classList.remove('alert-danger')
              document.querySelector(Variables.contact.form.notification.id).classList.add('d-none')
            }
          }, 3000)
        } else if (data.response.message === 'Error') {
          let contentError = '<ul>'

          data.response.incorrectFields.forEach((error) => {
            contentError += '<li>' + error + '</li>'
          })

          contentError += '</ul>'

          document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = contentError
          document.querySelector(Variables.contact.form.notification.id).classList.add('alert-danger')
          document.querySelector(Variables.contact.form.notification.id).classList.remove('d-none')
        }
      }, httpClient.request(form.action, form.method, this.getFormData(form)))
    } else {
      let content = '<ul>'

      formErrors.forEach((error) => {
        content += '<li>' + error + '</li>'
      })

      content += '</ul>'

      document.querySelector(Variables.contact.form.notification.contentCssClass).innerHTML = content
      document.querySelector(Variables.contact.form.notification.id).classList.add('alert-danger')
      document.querySelector(Variables.contact.form.notification.id).classList.remove('d-none')
    }
  }
}

export default contactForm
