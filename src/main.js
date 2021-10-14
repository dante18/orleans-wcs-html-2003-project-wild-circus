import 'bootstrap'
import './assets/scss/main.scss'
import { Variables } from './assets/js/variables'

if (document.querySelector(Variables.contact.form.id)) {
  import(/* webpackMode: "eager" */ './assets/js/modules/formManager/contactFormManager').then(module => {
    module.contactFormManager.contactFormManager()
  })
}

if (document.getElementsByClassName(Variables.header.navbar.id)) {
  import(/* webpackMode: "eager" */ './assets/js/modules/navbarManager/navbarManager').then(module => {
    module.Navbar.eventManager()
  })
}

if (document.getElementsByClassName(Variables.btnBackToTop.linkClassName)) {
  import(/* webpackMode: "eager" */ './assets/js/modules/btnBackToTop/btnBackToTopManager').then(module => {
    module.btnBackToTopManager.eventManager()
  })
}
