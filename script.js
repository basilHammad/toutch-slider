const slider = document.querySelector(".slider-container"),
  slides = Array.from(document.querySelectorAll(".slide"));

let isDragging = false,
  startPos = 0,
  curruntTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  curruntIndex = 0;

slides.forEach((slide, index) => {
  const slideImg = slide.querySelector("img");
  slideImg.addEventListener("dragstart", (e) => {
    e.preventDefault();
  });

  //Touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);

  //Mouse events
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mouseleave", touchEnd);
  slide.addEventListener("mousemove", touchMove);
});

window.oncontextmenu = (e) => {
  e.preventDefault();
  e.stopPropagation();
  return false;
};

function touchStart(index) {
  return function (e) {
    isDragging = true;
    curruntIndex = index;
    startPos = getPositionX(e);

    animationID = requestAnimationFrame(animation);

    slider.classList.add("grabbing");
  };
}
function touchEnd() {
  isDragging = false;

  cancelAnimationFrame(animationID);

  const movedBy = curruntTranslate - prevTranslate;
  if (movedBy < -100 && curruntIndex < slides.length - 1) curruntIndex++;
  if (movedBy > 100 && curruntIndex > 0) curruntIndex--;

  setPosByIndex();

  slider.classList.remove("grabbing");
}

function touchMove(e) {
  if (isDragging) {
    const currentPos = getPositionX(e);
    curruntTranslate = currentPos + prevTranslate - startPos;
  }
}

function getPositionX(e) {
  return e.type.includes("mouse") ? e.pageX : e.touches[0].clientX;
}

function animation() {
  setSliderPos();
  if (isDragging) requestAnimationFrame(animation);
}

function setSliderPos() {
  slider.style.transform = `translateX(${curruntTranslate}px)`;
}

function setPosByIndex() {
  curruntTranslate = curruntIndex * -window.innerWidth;
  prevTranslate = curruntTranslate;
  setSliderPos();
}
