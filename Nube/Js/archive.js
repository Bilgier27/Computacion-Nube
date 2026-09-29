/* ============================================================
   archive.js — JavaScript central del sitio Computación Nube
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. BACK-TO-TOP BUTTON
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
        });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------
       2. FADE-IN ON SCROLL (Intersection Observer)
    ---------------------------------------------------------- */
    function initFadeIn() {
        var elements = document.querySelectorAll('.fade-in-el');
        if (!elements.length) return;
        if (!('IntersectionObserver' in window)) {
            elements.forEach(function (el) { el.classList.add('visible'); });
            return;
        }
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12 });
        elements.forEach(function (el) { observer.observe(el); });
    }

    /* ----------------------------------------------------------
       3. CLOUD CATEGORY FILTER
    ---------------------------------------------------------- */
    function initCloudFilter() {
        var buttons = document.querySelectorAll('#cloudFilters .btn-filter');
        var cards   = document.querySelectorAll('#cloudGrid .cloud-card');
        if (!buttons.length) return;
        buttons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                buttons.forEach(function (b) { b.classList.remove('active'); });
                btn.classList.add('active');
                var cat = btn.getAttribute('data-cat');
                cards.forEach(function (card) {
                    var show = cat === 'all' || card.getAttribute('data-cat') === cat;
                    card.style.display = show ? '' : 'none';
                });
            });
        });
    }

    /* ----------------------------------------------------------
       4. SVG NETWORK TOUCH HANDLER
    ---------------------------------------------------------- */
    function initSvgTouch() {
        var nodes = document.querySelectorAll('.cloud-net .net-node');
        if (!nodes.length) return;
        nodes.forEach(function (node) {
            node.addEventListener('click', function (e) {
                var isTouch = matchMedia('(hover: none)').matches;
                if (!isTouch) return;
                e.stopPropagation();
                var wasActive = node.classList.contains('active');
                nodes.forEach(function (n) { n.classList.remove('active'); });
                if (!wasActive) node.classList.add('active');
            });
        });
        document.addEventListener('click', function () {
            nodes.forEach(function (n) { n.classList.remove('active'); });
        });
    }

    /* ----------------------------------------------------------
       5. CONTACT FORM — validación y feedback al usuario
    ---------------------------------------------------------- */
    function initContactForm() {
        var form = document.querySelector('#contact-section form');
        var msg  = document.getElementById('form-msg');
        if (!form) return;
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            var name    = form.querySelector('[name="user_name"]').value.trim();
            var email   = form.querySelector('[name="email"]').value.trim();
            var subject = form.querySelector('[name="subject"]').value.trim();
            var comment = form.querySelector('[name="comment"]').value.trim();
            if (!name || !email || !subject || !comment) {
                alert('Por favor completa todos los campos.');
                return;
            }
            var emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRe.test(email)) {
                alert('Por favor ingresa un correo electrónico válido.');
                return;
            }
            if (msg) {
                msg.style.display = 'block';
                msg.textContent = '¡Mensaje enviado correctamente! Nos pondremos en contacto pronto.';
            }
            form.reset();
            setTimeout(function () {
                if (msg) msg.style.display = 'none';
            }, 5000);
        });
    }

    /* ----------------------------------------------------------
       INIT ALL
    ---------------------------------------------------------- */
    document.addEventListener('DOMContentLoaded', function () {
        initBackToTop();
        initFadeIn();
        initCloudFilter();
        initSvgTouch();
        initContactForm();
    });

})();
