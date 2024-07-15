// 스크롤 내리면 헤더에 border 생성
const borderView = document.querySelector("header");

window.addEventListener("scroll", function () {
  if (window.scrollY > 50) {
    header.style.borderBottomWidth = "0.5px";
  } else {
    header.style.borderBottomWidth = "0";
  }
});

// 판례 결과 선택
const array = ["기각", "각하", "취소", "일부취소"];
const select = document.getElementById("result");

select.addEventListener("focus", function () {
  if (select.options.length > 1) {
    return;
  }
  for (let i = 0; i < array.length; i++) {
    const Tag = document.createElement("option");
    Tag.textContent = array[i];
    Tag.value = array[i];
    this.append(Tag);
  }
});

// 사건 분류 선택
const array1 = ["요양", "유족", "휴업", "장해", "기타"];
const select1 = document.getElementById("classification");

select1.addEventListener("focus", function () {
  if (select1.options.length > 1) {
    return;
  }
  for (let i = 0; i < array1.length; i++) {
    const Tag = document.createElement("option");
    Tag.textContent = array1[i];
    Tag.value = array1[i];
    this.append(Tag);
  }
});

// 반응형 메뉴바
const menuBtn = document.querySelector("#category_bar");
const category = document.querySelector(".category");

menuBtn.addEventListener("click", () => {
  category.classList.toggle("active");
});

// 검색했을 때 리스트 추가
const searchForm = document.getElementById("searchForm");
const searchResults = document.getElementById("searchResults");
const pagination = document.getElementById("pagination");
const loadingOverlay = document.getElementById("loadingOverlay"); // 로딩 오버레이 요소
const loadingMessage = document.getElementById("loadingMessage"); // 로딩 메시지 요소

let data = [];
const pageCount = 20;
let currentPage = 1;

searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  // 로딩 오버레이 표시
  loadingOverlay.style.display = "block";
  startLoadingAnimation();

  const formData = new FormData(searchForm);
  const result = formData.get("result");
  const classification = formData.get("classification");
  const text = formData.get("text");

  // 서버로 요청
  const response = await fetch("search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      result,
      classification,
      text,
    }),
  });
  data = await response.json();

  // 현재 페이지 설정
  currentPage = 1;

  // 페이지당 결과 수 설정
  const totalPages = Math.ceil(data.length / pageCount);

  // 페이지네이션 버튼 생성
  createPaginationButtons(totalPages);

  displaySearchResults(data, currentPage, pageCount);

  // 로딩 메시지 숨김
  loadingOverlay.style.display = "none";
  stopLoadingAnimation();
});

function displaySearchResults(result, currentPage, pageCount) {
  // 기존 검색 결과 초기화
  searchResults.innerHTML = "";

  // 페이지 범위 계산
  const start = (currentPage - 1) * pageCount;
  const end = start + pageCount;
  const paginatedResults = result.slice(start, end);

  // 태그 생성 및 추가
  paginatedResults.forEach((result) => {
    const listElement = document.createElement("li");
    listElement.classList.add("resultList");

    const buttonElement = document.createElement("button");
    buttonElement.textContent = `[${result.accnum}] ${result.courtname}: ${result.title}`;
    buttonElement.setAttribute("data-accnum", result.accnum);

    const resultElement = document.createElement("p");
    resultElement.textContent = `결과: ${result.kinda}`;

    const contentElement = document.createElement("p");
    contentElement.textContent = `유형 및 구분: ${result.kindb}/${result.kindc}`;

    listElement.appendChild(buttonElement);
    listElement.appendChild(resultElement);
    listElement.appendChild(contentElement);
    searchResults.appendChild(listElement);
  });

  // 총 검색 결과 개수 업데이트
  const totalResultsCount = document.getElementById("totalResultsCount");
  totalResultsCount.textContent = `검색 결과: 총 ${result.length}건`;
}

// 페이지 생성
function createPaginationButtons(totalPages) {
  // 기존 페이지 버튼 초기화
  pagination.innerHTML = "";

  const maxPagesToShow = 10;
  const startPage =
    Math.floor((currentPage - 1) / maxPagesToShow) * maxPagesToShow + 1;
  const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

  // 이전 버튼 추가
  if (startPage > 1) {
    const prevButton = document.createElement("button");
    // prevButton.textContent = "이전";
    prevButton.classList.add("prevBtn");
    prevButton.addEventListener("click", () => {
      currentPage = startPage - 1;
      createPaginationButtons(totalPages, currentPage);
      displaySearchResults(data, currentPage, pageCount);
    });
    pagination.appendChild(prevButton);
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = document.createElement("button");
    button.textContent = i;
    button.classList.add("paginationBtn");

    if (i === currentPage) {
      button.classList.add("currentPage");
    }

    button.addEventListener("click", () => {
      currentPage = i;
      displaySearchResults(data, currentPage, pageCount);
      updatePaginationButtons(totalPages, currentPage);
    });
    pagination.appendChild(button);
  }

  // 다음 버튼 추가
  if (endPage < totalPages) {
    const nextButton = document.createElement("button");
    // nextButton.textContent = "다음";
    nextButton.classList.add("nextBtn");
    nextButton.addEventListener("click", () => {
      currentPage = endPage + 1;
      createPaginationButtons(totalPages, currentPage);
      displaySearchResults(data, currentPage, pageCount);
    });
    pagination.appendChild(nextButton);
  }
}

// 로딩 애니메이션 시작
function startLoadingAnimation() {
  let dots = 0;
  loadingInterval = setInterval(() => {
    loadingMessage.textContent = `불러오는중${".".repeat(dots)}`;
    dots = (dots + 1) % 4;
  }, 500);
}

// 로딩 애니메이션 정지
function stopLoadingAnimation() {
  clearInterval(loadingInterval);
  // loadingMessage.textContent = "불러오는중";
}

// 페이지 버튼 현재 페이지를 알 수 있게 만들어줌(현재 페이지 색 추가)
function updatePaginationButtons(totalPages, currentPage) {
  createPaginationButtons(totalPages, currentPage);
}

// 검색결과 클릭 이벤트 핸들러
function handleResultsClick(event) {
  const target = event.target;
  // 클릭된 요소가 LI 태그 내의 button 요소인 경우 처리
  const liElement = target.closest("li"); // 클릭된 요소의 부모 LI 요소를 찾음
  if (liElement) {
    const buttonElement = liElement.querySelector("button"); // LI 요소 내의 첫 번째 button 요소를 찾음
    if (buttonElement) {
      const accnum = buttonElement.getAttribute("data-accnum");
      console.log(`Clicked button with accnum: ${accnum}`);

      window.location.href = `/CaseLaw/data?accnum=${accnum}`;
    }
  }
}

// 이전 페이지에서 등록된 이벤트 핸들러 제거
searchResults.removeEventListener("click", handleResultsClick);

// 페이지 이동 후 새로운 이벤트 핸들러 등록
searchResults.addEventListener("click", handleResultsClick);
