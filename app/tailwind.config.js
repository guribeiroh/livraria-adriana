animation: {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'slide-up': 'slideUp 0.3s ease-in-out',
  'slide-down': 'slideDown 0.3s ease-in-out',
  'bounce-in': 'bounceIn 0.5s ease-in-out',
  'cart-pulse': 'cartPulse 0.6s ease-in-out',
},
keyframes: {
  fadeIn: {
    '0%': { opacity: '0' },
    '100%': { opacity: '1' },
  },
  slideUp: {
    '0%': { transform: 'translateY(100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  slideDown: {
    '0%': { transform: 'translateY(-100%)', opacity: '0' },
    '100%': { transform: 'translateY(0)', opacity: '1' },
  },
  bounceIn: {
    '0%': { transform: 'scale(0.8)', opacity: '0' },
    '80%': { transform: 'scale(1.1)', opacity: '0.8' },
    '100%': { transform: 'scale(1)', opacity: '1' },
  },
  cartPulse: {
    '0%': { transform: 'scale(1)' },
    '50%': { transform: 'scale(1.1)' },
    '100%': { transform: 'scale(1)' },
  },
}, 