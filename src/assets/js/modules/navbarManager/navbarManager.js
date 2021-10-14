import { Variables } from '../../variables'

export const Navbar = {
  getAllLinks () {
    return document.querySelectorAll(Variables.header.navbar.linkClassName)
  },
  clickHandler (event) {
    if (event.delegateTarget.id === Variables.header.navbar.btnToggleId.replace('#', '')) {
      document.querySelector(Variables.header.navbar.btnToggleId).classList.toggle('is-active')
    } else if (event.delegateTarget.classList.contains(Variables.header.navbar.linkClassName)) {
      const href = event.delegateTarget.getAttribute('href')
      const offsetTop = document.querySelector(href).offsetTop

      scroll({
        top: offsetTop,
        behavior: 'smooth'
      })
    }
  },
  scrollNavbarHandler () {
    const headerNavbar = document.querySelector(Variables.header.id)
    const sticky = headerNavbar.offsetTop

    if (window.pageYOffset > sticky) {
      headerNavbar.classList.add(Variables.header.customCssClass)
    } else {
      headerNavbar.classList.remove(Variables.header.customCssClass)
    }
  },
  scrollNavbarLinkHandler () {
    const sections = document.querySelectorAll('section')
    const navbarLinks = document.querySelectorAll(Variables.header.navbar.linkClassName)

    window.onscroll = () => {
      let currentSection = ''

      /** Retrieve the current section **/
      sections.forEach((section) => {
        const sectionTop = section.offsetTop

        if (pageYOffset >= sectionTop - 60) {
          currentSection = section.getAttribute('id')
        }
      })

      navbarLinks.forEach((li) => {
        li.classList.remove('active')

        if (li.getAttribute('href') === '#' + currentSection) {
          li.classList.add('active')
        }
      })
    }
  },
  eventManager () {
    document.addEventListener('DOMContentLoaded', () => {
      document.querySelector(Variables.header.navbar.btnToggleId).addEventListener('click', (event) => {
        Navbar.clickHandler(event)
      })

      document.querySelector(Variables.header.navbar.linkClassName).addEventListener('click', (event) => {
        Navbar.clickHandler(event)
      })

      window.addEventListener('scroll', () => {
        Navbar.scrollNavbarHandler()
        Navbar.scrollNavbarLinkHandler()
      })
    })
  }
}
