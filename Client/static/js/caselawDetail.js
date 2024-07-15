// 반응형 메뉴바
const menuBtn = document.querySelector("#category_bar");
const category = document.querySelector(".category");

menuBtn.addEventListener("click", () => {
  category.classList.toggle("active");
});

// 페이지 로드 시 데이터 입력
document.addEventListener("DOMContentLoaded", async () => {
  const urlParams = new URLSearchParams(window.location.search);
  const accnum = urlParams.get("accnum");
  if (accnum) {
    try {
      const response = await fetch("/CaseLaw/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ accnum: accnum }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      console.log(data);

      document.getElementById("courtNameShow").innerText =
        data.courtname || "N/A";
      document.getElementById("contentDetail1").innerText = data.title || "N/A";
      document.getElementById("contentDetail2").innerText = data.kinda || "N/A";
      document.getElementById("contentDetail3").innerText = data.kindb || "N/A";
      document.getElementById("contentDetail4").innerText = data.kindc || "N/A";
      document.getElementById("contentDetail5").innerText =
        data.content || "N/A";
    } catch (error) {
      console.error(
        "There has been a problem with your fetch operation:",
        error
      );
    }
  }
});
