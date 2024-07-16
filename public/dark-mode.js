if (localStorage.getItem('dark-mode') === 'true') {
  document.querySelector('html').classList.add('dark')
} else {
  document.querySelector('html').classList.remove('dark')
}
