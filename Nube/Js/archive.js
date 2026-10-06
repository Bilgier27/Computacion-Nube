/* ============================================================
   archive.js — JavaScript central del sitio Computación Nube
   Proyecto académico interactivo & tecnológico
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. BOTÓN VOLVER ARRIBA (Back-to-top)
    ---------------------------------------------------------- */
    function initBackToTop() {
        var btn = document.getElementById('back-to-top');
        if (!btn) return;

        window.addEventListener('scroll', function () {
            if (window.scrollY > 300) {
                btn.classList.add('visible');
            } else {
                btn.classList.remove('visible');
            }
        }, { passive: true });

        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------
       2. NAVBAR — Sombra al desplazarse y ScrollSpy visual
    ---------------------------------------------------------- */
    function initNavbar() {
        var nav = document.querySelector('.navbar');
        if (!nav) return;

        function updateScroll() {
            if (window.scrollY > 20) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
        updateScroll();
        window.addEventListener('scroll', updateScroll, { passive: true });

        // ScrollSpy básico para resaltar la sección activa en el menú (solo en la página principal)
        var isHomePage = !!document.getElementById('carouselMain');
        if (!isHomePage) return;

        var sections = document.querySelectorAll('section[id], header[id]');
        var navLinks = document.querySelectorAll('.navbar-nav .nav-link');

        function updateActiveLink() {
            var scrollPosition = window.scrollY + 140;

            sections.forEach(function (sec) {
                var top = sec.offsetTop;
                var height = sec.offsetHeight;
                var id = sec.getAttribute('id');

                if (scrollPosition >= top && scrollPosition < top + height) {
                    navLinks.forEach(function (link) {
                        var href = link.getAttribute('href');
                        if (href === '#' + id || (id === 'services' && href === '#services')) {
                            link.classList.add('active');
                        } else if (href && href.startsWith('#')) {
                            link.classList.remove('active');
                        }
                    });
                }
            });

            // Si está muy cerca de la parte superior, marcar "Inicio"
            if (window.scrollY < 200) {
                navLinks.forEach(function (link) {
                    if (link.getAttribute('href') === 'bil.html') {
                        link.classList.add('active');
                    } else if (link.getAttribute('href') && link.getAttribute('href').startsWith('#')) {
                        link.classList.remove('active');
                    }
                });
            }
        }

        window.addEventListener('scroll', updateActiveLink, { passive: true });
    }

    /* ----------------------------------------------------------
       3. APARICIÓN SUAVE EN SCROLL (Intersection Observer)
    ---------------------------------------------------------- */
    function initFadeIn() {
        var elements = document.querySelectorAll('.fade-in-el');
        if (!elements.length) return;

        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('visible'); });
            return;
        }

        function reveal(el) {
            var done = false;
            function finish(e) {
                if (done || (e && e.target !== el)) return;
                done = true;
                el.removeEventListener('transitionend', finish);
                el.classList.remove('fade-in-el');
                el.style.transitionDelay = '';
            }
            el.addEventListener('transitionend', finish);
            setTimeout(finish, 1200);
            el.classList.add('visible');
        }

        var observer = new IntersectionObserver(function (entries) {
            var batch = 0;
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.style.transitionDelay = Math.min(batch * 80, 400) + 'ms';
                    batch++;
                    reveal(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        elements.forEach(function (el) { observer.observe(el); });
    }

    /* ----------------------------------------------------------
       4. FILTRO DE NUBES DISPONIBLES (IaaS, PaaS, SaaS)
    ---------------------------------------------------------- */
    function initCloudFilter() {
        var buttons = document.querySelectorAll('#cloudFilters .btn-filter');
        var cards = document.querySelectorAll('#cloudGrid .cloud-card');
        var status = document.getElementById('filterStatus');
        if (!buttons.length || !cards.length) return;

        // Calcular y mostrar conteo dinámico en los botones
        var counts = { all: cards.length, IaaS: 0, PaaS: 0, SaaS: 0 };
        cards.forEach(function (card) {
            var cat = card.getAttribute('data-cat');
            if (counts[cat] !== undefined) counts[cat]++;
        });

        buttons.forEach(function (btn) {
            var cat = btn.getAttribute('data-cat');
            var countBadge = btn.querySelector('.filter-count');
            if (countBadge && counts[cat] !== undefined) {
                countBadge.textContent = counts[cat];
            }
            btn.setAttribute('aria-pressed', btn.classList.contains('active') ? 'true' : 'false');
        });

        // Evento click con animación escalonada
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) {
                    b.classList.remove('active');
                    b.setAttribute('aria-pressed', 'false');
                });
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');

                var selectedCat = btn.getAttribute('data-cat');
                var visibleCount = 0;
                var animOrder = 0;

                cards.forEach(function (card) {
                    var cardCat = card.getAttribute('data-cat');
                    var shouldShow = (selectedCat === 'all' || cardCat === selectedCat);

                    if (shouldShow) {
                        card.style.display = '';
                        visibleCount++;
                        // Disparar animación de entrada
                        card.classList.remove('filter-in');
                        void card.offsetWidth;
                        card.style.animationDelay = (animOrder * 50) + 'ms';
                        animOrder++;
                        card.classList.add('filter-in');
                    } else {
                        card.style.display = 'none';
                    }
                });

                if (status) {
                    var label = selectedCat === 'all' ? 'todas las categorías' : selectedCat;
                    status.textContent = 'Mostrando ' + visibleCount + ' proveedor(es) de ' + label + '.';
                }
            });
        });
    }

    /* ----------------------------------------------------------
       5. RED SVG INTERACTIVA (Topología de Conectividad)
    ---------------------------------------------------------- */
    function initSvgInteractions() {
        var nodes = document.querySelectorAll('.cloud-net .net-node');
        if (!nodes.length) return;

        nodes.forEach(function (node) {
            function activate() {
                nodes.forEach(function (n) { n.classList.remove('active'); });
                node.classList.add('active');
            }

            function deactivate() {
                node.classList.remove('active');
            }

            node.addEventListener('mouseenter', activate);
            node.addEventListener('mouseleave', deactivate);
            node.addEventListener('focus', activate);
            node.addEventListener('blur', deactivate);

            // Al hacer clic o tocar el nodo: resaltar y hacer scroll a la tarjeta correspondiente
            node.addEventListener('click', function (e) {
                var targetId = node.getAttribute('data-target');
                if (!targetId) return;

                var targetCard = document.getElementById(targetId);
                if (targetCard) {
                    e.preventDefault();
                    // Si el filtro ocultaba la tarjeta, restablecer a "Todas"
                    var allBtn = document.querySelector('#cloudFilters .btn-filter[data-cat="all"]');
                    if (allBtn && !allBtn.classList.contains('active')) {
                        allBtn.click();
                    }

                    targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetCard.classList.add('highlight-card');
                    setTimeout(function () {
                        targetCard.classList.remove('highlight-card');
                    }, 2400);
                }
            });
        });
    }

    /* ----------------------------------------------------------
       6. FORMULARIO DE CONTACTO (Validación visual moderna)
    ---------------------------------------------------------- */
    function initContactForm() {
        var form = document.getElementById('contact-form');
        var msg = document.getElementById('form-msg');
        if (!form) return;

        form.addEventListener('submit', function (e) {
            e.preventDefault();

            var nameInput = form.querySelector('[name="user_name"]');
            var emailInput = form.querySelector('[name="email"]');
            var subjectInput = form.querySelector('[name="subject"]');
            var commentInput = form.querySelector('[name="comment"]');

            var name = nameInput ? nameInput.value.trim() : '';
            var email = emailInput ? emailInput.value.trim() : '';
            var subject = subjectInput ? subjectInput.value.trim() : '';
            var comment = commentInput ? commentInput.value.trim() : '';

            var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            var isValid = true;

            // Validación por campo
            if (name.length < 2) {
                nameInput.classList.add('is-invalid');
                isValid = false;
            } else {
                nameInput.classList.remove('is-invalid');
                nameInput.classList.add('is-valid');
            }

            if (!emailRegex.test(email)) {
                emailInput.classList.add('is-invalid');
                isValid = false;
            } else {
                emailInput.classList.remove('is-invalid');
                emailInput.classList.add('is-valid');
            }

            if (subject.length < 4) {
                subjectInput.classList.add('is-invalid');
                isValid = false;
            } else {
                subjectInput.classList.remove('is-invalid');
                subjectInput.classList.add('is-valid');
            }

            if (comment.length < 10) {
                commentInput.classList.add('is-invalid');
                isValid = false;
            } else {
                commentInput.classList.remove('is-invalid');
                commentInput.classList.add('is-valid');
            }

            form.classList.add('was-validated');

            if (!isValid) {
                if (msg) {
                    msg.className = 'is-error';
                    msg.textContent = 'Por favor corrige los campos marcados en rojo antes de enviar.';
                    msg.style.display = 'block';
                }
                return;
            }

            // Envío exitoso (simulado profesionalmente)
            var submitBtn = form.querySelector('.btn-submit');
            var originalText = submitBtn ? submitBtn.innerHTML : '';
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = 'Enviando...';
            }

            setTimeout(function () {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }

                if (msg) {
                    msg.className = 'is-success';
                    msg.textContent = '¡Mensaje recibido con éxito! Te responderemos a la brevedad a ' + email + '.';
                    msg.style.display = 'block';
                }

                form.reset();
                form.classList.remove('was-validated');
                var inputs = form.querySelectorAll('.form-control');
                inputs.forEach(function (inp) { inp.classList.remove('is-valid', 'is-invalid'); });

                setTimeout(function () {
                    if (msg) { msg.style.display = 'none'; }
                }, 6000);
            }, 600);
        });
    }

    /* ----------------------------------------------------------
       7. BUSCADOR INTEGRADO EN EL NAVBAR
    ---------------------------------------------------------- */
    function initSiteSearch() {
        var searchForm = document.getElementById('site-search');
        var searchInput = document.getElementById('search-input');
        if (!searchForm || !searchInput) return;

        searchForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var term = searchInput.value.trim().toLowerCase();
            if (!term) return;

            // Mapeo inteligente de términos a secciones y tarjetas
            var termMap = {
                'google': 'services',
                'gcp': 'services',
                'aws': 'services',
                'amazon': 'services',
                'azure': 'services',
                'microsoft': 'services',
                'oracle': 'services',
                'noticias': 'news',
                'iaas': 'clouds',
                'paas': 'clouds',
                'saas': 'clouds',
                'cloudflare': 'cloud-cloudflare',
                'ibm': 'cloud-ibm',
                'salesforce': 'cloud-salesforce',
                'sap': 'cloud-sap',
                'alibaba': 'cloud-alibaba',
                'huawei': 'cloud-huawei',
                'digitalocean': 'cloud-digitalocean',
                'red': 'network',
                'comparativa': 'comparison',
                'contacto': 'contact-section'
            };

            var targetId = null;
            for (var key in termMap) {
                if (term.indexOf(key) !== -1 || key.indexOf(term) !== -1) {
                    targetId = termMap[key];
                    break;
                }
            }

            if (!targetId) {
                // Si no coincide exactamente, buscar en títulos de tarjetas
                var cards = document.querySelectorAll('.provider-card, .cloud-card, .news-card');
                for (var i = 0; i < cards.length; i++) {
                    if (cards[i].textContent.toLowerCase().indexOf(term) !== -1) {
                        targetId = cards[i].id || cards[i].closest('section').id;
                        break;
                    }
                }
            }

            if (targetId) {
                var targetEl = document.getElementById(targetId);
                if (targetEl) {
                    targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    targetEl.classList.add('highlight-card');
                    setTimeout(function () {
                        targetEl.classList.remove('highlight-card');
                    }, 2200);
                } else {
                    // Si estamos en una subpágina y el elemento está en la portada, navegar a bil.html con ancla
                    window.location.href = 'bil.html#' + targetId;
                }
            } else {
                // Feedback visual sutil cuando no hay resultados
                var originalPlaceholder = searchInput.placeholder;
                searchInput.value = '';
                searchInput.placeholder = 'No se encontraron resultados';
                setTimeout(function () {
                    searchInput.placeholder = originalPlaceholder;
                }, 2500);
            }
        });
    }

    /* ----------------------------------------------------------
       INICIALIZACIÓN AL CARGAR EL DOM
    ---------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initBackToTop();
        initNavbar();
        initFadeIn();
        initCloudFilter();
        initSvgInteractions();
        initContactForm();
        initSiteSearch();
    });

})();
