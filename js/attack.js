// 몬스터 요소 가져오기
const monster = document.getElementById("GreenMonster");
let monsterHp = parseInt(monster.getAttribute("data-hp"));
let monsterMaxHp = parseInt(monster.getAttribute("data-max-hp"));
let heroAttack = 5;

let canAttack = true;
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// HP 바
const hpBarContainer = document.createElement("div");
hpBarContainer.style.position = "absolute";
hpBarContainer.style.width = "100px";
hpBarContainer.style.height = "10px";
hpBarContainer.style.background = "#333";
hpBarContainer.style.border = "1px solid black";

hpBarContainer.style.transform = "translateY(-20px)";
hpBarContainer.style.transform = "translateX(20px)"; // 몬스터 위에

const monsterHpFill = document.createElement("div");
monsterHpFill.style.width = "100%";
monsterHpFill.style.height = "100%";
monsterHpFill.style.background = "green";

hpBarContainer.appendChild(monsterHpFill);
monster.appendChild(hpBarContainer);

const monsterHpText = document.createElement("div");
monsterHpText.textContent = `HP: ${monsterHp}/${monsterMaxHp}`;
monsterHpText.style.position = "absolute";
monsterHpText.style.left = "20px";
monsterHpText.style.transform = "translateY(-20px)";
monsterHpText.style.color = "white";
monsterHpText.style.fontSize = "12px";
monster.appendChild(monsterHpText); // monster에 추가!

window.addEventListener("keydown", (e) => {
  const activeMap = document.querySelector(".map.active");
  const hero = document.getElementById("Hero");
  activeMap.appendChild(hero);
  // -----------------------------------------------------------------------

  // -----------------------------------------------------------------------
  // 방향키로 방향 전환
  if (e.key == "ArrowLeft" || e.key == "a") {
    hero.classList.remove("facing-right");
    hero.style.transform = "scaleX(-1)"; // 왼쪽 보기
  } else if (e.key == "ArrowRight" || e.key == "d") {
    hero.classList.add("facing-right");
    hero.style.transform = "scaleX(1)"; // 오른쪽 보기
  }

  // 공격 ([방향키 이동시]Z 또는 [WASD 이동시] J 키)
  if (e.key.toLowerCase() === "z" || e.key.toLowerCase() === "j") {
    // 쿨타임 체크
    if (!canAttack) return;
    canAttack = false;

    // 🔊 총알 사운드 (여기는 꼭 넣기!)
    const shootSound = new Audio("sound/gunSound.mp3");

    shootSound.currentTime = 0;
    shootSound.play();

    // 0.3초 쿨타임
    setTimeout(() => {
      canAttack = true;
    }, 300);

    // 0.5초 후에 다시 공격 가능
    setTimeout(() => {
      canAttack = true;
    }, 300);
    // 현재 방향 확인 (왼쪽이면 -1, 오른쪽이면 1)
    const currentScale = hero.classList.contains("facing-right") ? 1 : -1;

    // 총알
    const projectile = document.createElement("div");
    projectile.textContent = "⏺︎";
    projectile.style.position = "absolute";
    projectile.style.fontSize = "10px";

    // 히어로 위치에서 시작
    const heroRect = hero.getBoundingClientRect();
    const containerRect = hero.parentElement.getBoundingClientRect();

    projectile.style.left =
      heroRect.left - containerRect.left + heroRect.width / 2 + "px";
    projectile.style.top =
      heroRect.top - containerRect.top + heroRect.height / 3.2 + "px";

    hero.parentElement.appendChild(projectile);

    // 공격하면서 이동
    let projectileX = heroRect.left - containerRect.left + heroRect.width / 2;
    const startX = projectileX; // 시작 위치 저장

    const moveInterval = setInterval(() => {
      projectileX += 10 * currentScale; // 방향에 따라 이동
      projectile.style.left = projectileX + "px";

      // 히어로 공격 범위 설정
      if (Math.abs(projectileX - startX) > 100) {
        clearInterval(moveInterval);
        projectile.remove();
        return;
      }
      // -----------------------------------------------------------------------

      // -----------------------------------------------------------------------
      // 몬스터 히트박스 설정
      const monsterRect = monster.getBoundingClientRect();
      const projectileRect = projectile.getBoundingClientRect();

      const hitboxPadding = 1;

      if (
        projectileRect.left < monsterRect.right - hitboxPadding &&
        projectileRect.right > monsterRect.left + hitboxPadding &&
        projectileRect.top < monsterRect.bottom - hitboxPadding &&
        projectileRect.bottom > monsterRect.top + hitboxPadding
      ) {
        // 몬스터 hp 감소
        monsterHp -= heroAttack;
        if (monsterHp < 0) monsterHp = 0;

        const hpPercent = (monsterHp / monsterMaxHp) * 100;
        monsterHpFill.style.width = hpPercent + "%";
        monsterHpText.textContent = `HP: ${monsterHp}/${monsterMaxHp}`;

        const originalfilter = monster.style.filter;
        monster.style.filter =
          "brightness(1.5) sepia(1) saturate(5) hue-rotate(-50deg)";

        setTimeout(() => {
          monster.style.filter = originalfilter;
        }, 200);

        if (monsterHp == 0) {
          monster.style.display = "none";
          hpBarContainer.style.display = "none"; // HP 바도 숨기기

          monsterHpText.style.display = "none"; // HP 텍스트도 숨기기

          monsterHpText.style.display = "none";

          const deathSound = new Audio("sound/monsterDeath.mp3");
          deathSound.currentTime = 0;
          deathSound
            .play()
            .catch((err) => console.log("사운드 재생 실패:", err));

          // 10초 후 몬스터 리젠
          setTimeout(() => {
            monsterHp = monsterMaxHp; // HP 회복
            monster.style.display = "block"; // 몬스터 다시 보이기
            hpBarContainer.style.display = "block";
            monsterHpText.style.display = "block";

            // 리젠 이후에 체력 다시 채우기
            monsterHpFill.style.width = "100%";
            monsterHpText.textContent = `HP: ${monsterHp}/${monsterMaxHp}`;
          }, 10000); // 10초
        }

        // 발사체 제거
        clearInterval(moveInterval);
        projectile.remove();
      }
    }, 20);
  }
});
