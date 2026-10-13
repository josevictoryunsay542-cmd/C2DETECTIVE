
    const form = document.getElementById("passcodeForm");
    const passcodeInput = document.getElementById("passcode");
    const message = document.getElementById("message");
    const funFact = document.getElementById("funFact");

    form.addEventListener("submit", function(event) {
        event.preventDefault();

        let passcode = parseInt(passcodeInput.value);

        if (passcode === 143) {
            message.textContent = "Passcode accepted. File unlocked.";
            message.style.color = "#9acba4";
            funFact.style.display = "block";
        }

        if (passcode !== 143) {
            message.textContent = "ACCESS DENIED - Incorrect passcode.";
            message.style.color = "#e18b8b";
            funFact.style.display = "none";
        }
    });
