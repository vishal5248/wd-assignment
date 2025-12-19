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

        function openService(service){
 

  alert("You selected: " + service);
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

  document.getElementById("contactForm").addEventListener("submit", function(e){
  e.preventDefault();

  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let message = document.getElementById("message").value;

  if(name === ""){
    alert("Please enter your name");
    return;
  }

  if(email === ""){
    alert("Please enter your email");
    return;
  }

  if(phone === ""){
    alert("Please enter your phone number");
    return;
  }

  if(message === ""){
    alert("Please enter your message");
    return;
  }

  alert("Form submitted successfully!");
  this.reset();
});