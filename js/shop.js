document.addEventListener("DOMContentLoaded", () => {
  const owner = document.querySelector("#owner");
  const shopinven = document.querySelector("#shopinven");
  const close = document.querySelector("#close");

  if (owner && shopinven) {
    owner.addEventListener("click", () => {
      shopinven.style.display = "block";
    });
  }

  if (close && shopinven) {
    close.addEventListener("click", () => {
      shopinven.style.display = "none";
    });
  }
});

const potion = document.querySelector("#potion");
const potioninfo = document.querySelector("#potioninfo");
const bigPotion = document.querySelector("#bigPotion");
const bigPotioninfo = document.querySelector("#bigPotioninfo");
const attackPotion = document.querySelector("#attackPotion");
const attackPotioninfo = document.querySelector("#attackPotioninfo");
const defensePotion = document.querySelector("#defensePotion");
const defensePotioninfo = document.querySelector("#defensePotioninfo");
const expPotion = document.querySelector("#expPotion");
const expPotioninfo = document.querySelector("#expPotioninfo");
const goldPotion = document.querySelector("#goldPotion");
const goldPotioninfo = document.querySelector("#goldPotioninfo");

const potionYes = document.querySelector("#potionYes");
const potionNo = document.querySelector("#potionNo");
const bigPotionYes = document.querySelector("#bigPotionYes");
const bigPotionNo = document.querySelector("#bigPotionNo");
const attackPotionYes = document.querySelector("#attackPotionYes");
const attackPotionNo = document.querySelector("#attackPotionNo");
const defensePotionYes = document.querySelector("#defensePotionYes");
const defensePotionNo = document.querySelector("#defensePotionNo");
const expPotionYes = document.querySelector("#expPotionYes");
const expPotionNo = document.querySelector("#expPotionNo");
const goldPotionYes = document.querySelector("#goldPotionYes");
const goldPotionNo = document.querySelector("#goldPotionNo");

if (potion && potioninfo) {
  potion.addEventListener("click", () => {
    potioninfo.style.display = "flex";
  });
}

if (potionYes && potionNo) {
  potionYes.addEventListener("click", () => {
    let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
    if (playerGold >= 10) {
      playerGold -= 10;
      localStorage.setItem("playerGold", playerGold);
      addToInventory("작은 포션🧪");
      if (potioninfo) potioninfo.style.display = "none";
      showItemNotification("구매완료", "작은 포션🧪을 구매했습니다!");
    } else {
      showItemNotification("알림", "골드가 부족합니다!");
      if (potioninfo) potioninfo.style.display = "none";
    }
  });

  potionNo.addEventListener("click", () => {
    if (potioninfo) potioninfo.style.display = "none";
  });
}

// 큰 포션
if (bigPotion && bigPotioninfo) {
  bigPotion.addEventListener("click", () => {
    bigPotioninfo.style.display = "flex";
  });
}

if (bigPotionYes && bigPotionNo) {
  bigPotionYes.addEventListener("click", () => {
    let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
    if (playerGold >= 25) {
      playerGold -= 25;
      localStorage.setItem("playerGold", playerGold);
      addToInventory("큰 포션🧪");
      if (bigPotioninfo) bigPotioninfo.style.display = "none";
      showItemNotification("구매완료", "큰 포션🧪을 구매했습니다!");
    } else {
      showItemNotification("알림", "골드가 부족합니다!");
      if (bigPotioninfo) bigPotioninfo.style.display = "none";
    }
  });

  bigPotionNo.addEventListener("click", () => {
    if (bigPotioninfo) bigPotioninfo.style.display = "none";
  });
}

// 공격력 포션
if (attackPotion && attackPotioninfo) {
  attackPotion.addEventListener("click", () => {
    attackPotioninfo.style.display = "flex";
  });
}

if (attackPotionYes && attackPotionNo) {
  attackPotionYes.addEventListener("click", () => {
    let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
    if (playerGold >= 30) {
      playerGold -= 30;
      localStorage.setItem("playerGold", playerGold);
      addToInventory("공격력 포션⚔️");
      if (attackPotioninfo) attackPotioninfo.style.display = "none";
      showItemNotification("구매완료", "공격력 포션⚔️을 구매했습니다!");
    } else {
      showItemNotification("알림", "골드가 부족합니다!");
      if (attackPotioninfo) attackPotioninfo.style.display = "none";
    }
  });

  attackPotionNo.addEventListener("click", () => {
    if (attackPotioninfo) attackPotioninfo.style.display = "none";
  });
}

