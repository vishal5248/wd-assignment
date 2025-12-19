 var x=document.querySelector(".openBtn");
        var showMenu=document.getElementById("menu");
        var closeBtn1=document.querySelector(".closeBtn");
        function openMenu(){
            showMenu.style.display="block";
            x.style.display="none";
            closeBtn1.style.display="block";

        }
        function closeMenu(){
            showMenu.style.display="none";
            closeBtn1.style.display="none";
            x.style.display="block";


        }

       

//footer

document.getElementById('year').textContent = new Date().getFullYear();

  
  (function(){
    const about = document.querySelector('.about-text');
    const btn = document.getElementById('readMoreBtn');
    const full = about.textContent.trim();
    const limit = 220; // character limit before "read more"
    if(full.length > limit){
      const short = full.slice(0, limit).trim() + '…';
      about.dataset.full = full;
      about.textContent = short;
      btn.style.display = 'inline-block';
      btn.addEventListener('click', function(){
        const expanded = btn.getAttribute('aria-expanded') === 'true';
        if(expanded){
          about.textContent = about.dataset.full.slice(0, limit).trim() + '…';
          btn.setAttribute('aria-expanded', 'false');
          btn.textContent = 'READ MORE';
        } else {
          about.textContent = about.dataset.full;
          btn.setAttribute('aria-expanded', 'true');
          btn.textContent = 'READ LESS';
        }
      });
    } else {
      btn.style.display = 'none';
    }
  })();

  // Back to top: show/hide and smooth scroll
  (function(){
    const btn = document.getElementById('backToTop');
    const showOffset = 300;
    window.addEventListener('scroll', function(){
      if(window.scrollY > showOffset) btn.classList.add('show');
      else btn.classList.remove('show');
    });
    btn.addEventListener('click', function(){
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  })();

  document.getElementById("appointmentForm").addEventListener("submit", function (e) {
  e.preventDefault();

  let name = document.getElementById("name").value.trim();
  let contact = document.getElementById("contact").value.trim();
  let service = document.getElementById("service").value;
  let city = document.getElementById("city").value;
  let area = document.getElementById("area").value;
  let terms = document.getElementById("terms").checked;
  let gender = document.querySelector('input[name="gender"]:checked');

  if (name === "") {
    alert("Please enter your name");
    return;
  }

  if (!gender) {
    alert("Please select gender");
    return;
  }

  if (!/^[0-9]{10}$/.test(contact)) {
    alert("Please enter valid 10-digit contact number");
    return;
  }

  if (service === "") {
    alert("Please select service");
    return;
  }

  if (city === "") {
    alert("Please select city");
    return;
  }

  if (area === "") {
    alert("Please select area");
    return;
  }

  if (!terms) {
    alert("Please accept terms & conditions");
    return;
  }

  alert("Appointment submitted successfully!");
  this.reset();
});
