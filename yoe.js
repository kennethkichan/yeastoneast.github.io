/* Shade toggle. Defaults to light and never reads the OS preference: the
   button is the only thing that decides, so the two can't disagree.
   The choice persists across pages and visits. */
(function () {
  var KEY = 'yoe-shade';
  var root = document.documentElement;

  function apply(shade) {
    if (shade === 'dark') {
      root.setAttribute('data-theme', 'dark');
    } else {
      root.removeAttribute('data-theme');
    }
    var buttons = document.querySelectorAll('.shade button');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].setAttribute(
        'aria-pressed', buttons[i].dataset.shade === shade ? 'true' : 'false'
      );
    }
  }

  function stored() {
    try {
      return localStorage.getItem(KEY) === 'dark' ? 'dark' : 'light';
    } catch (e) {
      // Private browsing can throw on access. Light is the default anyway.
      return 'light';
    }
  }

  // Runs before DOMContentLoaded so a dark-mode visitor never sees a light
  // flash on the way in.
  apply(stored());

  document.addEventListener('DOMContentLoaded', function () {
    apply(stored());
    document.addEventListener('click', function (event) {
      var button = event.target.closest('.shade button');
      if (!button) return;
      var shade = button.dataset.shade;
      try { localStorage.setItem(KEY, shade); } catch (e) { /* not fatal */ }
      apply(shade);
    });
  });
})();