// 방어력 포션
if (defensePotion && defensePotioninfo) {
  defensePotion.addEventListener("click", () => {
    defensePotioninfo.style.display = "flex";
  });
}

if (defensePotionYes && defensePotionNo) {
  defensePotionYes.addEventListener("click", () => {
    let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
    if (playerGold >= 30) {
      playerGold -= 30;
      localStorage.setItem("playerGold", playerGold);
      addToInventory("방어력 포션🛡️");
      if (defensePotioninfo) defensePotioninfo.style.display = "none";
      showItemNotification("구매완료", "방어력 포션🛡️을 구매했습니다!");
    } else {
      showItemNotification("알림", "골드가 부족합니다!");
      if (defensePotioninfo) defensePotioninfo.style.display = "none";
    }
  });

  defensePotionNo.addEventListener("click", () => {
    if (defensePotioninfo) defensePotioninfo.style.display = "none";
  });
}

// 경험치 포션
if (expPotion && expPotioninfo) {
  expPotion.addEventListener("click", () => {
    expPotioninfo.style.display = "flex";
  });
}

if (expPotionYes && expPotionNo) {
  expPotionYes.addEventListener("click", () => {
    let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
    if (playerGold >= 40) {
      playerGold -= 40;
      localStorage.setItem("playerGold", playerGold);
      addToInventory("경험치 포션⭐");
      if (expPotioninfo) expPotioninfo.style.display = "none";
      showItemNotification("구매완료", "경험치 포션⭐을 구매했습니다!");
    } else {
      showItemNotification("알림", "골드가 부족합니다!");
      if (expPotioninfo) expPotioninfo.style.display = "none";
    }
  });

  expPotionNo.addEventListener("click", () => {
    if (expPotioninfo) expPotioninfo.style.display = "none";
  });
}

// 골드 포션
if (goldPotion && goldPotioninfo) {
  goldPotion.addEventListener("click", () => {
    goldPotioninfo.style.display = "flex";
  });
}

if (goldPotionYes && goldPotionNo) {
  goldPotionYes.addEventListener("click", () => {
    let playerGold = parseInt(localStorage.getItem("playerGold")) || 0;
    if (playerGold >= 40) {
      playerGold -= 40;
      localStorage.setItem("playerGold", playerGold);
      addToInventory("골드 포션💰");
      if (goldPotioninfo) goldPotioninfo.style.display = "none";
      showItemNotification("구매완료", "골드 포션💰을 구매했습니다!");
    } else {
      showItemNotification("알림", "골드가 부족합니다!");
      if (goldPotioninfo) goldPotioninfo.style.display = "none";
    }
  });

  goldPotionNo.addEventListener("click", () => {
    if (goldPotioninfo) goldPotioninfo.style.display = "none";
  });
}

