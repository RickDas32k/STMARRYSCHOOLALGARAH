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

/* ===== Fee explorer (admission page) =====
   Data mirrors the school's printed fee table, Classes I to X.
   Numbers count up on reveal and on class change. Under reduced
   motion the final figure is written immediately. */
(function(){
  var panel = document.getElementById('feePanel');
  if(!panel) return;

  var FEES = {
    'I':    {admission:1800, session:1700, computer:1500, exam:1600, games:1200, tuition:1400},
    'II':   {admission:1800, session:1700, computer:1500, exam:1600, games:1200, tuition:1400},
    'III':  {admission:1900, session:1700, computer:1500, exam:1600, games:1200, tuition:1500},
    'IV':   {admission:1900, session:1700, computer:1500, exam:1600, games:1200, tuition:1500},
    'V':    {admission:1900, session:1700, computer:1500, exam:1600, games:1200, tuition:1600},
    'VI':   {admission:1900, session:2000, computer:1500, exam:1600, games:1200, tuition:1600},
    'VII':  {admission:2200, session:2000, computer:1500, exam:1600, games:1200, tuition:1700},
    'VIII': {admission:2200, session:2000, computer:1500, exam:1600, games:1200, tuition:1700},
    'IX':   {admission:3500, session:2300, computer:1500, exam:1600, games:1200, tuition:2000},
    'X':    {admission:3500, session:2300, computer:1500, exam:1600, games:1200, tuition:2000}
  };
  var ORDER = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function fmt(n){ return n.toLocaleString('en-IN'); }
  function headsTotal(f){ return f.admission + f.session + f.computer + f.exam + f.games; }

  // Count a number up from its current value to the target.
  function countTo(el, target){
    var start = parseInt((el.textContent || '0').replace(/[^0-9]/g,''), 10) || 0;
    if(reduce || start === target){ el.textContent = fmt(target); return; }
    var dur = 520, t0 = null;
    function step(ts){
      if(t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      el.textContent = fmt(Math.round(start + (target - start) * eased));
      if(p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function render(cls){
    var f = FEES[cls];
    if(!f) return;
    document.getElementById('feeClassName').textContent = cls;
    var vals = {
      admission: f.admission, session: f.session, computer: f.computer,
      exam: f.exam, games: f.games, tuition: f.tuition, total: headsTotal(f)
    };
    panel.querySelectorAll('.count[data-key]').forEach(function(el){
      countTo(el, vals[el.getAttribute('data-key')]);
    });
  }

  // Tabs
  var tabs = document.querySelectorAll('.fee-tab');
  tabs.forEach(function(tab, i){
    tab.addEventListener('click', function(){
      tabs.forEach(function(t){ t.classList.remove('is-active'); t.setAttribute('aria-selected','false'); });
      tab.classList.add('is-active'); tab.setAttribute('aria-selected','true');
      render(tab.getAttribute('data-class'));
    });
    // Left/right arrow keys move between classes
    tab.addEventListener('keydown', function(e){
      var d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if(!d) return;
      e.preventDefault();
      var next = tabs[(i + d + tabs.length) % tabs.length];
      next.focus(); next.click();
    });
  });

  // Build the full table
  var tbody = document.getElementById('feeTableBody');
  if(tbody){
    tbody.innerHTML = ORDER.map(function(c){
      var f = FEES[c];
      return '<tr><th scope="row">' + c + '</th>' +
        [f.admission,f.session,f.computer,f.exam,f.games,f.tuition]
          .map(function(v){ return '<td>' + fmt(v) + '</td>'; }).join('') +
        '</tr>';
    }).join('');
  }

  // First paint: animate once the panel scrolls into view
  if(reduce || !('IntersectionObserver' in window)){
    render('I');
  } else {
    var seen = false;
    new IntersectionObserver(function(entries, obs){
      if(entries[0].isIntersecting && !seen){
        seen = true; render('I'); obs.disconnect();
      }
    }, { threshold: 0.25 }).observe(panel);
  }

  // Age ladder numbers
  var ageNums = document.querySelectorAll('.age-ladder .count');
  if(ageNums.length){
    if(reduce || !('IntersectionObserver' in window)){
      ageNums.forEach(function(el){ el.textContent = el.getAttribute('data-to'); });
    } else {
      ageNums.forEach(function(el){ el.textContent = '0'; });
      var ladder = document.querySelector('.age-ladder');
      new IntersectionObserver(function(entries, obs){
        if(entries[0].isIntersecting){
          ageNums.forEach(function(el){ countTo(el, parseInt(el.getAttribute('data-to'),10)); });
          obs.disconnect();
        }
      }, { threshold: 0.3 }).observe(ladder);
    }
  }
})();
