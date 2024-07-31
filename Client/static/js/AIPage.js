// 반응형 메뉴바
const menuBtn = document.querySelector("#category_bar");
const category = document.querySelector(".category");
let flag = false;

menuBtn.addEventListener("click", () => {
  category.classList.toggle("active");
});

const chatBox = document.querySelector(".chatBox");
const chat = document.querySelector(".chat");
let selectResult = [];
// 선택 창 만들기
document.addEventListener("DOMContentLoaded", function () {
  let chatTitle = "";
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
    // console.log(selectResult[0]);
    // 새로운 chatShowMy 생성
    makeChatShowMy(option);

    // 입력창과 전송 버튼 활성화
    document.getElementById("text").disabled = false;
    document.getElementById("textBtn").disabled = false;

    // 질문 추가하기
    if (option) {
      const question = "현재 상황에 대해서 아래에 입력해 주세요.";
      const option = NaN;
      setTimeout(() => {
        appendChatShow(option, question);
      }, 200);
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
  } else {
    return;
  }

  makeChatShowWait();

  if (text.trim() != "" && flag == false) {
    try {
      const requestBody = { text: text, select: selectResult[0] };
      const response = await fetch("/AI", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      const datasplit = data[0].split("'", 2);

      // ChatShowWait 제거
      removeChatShowWait();

      // ChatShowModel 생성
      if (data.length == 2) {
        makeChatShowModel(data[0]);
      } else {
        makeChatShowModel(data);
      }

      // "산재 가능"이 나올 경우 노무사, 금액 선택
      if (datasplit[1] == "산재 가능") {
        makeShowSelect(data[1]);
      } else if (datasplit[1] == "산재 불가능") {
        let judgement = ["false", data[1]];
        makeShowSelect(judgement);
      }
    } catch (error) {
      console.error("error ::", error);
    }
  }

  if (text.trim() && flag == true) {
    try {
      console.log(text);
      const request = { text: text, select: selectResult[0] };
      console.log(request);
      const response = await fetch("/AI/Amount", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const answer = await response.json();

      // ChatShowWait 제거
      removeChatShowWait();

      // ChatShowModel 생성
      makeChatShowModel(answer);
      flag = false;
      inputStatusOff();
    } catch (error) {
      console.error("error ::", error);
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

  chat.scrollTop = chat.scrollHeight;
}

// ChatShowModel 생성
function makeChatShowModel(data) {
  const Modelchat = document.createElement("div");
  Modelchat.classList.add("chatShowModel");
  chatModelContent = document.createElement("div");
  chatModelContent.classList.add("chatModelContent");
  chatModelContent.textContent = data;
  Modelchat.appendChild(chatModelContent);

  chat.appendChild(Modelchat);

  chat.scrollTop = chat.scrollHeight;
}

// ChatShowWait 생성
function makeChatShowWait() {
  const Waitchat = document.createElement("div");
  Waitchat.classList.add("chatShowWait");
  WaitchatContent = document.createElement("div");
  WaitchatContent.classList.add("chatWaitContent");
  WaitchatContent.textContent = "생성중...";
  Waitchat.appendChild(WaitchatContent);

  chat.appendChild(Waitchat);

  chat.scrollTop = chat.scrollHeight;
}

// ChatShowWait 제거
function removeChatShowWait() {
  const Waitchat = document.querySelector(".chatShowWait");
  if (Waitchat) {
    Waitchat.parentNode.removeChild(Waitchat);
  }
}

// ShowSelect 생성
function makeShowSelect(accnum) {
  inputStatusOff();
  if (!(accnum.length == 2)) {
    const Selectchat = document.createElement("div");
    Selectchat.classList.add("ShowSelect");
    SelectchatAdd = document.createElement("div");
    SelectchatAdd.classList.add("SelectchatContent");
    SelectchatAdd.textContent = "추가적인 정보 도움";
    selectPrice = document.createElement("button");
    selectPrice.classList.add("selectPrice");
    selectPrice.textContent = "금액 계산";
    selectNomusa = document.createElement("button");
    selectNomusa.classList.add("selectNomusa");
    selectNomusa.textContent = "노무사 추천";
    selectCaselaw = document.createElement("button");
    selectCaselaw.classList.add("selectCaselaw");
    selectCaselaw.textContent = "유사한 판례";

    Selectchat.appendChild(SelectchatAdd);
    Selectchat.appendChild(selectPrice);
    Selectchat.appendChild(selectNomusa);
    Selectchat.appendChild(selectCaselaw);

    chat.appendChild(Selectchat);
    chat.scrollTop = chat.scrollHeight;

    // 노무사 추천 버튼 눌렀을 때
    const NomusaBtn = document.querySelector(".selectNomusa");
    NomusaBtn.addEventListener("click", async function () {
      try {
        const response = await fetch("/AI/nomusa", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await response.json();

        // 데이터 나타내기
        NomusaShow(data);
        NomusaClick();

        chat.scrollTop = chat.scrollHeight;
      } catch (error) {
        console.error("error ::", error);
      }
    });

    // 금액 계산 버튼을 눌렀을 때
    const calAmount = document.querySelector(".selectPrice");
    calAmount.addEventListener("click", async function () {
      try {
        inputStatusOn();
        // 입력 받기
        if (selectResult[0] == "요양") {
          answer =
            "실제 치료에 소요된 비용을 보상하는 것이기 때문에 직접적인 계산이 필요하지 않습니다.";
          makeShowAmount(answer);
        } else if (selectResult[0] == "휴업") {
          answer = "평균임금을 입력해주세요. (숫자만 입력, 예: 2000000)";
          makeShowAmount(answer);
        } else if (selectResult[0] == "장해") {
          answer =
            "평균임금 및 장해등급을 입력해주세요. (숫자만 입력, 예: 2000000, 3)";
          makeShowAmount(answer);
        } else if (selectResult[0] == "유족") {
          answer =
            "평균임금 및 유족보상연금수급권자 수를 입력해주세요. (숫자만 입력, 예: 2000000, 2)";
          makeShowAmount(answer);
        }
        amountClick();
        flag = true;
      } catch (error) {
        console.error("error ::", error);
      }
    });
    // 유사한 판례 검색 눌렀을 때
    const searchlaw = document.querySelector(".selectCaselaw");
    searchlaw.addEventListener("click", async function () {
      try {
        window.open(`/CaseLaw/data?accnum=${accnum}`);
      } catch (error) {
        console.error("error :: ", error);
      }
    });
  } else if (accnum.length == 2) {
    const Selectchat = document.createElement("div");
    Selectchat.classList.add("ShowSelect");
    SelectchatAdd = document.createElement("div");
    SelectchatAdd.classList.add("SelectchatContent");
    SelectchatAdd.textContent = "추가적인 정보 도움";
    selectCaselaw = document.createElement("button");
    selectCaselaw.classList.add("selectCaselaw");
    selectCaselaw.textContent = "유사한 판례";

    Selectchat.appendChild(SelectchatAdd);
    Selectchat.appendChild(selectCaselaw);

    chat.appendChild(Selectchat);
    chat.scrollTop = chat.scrollHeight;

    // 유사한 판례 검색 눌렀을 때
    const searchlaw = document.querySelector(".selectCaselaw");
    searchlaw.addEventListener("click", async function () {
      try {
        window.open(`/CaseLaw/data?accnum=${accnum[1]}`);
      } catch (error) {
        console.error("error :: ", error);
      }
    });
  }
}

// 엔터키 입력시 전송
document.getElementById("text").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    document.getElementById("textBtn").click();
  }
});

// 금액 계산 버튼 눌렀을 때
const priceBtn = document.querySelector(".selectPrice");
// priceBtn.addEventListener("click", function () {});

// NomusaShow 데이터 나타내기
function NomusaShow(data) {
  for (let i = 0; i < data.length; i++) {
    Showdata = document.createElement("div");
    Showdata.classList.add(`Nomusadata`);
    inputdata = document.createElement("div");
    inputdata.classList.add("NomusaContent");

    inputdata.innerHTML = `
    <img src="/static/image/${data[i].image}" alt="${data[i].name}" style="width:100px; height:auto;"><br>
    이름: ${data[i].name}<br>
    전화번호: ${data[i].phoneNumber}<br>
    이메일: ${data[i].email}<br>
    주소: ${data[i].address}
  `;

    Showdata.appendChild(inputdata);
    chat.appendChild(Showdata);
  }
}

// 이벤트 핸들러: 노무사 추천 버튼 클릭 시 처리
function NomusaClick() {
  const button = document.querySelector(".selectNomusa");
  if (button) {
    button.disabled = true;
    button.classList.add("disabled");
  }
}

function makeShowAmount(content) {
  const Amount = document.createElement("div");
  Amount.classList.add("chatShowAmount");
  AmountContent = document.createElement("div");
  AmountContent.classList.add("AmountContent");
  AmountContent.textContent = content;
  Amount.appendChild(AmountContent);

  chat.appendChild(Amount);

  chat.scrollTop = chat.scrollHeight;
}

// 이벤트 핸들러: 금액 계산 버튼 클릭 시 처리
function amountClick() {
  const button = document.querySelector(".selectPrice");
  if (button) {
    button.disabled = true;
    button.classList.add("disabled");
  }
  chat.scrollTop = chat.scrollHeight;
}

// 금액 계산/노무사 추천/유사판례 조회 버튼 생성 시 input, button 비활성화
function inputStatusOff() {
  document.getElementById("text").disabled = true;
  document.getElementById("textBtn").disabled = true;
}

// 금액 계산 버튼 클리 시 input, button 활성화
function inputStatusOn() {
  document.getElementById("text").disabled = false;
  document.getElementById("textBtn").disabled = false;
}