// ⭐ 아이템 알림 박스 표시 함수
function showItemNotification(title, message) {
  const notification = document.createElement("div");
  notification.className = "reward-notification item-notification";
  notification.innerHTML = `
    <div class="reward-content">
      <h3>${title}</h3>
      <p>${message}</p>
    </div>
  `;
  document.body.appendChild(notification);

  // 애니메이션으로 나타남
  setTimeout(() => {
    notification.classList.add("show");
  }, 10);

  // 2초 후 사라짐
  setTimeout(() => {
    notification.classList.remove("show");
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 2000);
}

function addToInventory(itemName) {
  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  if (inventory[itemName]) {
    inventory[itemName] += 1;
  } else {
    inventory[itemName] = 1;
  }

  localStorage.setItem("inventory", JSON.stringify(inventory));
  updateInventoryUI();

  // 하단 UI 퀵슬롯 업데이트
  if (typeof window.updateQuickSlots === "function") {
    window.updateQuickSlots();
  }
}

function updateInventoryUI() {
  const inventoryList = document.getElementById("inventory-items");
  if (!inventoryList) return;

  inventoryList.innerHTML = "";

  const inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  for (const [item, count] of Object.entries(inventory)) {
    const li = document.createElement("li");
    li.textContent = count > 1 ? `${item} x${count}` : item;
    li.style.cursor = "pointer";
    li.style.padding = "5px";
    li.style.borderRadius = "5px";
    li.style.transition = "background 0.2s";

    // 호버 효과
    li.addEventListener("mouseenter", () => {
      li.style.background = "rgba(255, 255, 255, 0.1)";
    });
    li.addEventListener("mouseleave", () => {
      li.style.background = "transparent";
    });

    // 클릭 이벤트 - 아이템 사용
    li.addEventListener("click", () => {
      useItem(item);
    });

    inventoryList.appendChild(li);
  }
}

// 아이템 사용 함수
function useItem(itemName) {
  const inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  if (!inventory[itemName] || inventory[itemName] <= 0) {
    showItemNotification("알림", "사용할 아이템이 없습니다!");
    return;
  }

  // 아이템 종류에 따라 효과 적용
  if (itemName === "작은 포션🧪" || itemName.includes("작은 포션")) {
    // 체력 회복
    const hpElement = document.getElementById("HP");
    if (hpElement) {
      // HP 요소는 span이므로 부모 요소에서 전체 텍스트 가져오기
      const hpParent = hpElement.parentElement;
      const hpText = hpParent.textContent;
      const hpMatch = hpText.match(/(\d+)\/(\d+)/);

      if (hpMatch) {
        let currentHP = parseInt(hpMatch[1]);
        let maxHP = parseInt(hpMatch[2]);

        // 체력 50 회복
        currentHP = Math.min(currentHP + 50, maxHP);
        // span 요소만 업데이트 (숫자만)
        hpElement.textContent = currentHP;

        showItemNotification("체력 회복", `체력을 50 회복했습니다! (${currentHP}/${maxHP})`);

        // 아이템 개수 감소
        inventory[itemName] -= 1;
        if (inventory[itemName] <= 0) {
          delete inventory[itemName];
        }

        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateInventoryUI();
      } else {
        // HP 형식이 다른 경우 (숫자만 있는 경우)
        let currentHP = parseInt(hpElement.textContent) || 0;
        const maxHP = 100;

        currentHP = Math.min(currentHP + 50, maxHP);
        // span 요소만 업데이트 (숫자만)
        hpElement.textContent = currentHP;

        showItemNotification("체력 회복", `체력을 50 회복했습니다! (${currentHP}/${maxHP})`);

        inventory[itemName] -= 1;
        if (inventory[itemName] <= 0) {
          delete inventory[itemName];
        }

        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateInventoryUI();

        // 하단 UI 업데이트
        if (typeof window.updateBottomUI === "function") {
          window.updateBottomUI();
        }
      }
    }
  } else if (itemName === "철검🗡️") {
    // 무기 장착
    showItemNotification("무기 장착", "철검을 장착했습니다!");
    const heroElement = document.getElementById("Hero");
    const heroInfoPhoto = document.querySelector("#Heroinfo .photo");
    const ironSword = document.querySelector(
      '#inventory-items li[data-name="철검🗡️"]'
    );

    if (heroElement) {
      heroElement.style.backgroundImage = "url('image/Swordhero.png')";
    }

    if (heroInfoPhoto) {
      heroInfoPhoto.src = "image/Swordhero.png";
    }

    if (ironSword && !ironSword.textContent.includes("사용중")) {
      ironSword.textContent += " (사용중)";
    }

    // 장착 상태 저장
    localStorage.setItem("equippedWeapon", "철검🗡️");

    // 하단 UI 무기 슬롯 업데이트
    if (typeof window.updateWeaponSlots === "function") {
      window.updateWeaponSlots();
    }

    // ⭐ 철검 장착 시 인벤토리에 총 추가
    const gunInventory = JSON.parse(localStorage.getItem("inventory")) || {};
    if (!gunInventory["총🔫"]) {
      gunInventory["총🔫"] = 1;
      localStorage.setItem("inventory", JSON.stringify(gunInventory));
      updateInventoryUI();
    }

    // 철검은 소모품이 아니므로 개수를 줄이지 않음
  } else if (itemName === "큰 포션🧪") {
    // 체력 100 회복
    const hpElement = document.getElementById("HP");
    if (hpElement) {
      const hpParent = hpElement.parentElement;
      const hpText = hpParent.textContent;
      const hpMatch = hpText.match(/(\d+)\/(\d+)/);

      if (hpMatch) {
        let currentHP = parseInt(hpMatch[1]);
        let maxHP = parseInt(hpMatch[2]);

        currentHP = Math.min(currentHP + 100, maxHP);
        hpElement.textContent = currentHP;

        showItemNotification("체력 회복", `체력을 100 회복했습니다! (${currentHP}/${maxHP})`);

        inventory[itemName] -= 1;
        if (inventory[itemName] <= 0) {
          delete inventory[itemName];
        }

        localStorage.setItem("inventory", JSON.stringify(inventory));
        updateInventoryUI();

        if (typeof window.updateBottomUI === "function") {
          window.updateBottomUI();
        }
      }
    }
  } else if (itemName === "공격력 포션⚔️") {
    // 공격력 증가 (임시로 5분간)
    showItemNotification("버프 획득", "공격력이 5분간 증가했습니다!");

    // 버프 저장 (나중에 구현 가능)
    const buffs = JSON.parse(localStorage.getItem("buffs")) || {};
    buffs.attack = Date.now() + 300000; // 5분
    localStorage.setItem("buffs", JSON.stringify(buffs));

    inventory[itemName] -= 1;
    if (inventory[itemName] <= 0) {
      delete inventory[itemName];
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryUI();
  } else if (itemName === "방어력 포션🛡️") {
    // 방어력 증가 (임시로 5분간)
    showItemNotification("버프 획득", "방어력이 5분간 증가했습니다!");

    const buffs = JSON.parse(localStorage.getItem("buffs")) || {};
    buffs.defense = Date.now() + 300000; // 5분
    localStorage.setItem("buffs", JSON.stringify(buffs));

    inventory[itemName] -= 1;
    if (inventory[itemName] <= 0) {
      delete inventory[itemName];
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryUI();
  } else if (itemName === "경험치 포션⭐") {
    // 경험치 2배 획득 버프 (5분간)
    showItemNotification("버프 획득", "경험치 2배 획득 버프가 5분간 지속됩니다!");

    const buffs = JSON.parse(localStorage.getItem("buffs")) || {};
    buffs.exp = Date.now() + 300000; // 5분
    localStorage.setItem("buffs", JSON.stringify(buffs));

    inventory[itemName] -= 1;
    if (inventory[itemName] <= 0) {
      delete inventory[itemName];
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryUI();
  } else if (itemName === "골드 포션💰") {
    // 골드 2배 획득 버프 (5분간)
    showItemNotification("버프 획득", "골드 2배 획득 버프가 5분간 지속됩니다!");

    const buffs = JSON.parse(localStorage.getItem("buffs")) || {};
    buffs.gold = Date.now() + 300000; // 5분
    localStorage.setItem("buffs", JSON.stringify(buffs));

    inventory[itemName] -= 1;
    if (inventory[itemName] <= 0) {
      delete inventory[itemName];
    }
    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryUI();
  } else if (itemName === "총🔫") {
    // 총 장착
    showItemNotification("무기 장착", "총을 장착했습니다!");
    const heroElement = document.getElementById("Hero");
    const heroInfoPhoto = document.querySelector("#Heroinfo .photo");
    const gun = document.querySelector(
      '#inventory-items li[data-name="총🔫"]'
    );

    // 총 장착 시 기본 히어로 이미지로 변경 (검 이미지 제거)
    if (heroElement) {
      heroElement.style.backgroundImage = "url('image/hero.png')";
    }

    if (heroInfoPhoto) {
      heroInfoPhoto.src = "image/hero.png";
    }

    if (gun && !gun.textContent.includes("사용중")) {
      gun.textContent += " (사용중)";
    }

    // 장착 상태 저장
    localStorage.setItem("equippedWeapon", "총🔫");

    // 하단 UI 무기 슬롯 업데이트
    if (typeof window.updateWeaponSlots === "function") {
      window.updateWeaponSlots();
    }

    // 총은 소모품이 아니므로 개수를 줄이지 않음
  } else {
    showItemNotification("아이템 사용", `${itemName}을(를) 사용했습니다!`);

    // 기타 아이템은 소모
    inventory[itemName] -= 1;
    if (inventory[itemName] <= 0) {
      delete inventory[itemName];
    }

    localStorage.setItem("inventory", JSON.stringify(inventory));
    updateInventoryUI();
  }
}

// 페이지 로드시 인벤토리 UI 업데이트
document.addEventListener("DOMContentLoaded", () => {
  updateInventoryUI();
});
