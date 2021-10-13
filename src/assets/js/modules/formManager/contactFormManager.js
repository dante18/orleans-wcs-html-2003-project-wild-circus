import { Variables } from '../variables'
import Form from '../classes/form/form'

export const contactFormManager = {
  contactFormManager () {
    const form = new Form(Variables.contact.form.id, Variables.contact.form.inputCustomClass)

    /** Hide the previous notification following a previous send of the form **/
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

    document.querySelector(Variables.contact.form.btnFormId).addEventListener('click', (event) => {
      event.preventDefault()
      form.submit()
    })
  }
}
