import 'bootstrap'
import './assets/scss/main.scss'
import { Variables } from './assets/js/variables'

if (document.querySelector(Variables.contact.form.id)) {
  import(/* webpackMode: "eager" */ './assets/js/modules/formManager/contactFormManager').then(module => {
    module.contactFormManager.contactFormManager()
  })
}
