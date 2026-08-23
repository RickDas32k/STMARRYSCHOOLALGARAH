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
        if(window.matchMedia('(max-width:960px)').matches) closeNav();
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
