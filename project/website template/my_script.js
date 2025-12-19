
// search 
function clearBtn1(){
     let input=document.getElementById("search");
     let clearBtn=document.getElementById("clearbtn")
      if(input.value.length>0){
        clearBtn.style.display="block";
        clearBtn.style.opacity="1";
      }else{
        clearBtn.style.display="none";
        clearBtn.style.opacity="0";
      }
}
function clearSearch(){
     let input=document.getElementById("search");
     input.value="";
     input.focus();
     clearBtn1();
}

const left = document.querySelector(".left");
const right = document.querySelector(".right");
const slider = document.querySelector(".slider");
const slide = document.querySelectorAll(".slide");
let sliderNumber = 1;
const length = slide.length;

// for dots
const bottom =document.querySelector(".bottom");

for(let i=0; i<length;i++){
  const div=document.createElement("div")
  div.className="button";
  bottom.appendChild(div);
}

const buttons=document.querySelectorAll(".button");
buttons[0].style.width="18px";
buttons[0].style.backgroundColor="white";

const resetBg = ()=>{
  buttons.forEach((button)=>{
    button.style.backgroundColor=`rgba(255,255,255,0.32)`;
    button.style.width="9px";
    button.addEventListener(`mouseover`,stopslideshow);
    button.addEventListener(`mouseout`,startSliderShow);
  });
};

buttons.forEach((button, i)=>{
  button.addEventListener("click",()=>{
    resetBg();
    slider.style.transform=`translatex(-${i*100}%)`;
    sliderNumber=i+1;
    button.style.backgroundColor="white";
    button.style.width="18px";
  });
});

const changecolor=()=>{
  resetBg();
  buttons[sliderNumber-1].style.backgroundColor="white";
  buttons[sliderNumber-1].style.width="18px";
}

// slides
const nextSlide = () => {
  slider.style.transform = `translate(-${sliderNumber * 100}%)`;
  sliderNumber++;
};
const getfirstslide = () => {
  slider.style.transform = `translate(0%)`;
  sliderNumber = 1;
};

const prevSlide = () => {
  slider.style.transform=`translate(-${(sliderNumber-2)*100}%)`;
  sliderNumber-=1;
};

const getlastslide = () => {
  slider.style.transform=`translate(-${(length-1)*100}%)`;
  sliderNumber=length;
};

right.addEventListener("click", () => {
  if (sliderNumber < slide.length) {
    nextSlide();
  } else {
    getfirstslide();
  }
  changecolor()
});
left.addEventListener("click", () => {
  if (sliderNumber > 1) {
    prevSlide();
  }
  else{
      getlastslide();
  }
  changecolor();
});

// autoslider
let sliderInterval;
const startSliderShow= ()=>{
  sliderInterval=setInterval(()=>{
   if (sliderNumber < slide.length) {
    nextSlide();
   } else {
    getfirstslide();
   }
   changecolor();
  },4000);
};

const stopslideshow=()=>{
  clearInterval(sliderInterval)
}
startSliderShow();
slider.addEventListener(`mouseover`,stopslideshow);
slider.addEventListener(`mouseout`,startSliderShow);
right.addEventListener(`mouseover`,stopslideshow);
right.addEventListener(`mouseout`,startSliderShow);
left.addEventListener(`mouseover`,stopslideshow);
left.addEventListener(`mouseout`,startSliderShow);



//card slider

