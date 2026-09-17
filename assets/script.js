(function(){
  var toggle = document.getElementById('menuToggle');
  var nav = document.getElementById('primaryNav');
  var overlay = document.getElementById('navOverlay');
  var closeBtn = document.getElementById('navClose');

  if(toggle && nav && overlay && closeBtn){
    function openNav(){
      nav.classList.add('open');
      overlay.classList.add('open');
      toggle.setAttribute('aria-expanded','true');
      closeBtn.focus();
    }
    function closeNav(){
      nav.classList.remove('open');
      overlay.classList.remove('open');
      toggle.setAttribute('aria-expanded','false');
      toggle.focus();
    }
    toggle.addEventListener('click', function(){
      nav.classList.contains('open') ? closeNav() : openNav();
    });
    closeBtn.addEventListener('click', closeNav);
    overlay.addEventListener('click', closeNav);
    document.addEventListener('keydown', function(e){
      if(e.key === 'Escape' && nav.classList.contains('open')) closeNav();
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        if(window.matchMedia('(max-width:1180px)').matches) closeNav();
      });
    });
  }

  var form = document.getElementById('contactForm');
  if(form){
    var status = document.getElementById('formStatus');
    form.addEventListener('submit', function(e){
      e.preventDefault();
      var valid = true;
      var fields = [
        {id:'fname', err:'fname-err'},
        {id:'fphone', err:'fphone-err'},
        {id:'fmsg', err:'fmsg-err'}
      ];
      fields.forEach(function(f){
        var input = document.getElementById(f.id);
        var err = document.getElementById(f.err);
        if(!input.value.trim()){
          err.style.display = 'block';
          valid = false;
        } else {
          err.style.display = 'none';
        }
      });
      if(!valid){
        status.textContent = 'Please fill in the required fields above.';
        status.style.color = '#A32D2D';
        return;
      }
      status.style.color = 'var(--forest-deep)';
      status.textContent = 'Thanks — please email stmarysedu.17@gmail.com or call +91 95477 93421 to reach us directly, this form is a design preview.';
    });
  }
})();

/* ===== Modern effects: scroll reveal + sticky header =====
   IntersectionObserver only. No scroll listeners, no rAF loops.
   Everything degrades to visible-and-static under reduced motion. */
(function(){
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(!('IntersectionObserver' in window)) return;

  // --- Scroll reveal ---
  var targets = document.querySelectorAll('.reveal, .reveal-group');
  if(targets.length){
    if(reduce){
      targets.forEach(function(el){ el.classList.add('is-in'); });
    } else {
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          if(entry.isIntersecting){
            entry.target.classList.add('is-in');
            io.unobserve(entry.target);
          }
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
      targets.forEach(function(el){ io.observe(el); });
    }
  }

  // --- Sticky header condense ---
  var header = document.querySelector('header.site-header');
  if(header){
    var sentinel = document.createElement('div');
    sentinel.setAttribute('aria-hidden','true');
    sentinel.style.cssText = 'position:absolute;top:0;left:0;width:1px;height:1px;';
    document.body.insertBefore(sentinel, document.body.firstChild);
    new IntersectionObserver(function(entries){
      header.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { threshold: 0 }).observe(sentinel);
  }
})();
