// Formulář: demo režim neodesílá nic, ostrý režim posílá na endpoint ze site.json (data-endpoint).
(function () {
  document.querySelectorAll('form.formular').forEach(function (f) {
    var stav = f.querySelector('.formular-stav');
    f.addEventListener('submit', function (e) {
      var endpoint = f.getAttribute('data-endpoint');
      var demo = f.getAttribute('data-demo') === '1';
      if (f.querySelector('.past input').value) { e.preventDefault(); return; }   // robot
      if (demo || !endpoint) {
        e.preventDefault();
        stav.textContent = 'Ukázka formuláře: nic se neodesílá. Po spuštění webu bude zpráva doručena na e-mail firmy.';
        return;
      }
      e.preventDefault();
      stav.textContent = 'Odesílám…';
      fetch(endpoint, { method: 'POST', body: new FormData(f), headers: { Accept: 'application/json' } })
        .then(function (r) { if (!r.ok) throw new Error(r.status); f.reset(); stav.textContent = 'Děkujeme, zpráva byla odeslána.'; })
        .catch(function () { stav.textContent = 'Odeslání se nepodařilo. Napište nám prosím e-mailem.'; });
    });
  });
})();

// Výběr pokoje podle počtu osob
(function () {
  var data = window.POKOJE, box = document.getElementById('visacky');
  if (!data || !box) return;
  var karty = box.querySelectorAll('.visacka'), tl = document.querySelectorAll('#osoby .osoba');
  var kc = function (n) { return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' Kč'; };
  function ukaz(n) {
    var pocet = 0;
    data.forEach(function (p, i) {
      var k = karty[i], cena = p.ceny[n], pozn = '';
      if (n > p.max) { k.hidden = true; return; }
      if (cena === undefined) { cena = p.ceny[2]; pozn = n === 1 ? 'Jedna osoba platí cenu za dvě.' : ''; }
      if (p.pozn && n === 1) pozn = pozn ? pozn + ' ' + p.pozn : p.pozn;
      k.hidden = false; pocet++;
      k.querySelector('.cena').textContent = kc(cena);
      k.querySelector('.vis-pozn').textContent = pozn;
    });
    tl.forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.n === n)); });
  }
  tl.forEach(function (b) { b.addEventListener('click', function () { ukaz(+b.dataset.n); }); });
  ukaz(2);
})();
