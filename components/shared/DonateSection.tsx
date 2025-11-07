export function DonateSection() {
  const donateMethods = [
    {
      icon: '💚',
      title: 'Venmo',
      handle: '@SouthernPetsAnimalRescue',
      url: 'https://venmo.com/SouthernPetsAnimalRescue',
    },
    {
      icon: '💵',
      title: 'CashApp',
      handle: '$SouthernPetsAR',
      url: 'https://cash.app/$SouthernPetsAR',
    },
    {
      icon: '💙',
      title: 'PayPal',
      handle: 'Secure Donation',
      url: 'https://www.paypal.com/paypalme/Raesrescue',
    },
    {
      icon: '🐕',
      title: 'Amazon Wishlist',
      handle: 'Dogs & Items',
      url: 'https://www.amazon.com/hz/wishlist/ls/1N6JJ14LSVAAR',
    },
    {
      icon: '🐱',
      title: 'Amazon Wishlist',
      handle: 'Cat Items',
      url: 'https://www.amazon.com/hz/wishlist/ls/1MKVIZ4UIG78O',
    },
  ]

  return (
    <section className="py-16 px-5 bg-gray-50">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          Support Our Mission
        </h2>
        <p className="text-gray-600 mb-10 text-lg">
          Every donation helps us save more lives and provide essential services
          to animals in need throughout Acadia Parish
        </p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5">
          {donateMethods.map((method) => (
            <a
              key={method.title + method.handle}
              href={method.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-6 rounded-xl shadow-md hover:bg-gray-900 hover:text-white hover:-translate-y-1 transition-all duration-300 border-2 border-transparent hover:border-gray-900 group"
            >
              <div className="text-3xl mb-3">{method.icon}</div>
              <div className="font-semibold mb-1">{method.title}</div>
              <div className="text-xs opacity-80">{method.handle}</div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
