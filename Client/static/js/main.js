// 화살표 누르면 바로 밑 div(firstPage)로 이동
const arrowBtn = document.getElementById("arrow");
arrowBtn.addEventListener("click", function () {
  // 해당 쿼리에 가장 위쪽 좌표를 가져온다.
  var location = document.querySelector("#firstPage").offsetTop;
  // 스크롤로 이동하는데 location + "숫자"하면 추가적으로 더 이동한다.
  // smooth를 사용하여 부드럽게 이동
  window.scrollTo({ top: location - 50, behavior: "smooth" });
});

// 스크롤 내리면 헤더에 border 생성
const borderView = document.querySelector("header");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header.style.borderBottomWidth = "0.5px";
  } else {
    header.style.borderBottomWidth = "0";
  }
});

// #category > 버튼을 누르면 위치로 이동
const sanjaeBtn = document.getElementById("sanjae");
const caselawBtn = document.getElementById("caselaw");
const AI = document.getElementById("AI");

sanjaeBtn.addEventListener("click", function () {
  var location = document.querySelector("#firstPage").offsetTop;
  window.scrollTo({ top: location - 50, behavior: "smooth" });
});

caselawBtn.addEventListener("click", function () {
  var location = document.querySelector("#secondPage").offsetTop;
  window.scrollTo({ top: location - 50, behavior: "smooth" });
});

AI.addEventListener("click", function () {
  var location = document.querySelector("#thirdPage").offsetTop;
  window.scrollTo({ top: location - 50, behavior: "smooth" });
});

// 화면에 들어오면 보이게 하는 방법
const observer = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("fade-in"); // 화면에 들어옴
    } //else {
    //entry.target.classList.remove("fade-in"); // 화면에서 나감
    // }
  });
  {
    threshold: 0.5; // 화면에서 해당 요소가 50% 이상 보일 경우 화면에 들어온 것으로 판단
  }
});
// targetElement 설정
const targetElement = document.querySelectorAll(".fade-wrap");
targetElement.forEach((element) => {
  observer.observe(element);
});

// 반응형 메뉴바
const menuBtn = document.querySelector("#category_bar");
const category = document.querySelector(".category");

menuBtn.addEventListener("click", () => {
  category.classList.toggle("active");
});

// 이미지 슬라이딩
const slider = document.querySelector(".slider");
const slides = document.querySelectorAll(".slide");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");

let currentIndex = 0;

function showSlide(index) {
  if (index >= slides.length) {
    currentIndex = 0;
  } else if (index < 0) {
    currentIndex = slides.length - 1;
  } else {
    currentIndex = index;
  }
  slider.style.transform = `translateX(-${currentIndex * 25}%)`;
}

prevBtn.addEventListener("click", () => {
  showSlide(currentIndex - 1);
});

nextBtn.addEventListener("click", () => {
  showSlide(currentIndex + 1);
});

showSlide(currentIndex);
