// 반응형 메뉴바
const menuBtn = document.querySelector("#category_bar");
const category = document.querySelector(".category");

menuBtn.addEventListener("click", () => {
  category.classList.toggle("active");
});

const chatBox = document.querySelector(".chatBox");
const chat = document.querySelector(".chat");
// 선택 창 만들기
document.addEventListener("DOMContentLoaded", function () {
  let chatTitle = "";
  let selectResult = [];
  // 초기 선택 창 구성
  const initialOptions = [
    "요양",
    "유족",
    "장해",
    "휴업",
    "재용양등",
    "평균임금",
  ];
  chatTitle = `해당하는 내용을 하나를 선택하세요.`;
  appendChatShow(initialOptions, chatTitle);

  // 이벤트 핸들러: 선택지 클릭 시 처리
  function handleOptionClick(option) {
    const initialButtons = document.querySelectorAll(".initialButton");
    initialButtons.forEach((button) => {
      button.disabled = true;
      button.classList.add("disabled");
    });

    // list에 선택 값 추가
    selectResult.push(option);
    // 새로운 chatShowMy 생성
    makeChatShowMy(option);

    // 질문 추가하기
    if (option) {
      const question = "현재 상황에 대해서 아래에 입력해 주세요.";
      const option = NaN;
      setTimeout(() => {
        appendChatShow(option, question);
      }, 1000);
    }

    // 새로 추가되면 맨 밑으로 스크롤 이동
    chat.scrollTop = chat.scrollHeight;
  }

  // 초기 chatShow 추가
  function appendChatShow(options, content) {
    const initialChatShow = document.createElement("div");
    initialChatShow.classList.add("chatShow");
    appendTitle(content, initialChatShow);
    if (options) {
      appendOptions(options, initialChatShow);
    }
    chat.appendChild(initialChatShow);
  }

  // 선택 창을 추가하는 함수
  function appendTitle(content, container) {
    const title = document.createElement("div");
    title.textContent = content;
    container.appendChild(title);
  }

  function appendOptions(options, container) {
    options.forEach((option) => {
      const button = document.createElement("button");
      button.textContent = option;
      button.classList.add("initialButton");
      button.addEventListener("click", () => {
        handleOptionClick(option);
      });
      container.appendChild(button);
    });
  }
});

// 입력했을 때 화면에 나타내기
const form = document.getElementById("inputBox");
form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const text = document.getElementById("text").value;
  if (text.trim() != "") {
    // chatShowMy 생성
    makeChatShowMy(text);
    // 입력칸 초기화
    document.getElementById("text").value = "";
    // 스크롤 내리기
    chat.scrollTop = chat.scrollHeight;
  }

  if (text.trim()) {
    try {
      const response = await fetch("/AI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: text }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      // ChatShowGPT 생성
      makeChatShowGPT(data);
      // 스크롤 내리기
      chat.scrollTop = chat.scrollHeight;
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }
});

// ChatShowMy 생성
function makeChatShowMy(text) {
  const chatmy = document.createElement("div");
  chatmy.classList.add("chatShowMy");
  chatMyContent = document.createElement("div");
  chatMyContent.classList.add("chatShowMyContent");
  chatMyContent.textContent = text;
  chatmy.appendChild(chatMyContent);
  chat.appendChild(chatmy);
}

// ChatShowGPT 생성
function makeChatShowGPT(data) {
  const gptchat = document.createElement("div");
  gptchat.classList.add("chatShowGpt");
  chatgptContent = document.createElement("div");
  chatgptContent.classList.add("chatgptContent");
  chatgptContent.textContent = data;
  gptchat.appendChild(chatgptContent);

  chat.appendChild(gptchat);
}

// 엔터키 입력시 전송
document.getElementById("text").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("textBtn").click();
  }
});