(function(){
  const track = document.getElementById('track');
  const originalSlides = Array.from(track.children);
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const indicatorsContainer = document.getElementById('indicators');
  const toggleAutoSlideBtn = document.getElementById('toggleAutoSlide');
  
  // Configuration
  const TOTAL_ORIGINAL_SLIDES = originalSlides.length; // Should be 10
  const SLIDE_INTERVAL = 4000; // 4 seconds
  const GAP = 30; // px

  // State variables
  let slideWidth = 0;
  let step = 0;
  let currentIndex = TOTAL_ORIGINAL_SLIDES; // Start at first original after clones
  let isAnimating = false;
  let isAutoSliding = true;
  let autoSlideTimer = null;
  let indicators = [];

  // Initialize indicators
  function createIndicators() {
    indicatorsContainer.innerHTML = '';
    indicators = [];
    
    for (let i = 0; i < TOTAL_ORIGINAL_SLIDES; i++) {
      const indicator = document.createElement('div');
      indicator.classList.add('indicator');
      if (i === 0) indicator.classList.add('active');
      indicator.dataset.index = i;
      indicator.addEventListener('click', () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
      indicators.push(indicator);
    }
  }

  // Update active indicator
  function updateIndicators() {
    const actualIndex = currentIndex % TOTAL_ORIGINAL_SLIDES;
    indicators.forEach((indicator, index) => {
      if (index === actualIndex) {
        indicator.classList.add('active');
      } else {
        indicator.classList.remove('active');
      }
    });
  }

  // Prepare clones for infinite loop
  function setupClones() {
    // Clear any existing clones
    const existingClones = track.querySelectorAll('.clone');
    existingClones.forEach(clone => clone.remove());
    
    // Create clones for seamless infinite loop
    const fragBefore = document.createDocumentFragment();
    const fragAfter = document.createDocumentFragment();
    
    // Clone all original slides for before and after
    originalSlides.forEach(slide => {
      const cloneBefore = slide.cloneNode(true);
      cloneBefore.classList.add('clone');
      fragBefore.appendChild(cloneBefore);
      
      const cloneAfter = slide.cloneNode(true);
      cloneAfter.classList.add('clone');
      fragAfter.appendChild(cloneAfter);
    });
    
    // Append clones: before clones + originals + after clones
    track.appendChild(fragAfter);
    track.insertBefore(fragBefore, track.firstChild);
  }

  // Update sizes and reposition track
  function updateSizes() {
    // Get the first slide (could be a clone)
    const firstSlide = track.children[0];
    slideWidth = firstSlide.getBoundingClientRect().width;
    step = slideWidth + GAP;
    
    // Position at the first original slide (after the before clones)
    currentIndex = TOTAL_ORIGINAL_SLIDES;
    
    // Set initial transform without transition
    track.style.transition = 'none';
    track.style.transform = `translateX(${-currentIndex * step}px)`;
    
    // Force reflow then enable transition
    requestAnimationFrame(() => {
      track.style.transition = 'transform 450ms cubic-bezier(.22,.9,.22,1)';
    });
  }

  // Move to specific slide index
  function moveTo(index, animate = true) {
    if (isAnimating) return;
    isAnimating = true;
    
    // Update current index
    currentIndex = index;
    
    // Apply transform
    if (animate) {
      track.style.transition = 'transform 450ms cubic-bezier(.22,.9,.22,1)';
    } else {
      track.style.transition = 'none';
    }
    
    track.style.transform = `translateX(${-currentIndex * step}px)`;
    
    // Handle transition end
    const handleTransitionEnd = () => {
      track.removeEventListener('transitionend', handleTransitionEnd);
      isAnimating = false;
      
      // Check if we need to wrap around for infinite loop
      const totalSlides = track.children.length;
      const cloneSetCount = TOTAL_ORIGINAL_SLIDES;
      
      // If we're in the "after clones" zone, jump to corresponding original
      if (currentIndex >= TOTAL_ORIGINAL_SLIDES + cloneSetCount) {
        currentIndex = currentIndex - cloneSetCount;
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentIndex * step}px)`;
        requestAnimationFrame(() => {
          track.style.transition = 'transform 450ms cubic-bezier(.22,.9,.22,1)';
        });
      }
      // If we're in the "before clones" zone, jump to corresponding original
      else if (currentIndex < cloneSetCount) {
        currentIndex = currentIndex + cloneSetCount;
        track.style.transition = 'none';
        track.style.transform = `translateX(${-currentIndex * step}px)`;
        requestAnimationFrame(() => {
          track.style.transition = 'transform 450ms cubic-bezier(.22,.9,.22,1)';
        });
      }
      
      // Update indicators
      updateIndicators();
    };
    
    if (animate) {
      track.addEventListener('transitionend', handleTransitionEnd);
    } else {
      // For non-animated moves, update immediately
      isAnimating = false;
      updateIndicators();
    }
  }

  // Go to specific original slide
  function goToSlide(index) {
    const targetIndex = index + TOTAL_ORIGINAL_SLIDES; // Adjust for clones
    moveTo(targetIndex);
    resetAutoSlide();
  }

  // Slide to next card
  function slideNext() {
    moveTo(currentIndex + 1);
    resetAutoSlide();
  }

  // Slide to previous card
  function slidePrev() {
    moveTo(currentIndex - 1);
    resetAutoSlide();
  }

  // Auto-slide functionality
  function startAutoSlide() {
    if (!isAutoSliding) return;
    stopAutoSlide();
    autoSlideTimer = setInterval(slideNext, SLIDE_INTERVAL);
    toggleAutoSlideBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Auto-Slide';
  }

  function stopAutoSlide() {
    if (autoSlideTimer) {
      clearInterval(autoSlideTimer);
      autoSlideTimer = null;
    }
    toggleAutoSlideBtn.innerHTML = '<i class="fas fa-play"></i> Play Auto-Slide';
  }

  function resetAutoSlide() {
    if (isAutoSliding) {
      stopAutoSlide();
      startAutoSlide();
    }
  }

  function toggleAutoSlide() {
    isAutoSliding = !isAutoSliding;
    if (isAutoSliding) {
      startAutoSlide();
    } else {
      stopAutoSlide();
    }
  }

  // Drag/Touch support
  let startX = 0, currentTranslate = 0, prevTranslate = 0, dragging = false;
  
  function getPointerX(e) {
    return (e.touches ? e.touches[0].clientX : (e.clientX || e.pageX));
  }
  
  function pointerDown(e) {
    dragging = true;
    track.parentElement.classList.add('dragging');
    startX = getPointerX(e);
    prevTranslate = -currentIndex * step;
    track.style.transition = 'none';
    window.addEventListener('pointermove', pointerMove);
    window.addEventListener('pointerup', pointerUp);
    window.addEventListener('pointercancel', pointerUp);
  }
  
  function pointerMove(e) {
    if (!dragging) return;
    const currentX = getPointerX(e);
    const dx = currentX - startX;
    currentTranslate = prevTranslate + dx;
    track.style.transform = `translateX(${currentTranslate}px)`;
  }
  
  function pointerUp(e) {
    if (!dragging) return;
    dragging = false;
    track.parentElement.classList.remove('dragging');
    window.removeEventListener('pointermove', pointerMove);
    window.removeEventListener('pointerup', pointerUp);
    window.removeEventListener('pointercancel', pointerUp);
    
    // Decide whether to move next/prev or snap back
    const movedPx = currentTranslate - prevTranslate;
    const threshold = step * 0.25; // 25% threshold
    
    if (movedPx < -threshold) {
      slideNext();
    } else if (movedPx > threshold) {
      slidePrev();
    } else {
      // Snap back to current position
      moveTo(currentIndex);
    }
  }

  // Initialize the slider
  function initSlider() {
    // Setup clones for infinite loop
    setupClones();
    
    // Create indicators
    createIndicators();
    
    // Update sizes
    updateSizes();
    
    // Attach event listeners
    prevBtn.addEventListener('click', slidePrev);
    nextBtn.addEventListener('click', slideNext);
    toggleAutoSlideBtn.addEventListener('click', toggleAutoSlide);
    
    // Keyboard navigation
    window.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') slidePrev();
      if (e.key === 'ArrowRight') slideNext();
      if (e.key === ' ') {
        e.preventDefault();
        toggleAutoSlide();
      }
    });
    
    // Drag/Touch support
    track.addEventListener('pointerdown', pointerDown);
    
    // Auto-slide controls
    const sliderContainer = document.querySelector('.celeb-slider');
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', () => {
      if (isAutoSliding) startAutoSlide();
    });
    
    // Play button functionality
    track.addEventListener('click', (e) => {
      const playBtn = e.target.closest('.play-btn');
      if (playBtn) {
        const card = playBtn.closest('.celeb-card');
        const name = card.querySelector('.celeb-name h4')?.textContent || 'Celebrity';
        alert(`Playing testimonial video for ${name}`);
        e.stopPropagation();
      }
    });
    
    // Handle window resize
    window.addEventListener('resize', () => {
      setTimeout(() => {
        updateSizes();
      }, 100);
    });
    
    // Start auto-slide
    startAutoSlide();
  }

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initSlider);
})();

//footer content

 // set copyright year
  document.getElementById('year').textContent = new Date().getFullYear();

  // READ MORE: expand/collapse the About text (accessible)
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

  // media tag navbar menu

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