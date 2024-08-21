function reserveItem(button) {
    const modal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const span = document.getElementsByClassName("close")[0];
    let itemId = button.parentElement.parentElement.getAttribute("data-item-id");
    let isChecked = button.classList.contains("checked");
    let modal_text = modal.querySelector(".modal-text");
    if (isChecked) {
        animate = false;
        modal_text.innerText = texts["reserve_cancel"];
    } else {
        animate = true;
        modal_text.innerText = texts["reserve_confirm"];
    }
    modal.style.display = "block";
    confirmBtn.onclick = function() {
        modal.style.display = "none";
        fetch(`/reserve/${itemId}/?checked=${Number(isChecked)}`, { 
            method: "POST",
            headers: {
                "X-CSRFToken": getCookie("csrftoken")
            }
        })
        .then(response => response.json())
        .then(data => {
            var item = document.querySelector(`li[data-item-id="${data.item_id}"]`);
            if (data.conflict) {
                animate = false;
                modal.style.display = "block";
                modal.querySelectorAll(".modal-button").forEach(function(elem){elem.style.display="none"});
                modal_text.innerText = texts["reserve_conflict"];
                cancelBtn.onclick = span.onclick = function() {
                    window.location = "/";
                }
            } else if (data.is_reserved === false) {
                button.classList.remove("checked");
                button.classList.add("glow");
                item.querySelectorAll(".reserved").forEach(function(elem){elem.remove()});
                item.classList.remove("reserved_item");
            } else if (data.is_reserved === true) {
                button.classList.add("checked");
                button.classList.remove("glow");
                item.classList.add("reserved_item");
                let tmp = document.createElement("span");
                tmp.className = "reserved";
                tmp.innerText = texts["reserved"];
                item.querySelector(".name").appendChild(tmp);
                pop(button);
            }
        })
        .catch(error => {
            console.error("Request failed");
        });
    }
    cancelBtn.onclick = span.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}

function initDragAndDrop() {
    document.querySelectorAll("li[draggable='true']").forEach(item => {
        item.addEventListener("dragstart", dragStart);
        item.addEventListener("dragover", dragOver);
        item.addEventListener("drop", dropItem);
        item.addEventListener("dragend", dragEnd);
    });
}

function dragStart(event) {
    draggedItem = event.target;
    setTimeout(() => {
        draggedItem.classList.add("dragging");
    }, 0);
}

function dragOver(event) {
    event.preventDefault();
    const target = event.target.closest("li");
    if (target && target !== draggedItem) {
        target.parentNode.insertBefore(draggedItem, target.nextSibling);
    }
}

function dropItem(event) {
    event.preventDefault();
}

function dragEnd(event) {
    event.target.classList.remove("dragging");
    draggedItem = null;

    const listItems = document.querySelectorAll("#list_container li");
    const order = Array.from(listItems).map((item, index) => ({
        id: item.getAttribute("data-item-id"),
        order: index + 1
    }));
    fetch("/change_order/", {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken")
        },
        body: JSON.stringify({ order })
    })
    .then(response => response.json())
    .catch(error => {
        console.error("Request failed", error);
    });
}

function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + "=")) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

function deleteItem() {
    let modal = document.getElementById("confirmModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");
    const span = document.getElementsByClassName("close")[0];
    let itemId = document.getElementById("edit_container").getAttribute("data-item-id");
    modal.querySelector(".modal-text").innerText = texts["delete_confirm"];
    modal.style.display = "block";
    confirmBtn.onclick = function() {
        modal.style.display = "none";
        fetch(`/delete/${itemId}/`, { 
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "X-CSRFToken": getCookie("csrftoken")
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status == 0) {
                window.location.href = "/";
            }
        })
        .catch(error => {
            console.error("Request failed", error);
        });
    }
    cancelBtn.onclick = span.onclick = function() {
        modal.style.display = "none";
    }
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
}