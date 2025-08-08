export default defineNuxtPlugin(() => {
  if (process.client) {
    // Injecter le script GTM dans le head
    useHead({
      script: [
        {
          children: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-KPRR33NW');`,
          type: 'text/javascript'
        }
      ],
      noscript: [
        {
          children: `<iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KPRR33NW"
height="0" width="0" style="display:none;visibility:hidden"></iframe>`
        }
      ]
    })

    // Initialiser dataLayer
    window.dataLayer = window.dataLayer || []
    
    // Fonction pour envoyer des événements personnalisés
    const gtm = {
      push(event: any) {
        if (window.dataLayer) {
          window.dataLayer.push(event)
        }
      }
    }
    
    // Exposer gtm globalement pour une utilisation dans les composants
    return {
      provide: {
        gtm
      }
    }
  }
})
