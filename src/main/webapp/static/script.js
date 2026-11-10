const canvas = document.getElementById("plot");
const ctx = canvas.getContext("2d");
const rInput = document.getElementById("r");

const SIZE = canvas.width;
const ORIGIN = SIZE / 2;
const SCALE = 32;

function currentR() {
  return rInput.value === "" ? null : Number(rInput.value);
}

function toCanvas(x, y) {
  return {
    px: ORIGIN + x * SCALE,
    py: ORIGIN - y * SCALE,
  };
}

function draw() {
  ctx.clearRect(0, 0, SIZE, SIZE);
  if (currentR() !== null) {
    drawRegion();
  }
  drawAxes();
  for (const row of resultsBody.rows) {
    if (Number(row.dataset.r) === currentR()) {
      drawPoint(Number(row.dataset.x), Number(row.dataset.y), row.dataset.hit === "true");
    }
  }
}

function drawRegion() {
  const r = currentR();
  const half = r * SCALE / 2;

  ctx.save();
  ctx.translate(ORIGIN, ORIGIN);
  ctx.scale(1, -1);

  ctx.fillStyle = "rgba(70, 130, 180, 0.55)";
  ctx.strokeStyle = "rgba(40, 80, 120, 0.9)";
  ctx.lineWidth = 1;

  ctx.beginPath();
  ctx.rect(-half, -r * SCALE, half, r * SCALE);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-r * SCALE, 0);
  ctx.lineTo(0, 0);
  ctx.lineTo(0, half);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.arc(0, 0, half, 0, Math.PI / 2);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.restore();
}

function drawAxes() {
  const r = currentR();

  ctx.strokeStyle = "#2c2c2c";
  ctx.fillStyle = "#2c2c2c";
  ctx.lineWidth = 1.5;
  ctx.font = "12px Arial, sans-serif";

  ctx.beginPath();
  ctx.moveTo(16, ORIGIN);
  ctx.lineTo(SIZE - 16, ORIGIN);
  ctx.moveTo(ORIGIN, SIZE - 16);
  ctx.lineTo(ORIGIN, 16);
  ctx.stroke();

  drawArrow(SIZE - 16, ORIGIN, 0);
  drawArrow(ORIGIN, 16, -Math.PI / 2);

  ctx.textAlign = "center";
  ctx.textBaseline = "top";
  ctx.fillText("x", SIZE - 14, ORIGIN + 8);

  ctx.textAlign = "left";
  ctx.textBaseline = "bottom";
  ctx.fillText("y", ORIGIN + 8, 16);

  if (r === null) {
    return;
  }

  const ticks = [
    { value: -r, label: (-r).toString() },
    { value: -r / 2, label: (-r / 2).toString() },
    { value: r / 2, label: (r / 2).toString() },
    { value: r, label: r.toString() },
  ];

  ctx.lineWidth = 1;
  ticks.forEach(function (tick) {
    const xTick = toCanvas(tick.value, 0);
    const yTick = toCanvas(0, tick.value);

    ctx.beginPath();
    ctx.moveTo(xTick.px, ORIGIN - 5);
    ctx.lineTo(xTick.px, ORIGIN + 5);
    ctx.stroke();

    ctx.textAlign = "center";
    ctx.textBaseline = "top";
    ctx.fillText(tick.label, xTick.px, ORIGIN + 8);

    ctx.beginPath();
    ctx.moveTo(ORIGIN - 5, yTick.py);
    ctx.lineTo(ORIGIN + 5, yTick.py);
    ctx.stroke();

    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(tick.label, ORIGIN + 8, yTick.py);
  });
}

function drawArrow(x, y, angle) {
  const length = 10;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - length * Math.cos(angle - 0.4),
    y - length * Math.sin(angle - 0.4)
  );
  ctx.moveTo(x, y);
  ctx.lineTo(
    x - length * Math.cos(angle + 0.4),
    y - length * Math.sin(angle + 0.4)
  );
  ctx.stroke();
}

function drawPoint(x, y, hit) {
  const point = toCanvas(x, y);
  ctx.beginPath();
  ctx.fillStyle = hit ? "#1b7a3d" : "#a31d1d";
  ctx.arc(point.px, point.py, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#2c2c2c";
  ctx.lineWidth = 1;
  ctx.stroke();
}

const form = document.getElementById("point-form");
const yInput = document.getElementById("y");
const errorBox = document.getElementById("form-error");
const submitButton = document.getElementById("submit-point");
const resultsBody = document.querySelector("#results tbody");

function validateForm() {
  if (form.querySelectorAll("input[name='x']:checked").length !== 1) {
    return "Выберите ровно одно значение X";
  }

  const yText = yInput.value.trim().replace(",", ".");
  if (!/^[-+]?(?:\d+(?:\.\d+)?|\.\d+)$/.test(yText)) {
    return "Y должен быть десятичным числом";
  }

  const integerPart = Number.parseInt(yText, 10) || 0;
  if (integerPart <= -5 || integerPart >= 3) {
    return "Y должен быть между -5 и 3, не включая границы";
  }
  if (currentR() === null) {
    return "Выберите значение R из списка";
  }
  return "";
}

form.addEventListener("submit", function (event) {
  const error = validateForm();
  errorBox.textContent = error;
  if (error || submitButton.disabled) {
    event.preventDefault();
  }
});

canvas.addEventListener("click", async function (event) {
  const r = currentR();
  if (r === null) {
    errorBox.textContent = "Невозможно определить координаты: сначала выберите R";
    return;
  }
  if (submitButton.disabled) {
    return;
  }

  const bounds = canvas.getBoundingClientRect();
  const left = bounds.left + canvas.clientLeft;
  const top = bounds.top + canvas.clientTop;
  const px = (event.clientX - left) * canvas.width / canvas.clientWidth;
  const py = (event.clientY - top) * canvas.height / canvas.clientHeight;
  if (px < 0 || py < 0 || px > canvas.width || py > canvas.height) {
    return;
  }

  const x = ((px - ORIGIN) / SCALE).toFixed(6);
  const y = ((ORIGIN - py) / SCALE).toFixed(6);
  const body = new URLSearchParams({ x, y, r, source: "graph" });
  submitButton.disabled = true;
  errorBox.textContent = "";

  try {
    const response = await fetch(form.action, { method: "POST", body });
    const text = await response.text();
    const page = new DOMParser().parseFromString(text, "text/html");
    if (!response.ok) {
      const message = page.querySelector("#result-error, #form-error")?.textContent;
      throw new Error(message || "Сервер вернул ошибку " + response.status);
    }

    const row = page.querySelector("#checked-point tr");
    if (!row) {
      throw new Error("Ответ сервера не содержит результата проверки");
    }
    resultsBody.prepend(document.importNode(row, true));
    draw();
  } catch (error) {
    errorBox.textContent = error.message || "Не удалось связаться с сервером";
  } finally {
    submitButton.disabled = false;
  }
});

rInput.addEventListener("change", function () {
  errorBox.textContent = "";
  draw();
});

if (resultsBody.rows.length > 0) {
  rInput.value = resultsBody.rows[0].dataset.r;
}
draw();
