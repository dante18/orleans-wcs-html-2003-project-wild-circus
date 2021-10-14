import { Variables } from '../../variables'

export const btnBackToTopManager = {
  clickHandler (event) {
    event.preventDefault()

    scroll({
      top: 0,
      behavior: 'smooth'
    })
  },
  scrollHandler () {
    if (window.pageYOffset > 300) {
      document.querySelector(Variables.btnBackToTop.id).classList.add('show')
    } else {
      document.querySelector(Variables.btnBackToTop.id).classList.remove('show')
    }
  },
  eventManager () {
    window.addEventListener('scroll', () => {
      btnBackToTopManager.scrollHandler()
    })

    document.querySelector(Variables.btnBackToTop.id).addEventListener('click', (event) => {
      btnBackToTopManager.clickHandler(event)
    })
  }
}
