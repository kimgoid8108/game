// 전역 변수로 닉네임 저장
window.playerNickname = "";

const urlParams = new URLSearchParams(window.location.search);
let nickname = urlParams.get("nickname");

if (!nickname) {
  document.getElementById("nicknameModal").style.display = "flex";

  document.getElementById("nicknameSubmit").addEventListener("click", () => {
    const input = document.getElementById("nicknameInput");
    nickname = input.value.trim();

    if (nickname === "") {
      alert("닉네임을 입력해주세요!");
      return;
    }

    window.playerNickname = nickname;
    document.getElementById("ninkname").textContent = "이름: " + nickname;
    document.getElementById("nicknameModal").style.display = "none";
  });

  document.getElementById("nicknameInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      document.getElementById("nicknameSubmit").click();
    }
  });
} else {
  window.playerNickname = nickname;
  document.getElementById("ninkname").textContent = "이름: " + nickname;
}
