import { Variables } from '../variables'
import Form from '../classes/form/form'

export const contactFormManager = {
  contactFormManager () {
    const form = new Form(Variables.contact.form.id, Variables.contact.form.inputCustomClass)
    let numberFieldCompleted = 0

    /** Check if all fields are filled to activate the form button **/
    form.getAllFieldForm().forEach((field) => {
      field.addEventListener('change', (event) => {
        if (form.fieldIsEmpty(event.target) > 0) {
          numberFieldCompleted += 1
        } else {
          numberFieldCompleted -= 1
        }

        if (numberFieldCompleted === form.getAllFieldForm().length) {
          document.querySelector(Variables.contact.form.btnFormId).disabled = false
        } else {
          document.querySelector(Variables.contact.form.btnFormId).disabled = true
        }
      })
    })

    document.querySelector(Variables.contact.form.btnFormId).addEventListener('click', (event) => {
      event.preventDefault()
      form.submit()
    })
  }
}
