document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const handlerData = urlParams.get('handler');

  // Determine which page is currently active
  const currentPage = window.location.pathname;

  if (handlerData) {
    if (currentPage.includes('index.html')) {
      console.log("Index page handler data:", handlerData);
      alert(`Index Page Data: ${handlerData}`);
    } else if (currentPage.includes('5band.html')) {
      console.log("5-Band page handler data:", handlerData);
      alert(`5-Band Page Data: ${handlerData}`);
    } else if (currentPage.includes('privacy-policy.html')) {
      console.log("Privacy policy page handler data:", handlerData);
      alert(`Privacy Policy Page Data: ${handlerData}`);
    } else {
      console.log("Handler data received, but page not recognized:", handlerData);
    }
  }
});
