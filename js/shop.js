const owner = document.querySelector("#owner");
const shopinven = document.querySelector("#shopinven");
const close = document.querySelector("#close");

const potion = document.querySelector("#potion");
const potioninfo = document.querySelector("#potioninfo");

const sword = document.querySelector("#sword");
const swordinfo = document.querySelector("#swordinfo");

const potionYes = document.querySelector("#potionYes");
const potionNo = document.querySelector("#potionNo");

const swordYes = document.querySelector("#swordYes");
const swordNo = document.querySelector("#swordNo");

owner.addEventListener("click", () => {
  shopinven.style.display = "block";
});

close.addEventListener("click", () => {
  shopinven.style.display = "none";
});

potion.addEventListener("click", () => {
  potioninfo.style.display = "block";
});

potionYes.addEventListener("click", () => {
  alert("구매완료");
  addToInventory("작은 포션🧪");
  potioninfo.style.display = "none";
});

potionNo.addEventListener("click", () => {
  potioninfo.style.display = "none";
});

sword.addEventListener("click", () => {
  swordinfo.style.display = "flex";
});

swordYes.addEventListener("click", () => {
  alert("구매완료");
  addToInventory("철검🗡️");
  swordinfo.style.display = "none";
});

swordNo.addEventListener("click", () => {
  swordinfo.style.display = "none";
});

function addToInventory(itemName) {
  let inventory = JSON.parse(localStorage.getItem("inventory")) || {};

  if (inventory[itemName]) {
    inventory[itemName] += 1;
  } else {
    inventory[itemName] = 1;
  }

  localStorage.setItem("inventory", JSON.stringify(inventory));
  updateInventoryUI();
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
    alert("사용할 아이템이 없습니다!");
    return;
  }
}
// 아이템 종류에 따라 효과 적용
if (itemName == "작은포션🧪") {
  // 체력 회복
  const hpElement = document.getElementById("HP");
  if (hpElement) {
    const hpText = hpElement.textContent;
    const hpMatch = hpText.match(/(\d+)\/(\d+)/);

    if (hpMatch) {
      let currentHP = parseInt(hpMatch[1]);
      let maxHP = parseInt(hpMatch[2]);

      // 체력 50 회복
      currentHP = Math.min(currentHP + 50, maxHP);
      hpElement.textContent = `체력: ${currentHP}/${maxHP}`;

      alert("체력을 50 회복했습니다!");

      // 아이템 개수 감소
      inventory[itemName] -= 1;
      if (inventory[itemName] <= 0) {
        delete inventory[itemName];
      }

      localStorage.setItem("inventory", JSON.stringify(inventory));
      updateInventoryUI();
    }
  }
  // 정확한 비교
  if (itemName.includes("작은포션") || itemName === "작은포션🧪") {
    console.log("✅ 포션 사용!");
    const hpElement = document.getElementById("HP");

    if (hpElement) {
      let currentHP = parseInt(hpElement.textContent);
      const maxHP = 100;

      currentHP = Math.min(currentHP + 50, maxHP);
      hpElement.textContent = currentHP;

      alert(`체력을 50 회복했습니다! (${currentHP}/${maxHP})`);

      inventory[itemName] -= 1;
      if (inventory[itemName] <= 0) {
        delete inventory[itemName];
      }

      localStorage.setItem("inventory", JSON.stringify(inventory));
      updateInventoryUI();
    }
  } else if (itemName == "철검🗡️") {
    // 무기 장착
    alert("철검을 장착했습니다!");
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

    // 장착 상태 저장 (필요시 사용)
    localStorage.setItem("equippedWeapon", "철검🗡️");

    // 철검은 소모품이 아니므로 개수를 줄이지 않음
  } else {
    alert(`${itemName}을(를) 사용했습니다!`);

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
