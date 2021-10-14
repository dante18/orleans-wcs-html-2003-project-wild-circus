import { Variables } from '../../variables'
import contactForm from '../../classes/form/contactForm'

export const contactFormManager = {
  contactFormManager () {
    // eslint-disable-next-line new-cap
    const form = new contactForm()

    document.querySelector(Variables.contact.form.btnFormId).addEventListener('click', (event) => {
      event.preventDefault()
      form.submit(document.querySelector(Variables.contact.form.id))
    })
  }
}
