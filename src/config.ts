export default {
  // need to change sw.js too
  firebase: {
    apiKey: 'AIzaSyDee_VkrRtByJCrCZAX3nTSDPl8AaHlWfY',
    authDomain: 'traq-r.firebaseapp.com',
    databaseURL: 'https://traq-r.firebaseio.com',
    projectId: 'traq-r',
    storageBucket: 'traq-r.appspot.com',
    messagingSenderId: '993645413001',
    appId: '1:993645413001:web:b253ea3776d6cf85163c58'
  },
  skyway: {
    apiKey: '2a4e923e-2e16-4d3c-9a39-607c3f605f0a'
  },
  services: [
    {
      label: 'Portal',
      iconName: 'services/portal',
      appLink: 'https://portal.trap.jp/'
    },
    {
      label: 'Official Website',
      iconName: 'services/traP',
      appLink: 'https://trap.jp/'
    },
    {
      label: 'Wiki',
      iconName: 'services/growi',
      appLink: 'https://wiki.trap.jp/'
    },
    {
      label: 'Blog',
      iconName: 'services/ghost',
      appLink: 'https://blog-admin.trap.jp/'
    },
    {
      label: 'Drive',
      iconName: 'services/nextcloud',
      appLink: 'https://drive.trap.jp/'
    },
    {
      label: 'Git',
      iconName: 'services/gitea',
      appLink: 'https://git.trap.jp/'
    },
    {
      label: 'Showcase',
      iconName: 'services/showcase',
      appLink: 'https://showcase.trapti.tech/'
    },
    {
      label: 'HackMD',
      iconName: 'services/hackmd',
      appLink: 'https://md.trap.jp/'
    },
    {
      label: 'anke-to',
      iconName: 'services/anke-to',
      appLink: 'https://anke-to.trap.jp/'
    },
    {
      label: 'booQ',
      iconName: 'services/booq',
      appLink: 'https://booq.trap.jp/'
    },
    {
      label: 'knoQ',
      iconName: 'services/knoq',
      appLink: 'https://knoq.trap.jp/'
    },
    {
      label: 'BOT Console',
      iconName: 'services/bot-console',
      appLink: 'https://bot-console.trap.jp/'
    }
  ]
} as const
