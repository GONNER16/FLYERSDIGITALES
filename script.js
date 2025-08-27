const form = document.getElementById('contact-form');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    try {
      const response = await fetch('https://formspree.io/f/mwkgdrok', {
        method: 'POST',
        headers: {
          'Accept': 'application/json'
        },
        body: data
      });
      if (response.ok) {
        form.reset();
        status.textContent = 'Gracias por tu mensaje. Te contactaremos pronto.';
      } else {
        status.textContent = 'Ocurrió un error al enviar el formulario.';
      }
    } catch (error) {
      status.textContent = 'Ocurrió un error al enviar el formulario.';
    }
  });
}
