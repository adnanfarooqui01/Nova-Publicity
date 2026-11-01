document.addEventListener('DOMContentLoaded', () => {
  const nav = document.getElementById('nav');
  const slides = document.querySelectorAll('.slide');
  const capTitle = document.getElementById('capTitle');
  const capPlace = document.getElementById('capPlace');
  let current = 0;

  // Nav turns solid after the hero
  const onScroll = () => nav.classList.toggle('solid', window.scrollY > window.innerHeight - 90);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Hero slider with project caption
  const show = (i) => {
    slides[current].classList.remove('active');
    current = i % slides.length;
    slides[current].classList.add('active');
    capTitle.textContent = slides[current].dataset.title;
    capPlace.innerHTML = slides[current].dataset.place;
  };
  if (slides.length > 1 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setInterval(() => show(current + 1), 4500);
  }

  // Service hover images
  document.querySelectorAll('.services__list li').forEach((li) => {
    li.style.setProperty('--img', `url('${li.dataset.img}')`);
  });

  const servicePicker = document.querySelector('.service-picker');
  const serviceTrigger = servicePicker.querySelector('.service-picker__trigger');
  const serviceInput = servicePicker.querySelector('input[name="service"]');
  const serviceMenu = servicePicker.querySelector('.service-picker__menu');
  const serviceOptions = [...serviceMenu.querySelectorAll('[role="option"]')];
  const serviceError = servicePicker.querySelector('.service-picker__error');

  const closeServiceMenu = (returnFocus = false) => {
    serviceMenu.hidden = true;
    serviceTrigger.setAttribute('aria-expanded', 'false');
    if (returnFocus) serviceTrigger.focus();
  };

  const openServiceMenu = (focusFirst = false) => {
    serviceMenu.hidden = false;
    serviceTrigger.setAttribute('aria-expanded', 'true');
    if (focusFirst) serviceOptions[0].focus();
  };

  serviceTrigger.addEventListener('click', () => {
    if (serviceMenu.hidden) openServiceMenu();
    else closeServiceMenu();
  });

  serviceTrigger.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openServiceMenu(true);
    }
  });

  serviceOptions.forEach((option, index) => {
    option.addEventListener('click', () => {
      serviceInput.value = option.dataset.value;
      serviceTrigger.querySelector('span').textContent = option.textContent;
      serviceOptions.forEach((item) => item.setAttribute('aria-selected', String(item === option)));
      serviceTrigger.removeAttribute('aria-invalid');
      serviceError.textContent = '';
      closeServiceMenu(true);
    });

    option.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        closeServiceMenu(true);
      } else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        const offset = event.key === 'ArrowDown' ? 1 : -1;
        serviceOptions[(index + offset + serviceOptions.length) % serviceOptions.length].focus();
      }
    });
  });

  document.addEventListener('click', (event) => {
    if (!servicePicker.contains(event.target)) closeServiceMenu();
  });

  // Lightbox for portfolio images
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = lightbox.querySelector('img');
  document.querySelectorAll('.mosaic figure').forEach((fig) => {
    fig.addEventListener('click', () => {
      lightboxImg.src = fig.querySelector('img').src;
      lightbox.classList.add('show');
    });
  });
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox || e.target.classList.contains('lightbox-close')) {
      lightbox.classList.remove('show');
    }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') lightbox.classList.remove('show');
  });

  // Send enquiry details to Nova Publicity through WhatsApp.
  document.getElementById('form').addEventListener('submit', (e) => {
    e.preventDefault();
    if (!serviceInput.value) {
      serviceTrigger.setAttribute('aria-invalid', 'true');
      serviceError.textContent = 'Please select a service.';
      serviceTrigger.focus();
      return;
    }

    const formData = new FormData(e.target);
    const message = [
      'Hello Nova Publicity, I would like to enquire about your services.',
      `Name: ${formData.get('name')}`,
      `Business: ${formData.get('business')}`,
      `Phone: ${formData.get('phone')}`,
      `Service: ${formData.get('service')}`,
      `Project details: ${formData.get('details') || 'Not provided'}`
    ].join('\n');
    const whatsappUrl = `https://wa.me/916392076755?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
});