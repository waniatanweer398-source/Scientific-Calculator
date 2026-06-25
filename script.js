
const display = document.getElementById("display");
const historyList = document.getElementById("history");
const modeBtn = document.getElementById("modeBtn");
const copyBtn = document.getElementById("copyBtn");

let isDegree = true;

/* =========================
   BASIC FUNCTIONS
========================= */

function append(value) {
    display.value += value;
}

function clearDisplay() {
    display.value = "";
}

function backspace() {
    display.value = display.value.slice(0, -1);
}

/* =========================
   DEG / RAD MODE
========================= */

modeBtn.addEventListener("click", () => {
    isDegree = !isDegree;
    modeBtn.textContent = isDegree ? "DEG" : "RAD";
});

/* =========================
   COPY RESULT
========================= */

copyBtn.addEventListener("click", () => {
    navigator.clipboard.writeText(display.value);

    const oldText = copyBtn.textContent;
    copyBtn.textContent = "COPIED";

    setTimeout(() => {
        copyBtn.textContent = oldText;
    }, 1200);
});

/* =========================
   FACTORIAL
========================= */

function factorial() {
    let n = Number(display.value);

    if (n < 0 || !Number.isInteger(n)) {
        display.value = "Error";
        return;
    }

    let result = 1;

    for (let i = 2; i <= n; i++) {
        result *= i;
    }

    display.value = result;
}

/* =========================
   SQUARE
========================= */

function square() {
    let num = Number(display.value);

    if (isNaN(num)) {
        display.value = "Error";
        return;
    }

    display.value = num * num;
}

/* =========================
   CALCULATE
========================= */

function calculate() {

    try {

        let exp = display.value;

        exp = exp.replace(/π/g, Math.PI);
        exp = exp.replace(/e/g, Math.E);

        exp = exp.replace(/\^/g, "**");

        exp = exp.replace(/sqrt\(/g, "Math.sqrt(");

        if (isDegree) {

            exp = exp.replace(/sin\((.*?)\)/g,
                (_, num) =>
                Math.sin(Number(num) * Math.PI / 180)
            );

            exp = exp.replace(/cos\((.*?)\)/g,
                (_, num) =>
                Math.cos(Number(num) * Math.PI / 180)
            );

            exp = exp.replace(/tan\((.*?)\)/g,
                (_, num) =>
                Math.tan(Number(num) * Math.PI / 180)
            );

        } else {

            exp = exp.replace(/sin\((.*?)\)/g,
                (_, num) =>
                Math.sin(Number(num))
            );

            exp = exp.replace(/cos\((.*?)\)/g,
                (_, num) =>
                Math.cos(Number(num))
            );

            exp = exp.replace(/tan\((.*?)\)/g,
                (_, num) =>
                Math.tan(Number(num))
            );
        }

        exp = exp.replace(/log\((.*?)\)/g,
            (_, num) => Math.log10(Number(num))
        );

        exp = exp.replace(/ln\((.*?)\)/g,
            (_, num) => Math.log(Number(num))
        );

        exp = exp.replace(/(\d+)%/g,
            (_, num) => Number(num) / 100
        );

        let result = eval(exp);

        if (!isFinite(result)) {
            display.value = "Error";
            return;
        }

        historyList.innerHTML =
            `<li>${display.value} = ${result}</li>` +
            historyList.innerHTML;

        display.value = result;

    } catch {

        display.value = "Error";
    }
}

/* =========================
   KEYBOARD SUPPORT
========================= */

document.addEventListener("keydown", (e) => {

    const key = e.key;

    if (
        "0123456789+-*/().".includes(key)
    ) {
        append(key);
    }

    if (key === "Enter") {
        e.preventDefault();
        calculate();
    }

    if (key === "Backspace") {
        backspace();
    }

    if (key === "Escape") {
        clearDisplay();
    }

    if (key === "%") {
        append("%");
    }
});