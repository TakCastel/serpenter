// Plugin pour optimiser le chargement des composants volumineux
export default defineNuxtPlugin(() => {
  // Optimisation du chargement des composants lourds
  if (process.client) {
    // Lazy loading des composants volumineux
    const observerOptions = {
      rootMargin: '50px',
      threshold: 0.1
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          // Charger les composants quand ils deviennent visibles
          const target = entry.target as HTMLElement
          if (target.dataset.lazy) {
            target.classList.add('loaded')
          }
        }
      })
    }, observerOptions)

    // Observer les éléments avec data-lazy
    document.addEventListener('DOMContentLoaded', () => {
      const lazyElements = document.querySelectorAll('[data-lazy]')
      lazyElements.forEach((el) => observer.observe(el))
    })
  }
})
