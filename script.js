/* ============================================================
   EnCRITed – FCRIT Cipher Lab – script.js
   All cipher logic, UI wiring, theme toggle, and step rendering.
   Pure vanilla JS – no dependencies.
   ============================================================ */

(function () {
  "use strict";

  // ─────────────────── Theme Toggle ───────────────────
  const $themeToggle = document.getElementById("themeToggle");
  const savedTheme = localStorage.getItem("encrited-theme") || "dark";
  document.documentElement.setAttribute("data-theme", savedTheme);

  $themeToggle.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme");
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    localStorage.setItem("encrited-theme", next);
  });

  // ─────────────────── Copy Button ───────────────────
  const $copyBtn = document.getElementById("copyBtn");
  if ($copyBtn) {
    $copyBtn.addEventListener("click", () => {
      const text = document.getElementById("resultText").textContent;
      navigator.clipboard.writeText(text).then(() => {
        $copyBtn.classList.add("copied");
        $copyBtn.querySelector("span").textContent = "Copied!";
        setTimeout(() => {
          $copyBtn.classList.remove("copied");
          $copyBtn.querySelector("span").textContent = "Copy";
        }, 1500);
      });
    });
  }

  // ─────────────────── DOM References ───────────────────
  const $cipherType = document.getElementById("cipherType");
  const $algorithm = document.getElementById("algorithm");
  const $dynamicFields = document.getElementById("dynamicFields");
  const $removeSpaces = document.getElementById("removeSpaces");
  const $btnEncrypt = document.getElementById("btnEncrypt");
  const $btnDecrypt = document.getElementById("btnDecrypt");
  const $errorBox = document.getElementById("errorBox");
  const $resultCard = document.getElementById("resultCard");
  const $resultText = document.getElementById("resultText");
  const $stepsCard = document.getElementById("stepsCard");
  const $stepsContent = document.getElementById("stepsContent");
  const $placeholder = document.getElementById("outputPlaceholder");

  // ─────────────────── Algorithm Options ───────────────────
  const ALGORITHMS = {
    substitution: [
      { value: "caesar", label: "Caesar Cipher" },
      { value: "vigenere", label: "Vigenère Cipher" },
      { value: "hill", label: "Hill Cipher" },
      { value: "playfair", label: "Playfair Cipher" },
    ],
    transposition: [
      { value: "railfence", label: "Rail Fence Cipher" },
      { value: "transposition", label: "Row & Column Transposition" },
    ],
  };

  // ─────────────────── UI Wiring ───────────────────

  /** Populate algorithm dropdown based on cipher type */
  $cipherType.addEventListener("change", () => {
    const type = $cipherType.value;
    $algorithm.innerHTML = '<option value="">— Select Algorithm —</option>';
    if (type && ALGORITHMS[type]) {
      ALGORITHMS[type].forEach((a) => {
        const opt = document.createElement("option");
        opt.value = a.value;
        opt.textContent = a.label;
        $algorithm.appendChild(opt);
      });
      $algorithm.disabled = false;
    } else {
      $algorithm.disabled = true;
    }
    $dynamicFields.innerHTML = "";
    disableButtons();
  });

  /** Render dynamic input fields when algorithm changes */
  $algorithm.addEventListener("change", () => {
    renderDynamicFields($algorithm.value);
    updateButtons();
  });

  /** Encrypt / Decrypt handlers */
  $btnEncrypt.addEventListener("click", () => run("encrypt"));
  $btnDecrypt.addEventListener("click", () => run("decrypt"));

  function disableButtons() {
    $btnEncrypt.disabled = true;
    $btnDecrypt.disabled = true;
  }
  function updateButtons() {
    const ok = !!$algorithm.value;
    $btnEncrypt.disabled = !ok;
    $btnDecrypt.disabled = !ok;
  }

  // ─────────────────── Dynamic Fields ───────────────────

  function renderDynamicFields(algo) {
    $dynamicFields.innerHTML = "";
    const map = {
      caesar: fieldsCaesar,
      vigenere: fieldsVigenere,
      hill: fieldsHill,
      playfair: fieldsPlayfair,
      railfence: fieldsRailFence,
      transposition: fieldsTransposition,
    };
    if (map[algo]) map[algo]();
  }

  function addField(id, label, type, extra) {
    const d = document.createElement("div");
    d.className = "field-group";
    const lbl = document.createElement("label");
    lbl.htmlFor = id;
    lbl.textContent = label;
    d.appendChild(lbl);
    let el;
    if (type === "textarea") {
      el = document.createElement("textarea");
      el.id = id;
      el.rows = 3;
    } else if (type === "select") {
      el = document.createElement("select");
      el.id = id;
      (extra || []).forEach((o) => {
        const opt = document.createElement("option");
        opt.value = o.value;
        opt.textContent = o.label;
        el.appendChild(opt);
      });
    } else {
      el = document.createElement("input");
      el.type = type || "text";
      el.id = id;
      if (extra && extra.placeholder) el.placeholder = extra.placeholder;
    }
    d.appendChild(el);
    $dynamicFields.appendChild(d);
    return el;
  }

  /* Caesar fields */
  function fieldsCaesar() {
    addField("inputText", "Text", "textarea");
    addField("shiftKey", "Shift Key (integer)", "number", { placeholder: "e.g. 3" });
  }

  /* Vigenère fields */
  function fieldsVigenere() {
    addField("inputText", "Text", "textarea");
    addField("keyword", "Keyword (letters only)", "text", { placeholder: "e.g. KEY" });
  }

  /* Hill fields */
  function fieldsHill() {
    addField("inputText", "Text", "textarea");
    const sel = addField("matrixSize", "Matrix Size", "select", [
      { value: "2", label: "2 × 2" },
      { value: "3", label: "3 × 3" },
    ]);
    // Matrix grid container
    const wrap = document.createElement("div");
    wrap.className = "field-group";
    const lbl = document.createElement("label");
    lbl.textContent = "Key Matrix (row by row)";
    wrap.appendChild(lbl);
    const grid = document.createElement("div");
    grid.className = "matrix-grid";
    grid.id = "matrixGrid";
    wrap.appendChild(grid);
    $dynamicFields.appendChild(wrap);
    buildMatrixGrid(Number(sel.value));
    sel.addEventListener("change", () => buildMatrixGrid(Number(sel.value)));
  }

  function buildMatrixGrid(n) {
    const grid = document.getElementById("matrixGrid");
    if (!grid) return;
    grid.innerHTML = "";
    grid.style.gridTemplateColumns = `repeat(${n}, 56px)`;
    for (let i = 0; i < n * n; i++) {
      const inp = document.createElement("input");
      inp.type = "number";
      inp.className = "matrix-cell";
      inp.dataset.index = i;
      inp.placeholder = "0";
      grid.appendChild(inp);
    }
  }

  /* Playfair fields */
  function fieldsPlayfair() {
    addField("inputText", "Text", "textarea");
    addField("keyword", "Keyword (letters only)", "text", { placeholder: "e.g. MONARCHY" });
  }

  /* Rail Fence fields */
  function fieldsRailFence() {
    addField("inputText", "Text", "textarea");
    addField("numRails", "Number of Rails", "number", { placeholder: "e.g. 3" });
  }

  /* Transposition fields */
  function fieldsTransposition() {
    addField("inputText", "Text", "textarea");
    addField("transKey", "Key (letters or digits, e.g. 3 1 4 2 or HACK)", "text", {
      placeholder: "e.g. 3 1 4 2",
    });
  }

  // ─────────────────── Run Cipher ───────────────────

  function run(operation) {
    hideError();
    const algo = $algorithm.value;

    // Guard: no algorithm chosen
    if (!algo) {
      showError("Please select a cipher type and algorithm first.");
      disableButtons();
      return;
    }

    // Trigger lock / unlock animation on the clicked button
    const btn = operation === "encrypt" ? $btnEncrypt : $btnDecrypt;
    btn.classList.remove("animating");
    // Force reflow so re-adding the class restarts the animation
    void btn.offsetWidth;
    btn.classList.add("animating");
    setTimeout(() => btn.classList.remove("animating"), 650);

    try {
      const result = dispatch(algo, operation);
      showResult(result.text, result.steps);
    } catch (err) {
      showError(err.message || "An unexpected error occurred.");
    }
  }

  function dispatch(algo, op) {
    const map = {
      caesar: op === "encrypt" ? caesarEncrypt : caesarDecrypt,
      vigenere: op === "encrypt" ? vigenereEncrypt : vigenereDecrypt,
      hill: op === "encrypt" ? hillEncrypt : hillDecrypt,
      playfair: op === "encrypt" ? playfairEncrypt : playfairDecrypt,
      railfence: op === "encrypt" ? railFenceEncrypt : railFenceDecrypt,
      transposition: op === "encrypt" ? transpositionEncrypt : transpositionDecrypt,
    };
    if (!map[algo]) throw new Error("Unknown algorithm.");
    return map[algo]();
  }

  // ─────────────────── Error / Result Display ───────────────────

  function showError(msg) {
    const errText = document.getElementById("errorText");
    if (errText) errText.textContent = msg;
    $errorBox.hidden = false;
  }
  function hideError() {
    $errorBox.hidden = true;
  }

  function showResult(text, steps) {
    $placeholder.hidden = true;
    $resultCard.hidden = false;
    $resultText.textContent = text;
    $stepsCard.hidden = false;
    $stepsContent.innerHTML = "";
    steps.forEach((s, idx) => {
      const div = document.createElement("div");
      div.className = "step";
      div.style.animationDelay = `${idx * 0.07}s`;
      if (s.heading) {
        const h3 = document.createElement("h3");
        h3.textContent = s.heading;
        div.appendChild(h3);
      }
      if (s.content) {
        const p = document.createElement("div");
        p.innerHTML = s.content; // may include tables, pre, spans
        div.appendChild(p);
      }
      $stepsContent.appendChild(div);
    });
  }

  // ─────────────────── Helpers ───────────────────

  function getText() {
    const raw = (document.getElementById("inputText") || {}).value || "";
    if (!raw.trim()) throw new Error("Please enter text.");
    let t = raw.toUpperCase();
    if ($removeSpaces.checked) t = t.replace(/\s+/g, "");
    return t;
  }

  function lettersOnly(s) {
    return s.replace(/[^A-Z]/g, "");
  }

  function mod(n, m) {
    return ((n % m) + m) % m;
  }

  /** Build an HTML table string from a 2D array. First row = header. */
  function htmlTable(rows) {
    let h = '<table>';
    rows.forEach((r, ri) => {
      h += "<tr>";
      r.forEach((c) => {
        h += ri === 0 ? `<th>${c}</th>` : `<td>${c}</td>`;
      });
      h += "</tr>";
    });
    h += "</table>";
    return h;
  }

  // ════════════════════════════════════════════════════════════
  //  1. CAESAR CIPHER
  // ════════════════════════════════════════════════════════════

  function caesarEncrypt() {
    const text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const shift = parseInt(document.getElementById("shiftKey").value, 10);
    if (isNaN(shift)) throw new Error("Shift key must be an integer.");

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Plaintext: <b>${text}</b><br>Shift: <b>${mod(shift, 26)}</b> (mod 26)</p>` });

    const tableRows = [["Letter", "Index (A=0)", `+ ${mod(shift, 26)}`, "mod 26", "Cipher Letter"]];
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const idx = ch.charCodeAt(0) - 65;
      const shifted = idx + mod(shift, 26);
      const m = mod(shifted, 26);
      const c = String.fromCharCode(m + 65);
      result += c;
      tableRows.push([ch, idx, shifted, m, c]);
    }

    steps.push({ heading: "Step 2 — Character-by-Character Encryption", content: htmlTable(tableRows) });
    steps.push({ heading: "Step 3 — Final Ciphertext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  function caesarDecrypt() {
    const text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const shift = parseInt(document.getElementById("shiftKey").value, 10);
    if (isNaN(shift)) throw new Error("Shift key must be an integer.");

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Ciphertext: <b>${text}</b><br>Shift: <b>${mod(shift, 26)}</b> (mod 26)</p>` });

    const tableRows = [["Letter", "Index", `− ${mod(shift, 26)}`, "mod 26", "Plain Letter"]];
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const idx = ch.charCodeAt(0) - 65;
      const shifted = idx - mod(shift, 26);
      const m = mod(shifted, 26);
      const c = String.fromCharCode(m + 65);
      result += c;
      tableRows.push([ch, idx, shifted, m, c]);
    }

    steps.push({ heading: "Step 2 — Character-by-Character Decryption", content: htmlTable(tableRows) });
    steps.push({ heading: "Step 3 — Final Plaintext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  // ════════════════════════════════════════════════════════════
  //  2. VIGENÈRE CIPHER
  // ════════════════════════════════════════════════════════════

  function vigenereEncrypt() {
    const text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const kw = lettersOnly((document.getElementById("keyword").value || "").toUpperCase());
    if (!kw) throw new Error("Keyword must contain letters.");

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Plaintext: <b>${text}</b><br>Keyword: <b>${kw}</b></p>` });

    // Expand keyword
    let expanded = "";
    for (let i = 0; i < text.length; i++) expanded += kw[i % kw.length];
    steps.push({ heading: "Step 2 — Keyword Expansion", content: `<p>${expanded}</p>` });

    const tableRows = [["Plain", "P index", "Key", "K index", "P+K", "mod 26", "Cipher"]];
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const p = text.charCodeAt(i) - 65;
      const k = expanded.charCodeAt(i) - 65;
      const sum = p + k;
      const m = mod(sum, 26);
      const c = String.fromCharCode(m + 65);
      result += c;
      tableRows.push([text[i], p, expanded[i], k, sum, m, c]);
    }

    steps.push({ heading: "Step 3 — Encryption Table", content: htmlTable(tableRows) });
    steps.push({ heading: "Step 4 — Final Ciphertext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  function vigenereDecrypt() {
    const text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const kw = lettersOnly((document.getElementById("keyword").value || "").toUpperCase());
    if (!kw) throw new Error("Keyword must contain letters.");

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Ciphertext: <b>${text}</b><br>Keyword: <b>${kw}</b></p>` });

    let expanded = "";
    for (let i = 0; i < text.length; i++) expanded += kw[i % kw.length];
    steps.push({ heading: "Step 2 — Keyword Expansion", content: `<p>${expanded}</p>` });

    const tableRows = [["Cipher", "C index", "Key", "K index", "C−K", "mod 26", "Plain"]];
    let result = "";
    for (let i = 0; i < text.length; i++) {
      const c = text.charCodeAt(i) - 65;
      const k = expanded.charCodeAt(i) - 65;
      const diff = c - k;
      const m = mod(diff, 26);
      const p = String.fromCharCode(m + 65);
      result += p;
      tableRows.push([text[i], c, expanded[i], k, diff, m, p]);
    }

    steps.push({ heading: "Step 3 — Decryption Table", content: htmlTable(tableRows) });
    steps.push({ heading: "Step 4 — Final Plaintext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  // ════════════════════════════════════════════════════════════
  //  3. HILL CIPHER
  // ════════════════════════════════════════════════════════════

  /** Read matrix from grid inputs */
  function readMatrix(n) {
    const cells = document.querySelectorAll("#matrixGrid .matrix-cell");
    if (cells.length !== n * n) throw new Error("Matrix grid mismatch.");
    const m = [];
    for (let r = 0; r < n; r++) {
      m.push([]);
      for (let c = 0; c < n; c++) {
        const v = parseInt(cells[r * n + c].value, 10);
        if (isNaN(v)) throw new Error("All matrix cells must be filled with integers.");
        m[r].push(v);
      }
    }
    return m;
  }

  /** Determinant of NxN matrix */
  function det(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    let d = 0;
    for (let c = 0; c < n; c++) {
      const sub = [];
      for (let r = 1; r < n; r++) {
        const row = [];
        for (let k = 0; k < n; k++) if (k !== c) row.push(matrix[r][k]);
        sub.push(row);
      }
      d += (c % 2 === 0 ? 1 : -1) * matrix[0][c] * det(sub);
    }
    return d;
  }

  /** GCD */
  function gcd(a, b) { a = Math.abs(a); b = Math.abs(b); while (b) { [a, b] = [b, a % b]; } return a; }

  /** Extended GCD — returns [g, x, y] such that a*x + b*y = g */
  function extgcd(a, b) {
    if (a === 0) return [b, 0, 1];
    const [g, x1, y1] = extgcd(b % a, a);
    return [g, y1 - Math.floor(b / a) * x1, x1];
  }

  /** Modular inverse of a mod m (returns -1 if none) */
  function modInverse(a, m) {
    a = mod(a, m);
    const [g, x] = extgcd(a, m);
    if (g !== 1) return -1;
    return mod(x, m);
  }

  /** Cofactor matrix */
  function cofactorMatrix(matrix) {
    const n = matrix.length;
    const cof = Array.from({ length: n }, () => Array(n).fill(0));
    if (n === 2) {
      cof[0][0] = matrix[1][1];
      cof[0][1] = -matrix[1][0];
      cof[1][0] = -matrix[0][1];
      cof[1][1] = matrix[0][0];
      return cof;
    }
    for (let r = 0; r < n; r++) {
      for (let c = 0; c < n; c++) {
        const sub = [];
        for (let i = 0; i < n; i++) {
          if (i === r) continue;
          const row = [];
          for (let j = 0; j < n; j++) if (j !== c) row.push(matrix[i][j]);
          sub.push(row);
        }
        cof[r][c] = ((r + c) % 2 === 0 ? 1 : -1) * det(sub);
      }
    }
    return cof;
  }

  /** Transpose */
  function transpose(matrix) {
    const n = matrix.length;
    const t = Array.from({ length: n }, () => Array(n).fill(0));
    for (let r = 0; r < n; r++)
      for (let c = 0; c < n; c++) t[c][r] = matrix[r][c];
    return t;
  }

  /** Multiply matrix by vector mod 26 */
  function matVecMod26(matrix, vec) {
    const n = matrix.length;
    const res = Array(n).fill(0);
    for (let r = 0; r < n; r++) {
      let s = 0;
      for (let c = 0; c < n; c++) s += matrix[r][c] * vec[c];
      res[r] = mod(s, 26);
    }
    return res;
  }

  /** Format matrix as HTML */
  function matrixHTML(matrix) {
    const n = matrix.length;
    let h = `<div class="matrix-display" style="grid-template-columns:repeat(${n},40px)">`;
    for (const row of matrix)
      for (const v of row) h += `<span>${v}</span>`;
    h += "</div>";
    return h;
  }

  function hillEncrypt() {
    const n = parseInt(document.getElementById("matrixSize").value, 10);
    let text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const matrix = readMatrix(n);

    // Pad text
    while (text.length % n !== 0) text += "X";

    // Validate
    const d = det(matrix);
    const dMod = mod(d, 26);
    if (gcd(dMod, 26) !== 1) throw new Error(`Determinant mod 26 = ${dMod}. It must be coprime with 26 (gcd must be 1). Matrix is not invertible mod 26.`);

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Plaintext (padded): <b>${text}</b><br>Matrix size: ${n}×${n}</p><p>Key Matrix:</p>${matrixHTML(matrix)}` });
    steps.push({ heading: "Step 2 — Determinant Check", content: `<p>det(K) = ${d}<br>det(K) mod 26 = ${dMod}<br>gcd(${dMod}, 26) = ${gcd(dMod, 26)} ✔ (coprime → invertible)</p>` });

    // Encrypt blocks
    let result = "";
    let blockHTML = "";
    for (let i = 0; i < text.length; i += n) {
      const block = text.slice(i, i + n);
      const vec = [...block].map((c) => c.charCodeAt(0) - 65);
      const encrypted = matVecMod26(matrix, vec);
      const cipherBlock = encrypted.map((v) => String.fromCharCode(v + 65)).join("");
      result += cipherBlock;

      // Show multiplication
      let mul = `<p><b>Block "${block}"</b> → vector [${vec.join(", ")}]</p>`;
      mul += "<p>";
      for (let r = 0; r < n; r++) {
        const parts = [];
        for (let c = 0; c < n; c++) parts.push(`${matrix[r][c]}×${vec[c]}`);
        const raw = matrix[r].reduce((s, v, c) => s + v * vec[c], 0);
        mul += `C<sub>${r}</sub> = ${parts.join(" + ")} = ${raw} mod 26 = ${encrypted[r]} → ${cipherBlock[r]}<br>`;
      }
      mul += "</p>";
      blockHTML += mul;
    }

    steps.push({ heading: "Step 3 — Matrix Multiplication (Encryption)", content: blockHTML });
    steps.push({ heading: "Step 4 — Final Ciphertext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  function hillDecrypt() {
    const n = parseInt(document.getElementById("matrixSize").value, 10);
    let text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const matrix = readMatrix(n);

    while (text.length % n !== 0) text += "X";

    const d = det(matrix);
    const dMod = mod(d, 26);
    if (gcd(dMod, 26) !== 1) throw new Error(`Determinant mod 26 = ${dMod}. Not invertible.`);
    const dInv = modInverse(dMod, 26);

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Ciphertext: <b>${text}</b><br>Key Matrix:</p>${matrixHTML(matrix)}` });
    steps.push({ heading: "Step 2 — Determinant & Modular Inverse", content: `<p>det(K) = ${d}<br>det(K) mod 26 = ${dMod}<br>Modular inverse of ${dMod} mod 26 = ${dInv}<br>(since ${dMod} × ${dInv} mod 26 = ${mod(dMod * dInv, 26)})</p>` });

    // Compute inverse matrix mod 26
    const cof = cofactorMatrix(matrix);
    const adj = transpose(cof);
    const inv = adj.map((row) => row.map((v) => mod(v * dInv, 26)));

    steps.push({ heading: "Step 3 — Adjugate (Cofactor Transposed)", content: matrixHTML(adj.map(r => r.map(v => v))) });
    steps.push({ heading: "Step 4 — Inverse Matrix mod 26", content: `<p>K⁻¹ = ${dInv} × adj(K) mod 26</p>${matrixHTML(inv)}` });

    // Decrypt blocks
    let result = "";
    let blockHTML = "";
    for (let i = 0; i < text.length; i += n) {
      const block = text.slice(i, i + n);
      const vec = [...block].map((c) => c.charCodeAt(0) - 65);
      const decrypted = matVecMod26(inv, vec);
      const plainBlock = decrypted.map((v) => String.fromCharCode(v + 65)).join("");
      result += plainBlock;

      let mul = `<p><b>Block "${block}"</b> → vector [${vec.join(", ")}]</p><p>`;
      for (let r = 0; r < n; r++) {
        const parts = [];
        for (let c = 0; c < n; c++) parts.push(`${inv[r][c]}×${vec[c]}`);
        const raw = inv[r].reduce((s, v, c) => s + v * vec[c], 0);
        mul += `P<sub>${r}</sub> = ${parts.join(" + ")} = ${raw} mod 26 = ${decrypted[r]} → ${plainBlock[r]}<br>`;
      }
      mul += "</p>";
      blockHTML += mul;
    }

    steps.push({ heading: "Step 5 — Decryption (Inverse Matrix × Ciphertext)", content: blockHTML });
    steps.push({ heading: "Step 6 — Final Plaintext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  // ════════════════════════════════════════════════════════════
  //  4. PLAYFAIR CIPHER
  // ════════════════════════════════════════════════════════════

  /** Build 5x5 Playfair matrix (I/J merged) */
  function buildPlayfairMatrix(keyword) {
    const seen = new Set();
    const letters = [];
    const combined = (keyword + "ABCDEFGHIKLMNOPQRSTUVWXYZ").toUpperCase(); // no J
    for (const ch of combined) {
      let c = ch === "J" ? "I" : ch;
      if (c < "A" || c > "Z") continue;
      if (!seen.has(c)) {
        seen.add(c);
        letters.push(c);
      }
    }
    const matrix = [];
    for (let r = 0; r < 5; r++) matrix.push(letters.slice(r * 5, r * 5 + 5));
    return matrix;
  }

  function findInMatrix(matrix, ch) {
    if (ch === "J") ch = "I";
    for (let r = 0; r < 5; r++)
      for (let c = 0; c < 5; c++)
        if (matrix[r][c] === ch) return [r, c];
    return [-1, -1];
  }

  /** Create digraphs from text */
  function makeDigraphs(text) {
    let t = text.replace(/J/g, "I");
    const pairs = [];
    let i = 0;
    while (i < t.length) {
      const a = t[i];
      if (i + 1 >= t.length) {
        pairs.push([a, "X"]);
        i++;
      } else if (t[i] === t[i + 1]) {
        pairs.push([a, "X"]);
        i++;
      } else {
        pairs.push([a, t[i + 1]]);
        i += 2;
      }
    }
    return pairs;
  }

  function playfairMatrixHTML(matrix) {
    let h = '<div class="playfair-matrix">';
    for (const row of matrix)
      for (const c of row) h += `<span>${c}</span>`;
    h += "</div>";
    return h;
  }

  function playfairEncrypt() {
    const text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const kw = lettersOnly((document.getElementById("keyword").value || "").toUpperCase());
    if (!kw) throw new Error("Keyword must contain letters.");

    const matrix = buildPlayfairMatrix(kw);
    const digraphs = makeDigraphs(text);

    const steps = [];
    steps.push({ heading: "Step 1 — 5×5 Playfair Matrix", content: `<p>Keyword: <b>${kw}</b> (I/J merged)</p>${playfairMatrixHTML(matrix)}` });
    steps.push({ heading: "Step 2 — Digraph Formation", content: `<p>${digraphs.map((d) => d.join("")).join("  ")}</p><p><i>If both letters are the same, 'X' is inserted. Odd-length text is padded with 'X'.</i></p>` });

    const tableRows = [["Digraph", "Positions", "Rule", "Encrypted"]];
    let result = "";
    for (const [a, b] of digraphs) {
      const [r1, c1] = findInMatrix(matrix, a);
      const [r2, c2] = findInMatrix(matrix, b);
      let e1, e2, rule;
      if (r1 === r2) {
        // Same row
        e1 = matrix[r1][(c1 + 1) % 5];
        e2 = matrix[r2][(c2 + 1) % 5];
        rule = "Same Row → shift right";
      } else if (c1 === c2) {
        // Same column
        e1 = matrix[(r1 + 1) % 5][c1];
        e2 = matrix[(r2 + 1) % 5][c2];
        rule = "Same Column → shift down";
      } else {
        // Rectangle
        e1 = matrix[r1][c2];
        e2 = matrix[r2][c1];
        rule = "Rectangle → swap columns";
      }
      result += e1 + e2;
      tableRows.push([`${a}${b}`, `(${r1},${c1}) (${r2},${c2})`, rule, `${e1}${e2}`]);
    }

    steps.push({ heading: "Step 3 — Encryption Rules Applied", content: htmlTable(tableRows) });
    steps.push({ heading: "Step 4 — Final Ciphertext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  function playfairDecrypt() {
    const text = lettersOnly(getText());
    if (!text) throw new Error("Text must contain letters.");
    const kw = lettersOnly((document.getElementById("keyword").value || "").toUpperCase());
    if (!kw) throw new Error("Keyword must contain letters.");
    if (text.length % 2 !== 0) throw new Error("Ciphertext length must be even for Playfair decryption.");

    const matrix = buildPlayfairMatrix(kw);
    const digraphs = [];
    for (let i = 0; i < text.length; i += 2) digraphs.push([text[i], text[i + 1]]);

    const steps = [];
    steps.push({ heading: "Step 1 — 5×5 Playfair Matrix", content: `<p>Keyword: <b>${kw}</b></p>${playfairMatrixHTML(matrix)}` });
    steps.push({ heading: "Step 2 — Ciphertext Digraphs", content: `<p>${digraphs.map((d) => d.join("")).join("  ")}</p>` });

    const tableRows = [["Digraph", "Positions", "Rule", "Decrypted"]];
    let result = "";
    for (const [a, b] of digraphs) {
      const [r1, c1] = findInMatrix(matrix, a);
      const [r2, c2] = findInMatrix(matrix, b);
      let e1, e2, rule;
      if (r1 === r2) {
        e1 = matrix[r1][mod(c1 - 1, 5)];
        e2 = matrix[r2][mod(c2 - 1, 5)];
        rule = "Same Row → shift left";
      } else if (c1 === c2) {
        e1 = matrix[mod(r1 - 1, 5)][c1];
        e2 = matrix[mod(r2 - 1, 5)][c2];
        rule = "Same Column → shift up";
      } else {
        e1 = matrix[r1][c2];
        e2 = matrix[r2][c1];
        rule = "Rectangle → swap columns";
      }
      result += e1 + e2;
      tableRows.push([`${a}${b}`, `(${r1},${c1}) (${r2},${c2})`, rule, `${e1}${e2}`]);
    }

    steps.push({ heading: "Step 3 — Decryption Rules Applied", content: htmlTable(tableRows) });
    steps.push({ heading: "Step 4 — Final Plaintext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  // ════════════════════════════════════════════════════════════
  //  5. RAIL FENCE CIPHER
  // ════════════════════════════════════════════════════════════

  function railFenceEncrypt() {
    const text = getText();
    if (!text) throw new Error("Please enter text.");
    const rails = parseInt(document.getElementById("numRails").value, 10);
    if (isNaN(rails) || rails < 2) throw new Error("Number of rails must be ≥ 2.");
    if (rails > text.length) throw new Error("Number of rails cannot exceed text length.");

    // Build zigzag
    const fence = Array.from({ length: rails }, () => Array(text.length).fill(""));
    let row = 0, dir = 1;
    for (let i = 0; i < text.length; i++) {
      fence[row][i] = text[i];
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Plaintext: <b>${text}</b><br>Rails: <b>${rails}</b></p>` });

    // Zigzag visual
    let zigzag = "";
    for (let r = 0; r < rails; r++) {
      let line = `Rail ${r}: `;
      for (let c = 0; c < text.length; c++) {
        line += fence[r][c] ? fence[r][c] : ".";
        line += " ";
      }
      zigzag += line + "\n";
    }
    steps.push({ heading: "Step 2 — Zigzag Pattern", content: `<div class="zigzag-visual">${zigzag}</div>` });

    // Read row by row
    let result = "";
    const railContents = [];
    for (let r = 0; r < rails; r++) {
      const chars = fence[r].filter((c) => c !== "").join("");
      result += chars;
      railContents.push(`Rail ${r}: ${chars}`);
    }

    steps.push({ heading: "Step 3 — Reading Rows", content: `<p>${railContents.join("<br>")}</p>` });
    steps.push({ heading: "Step 4 — Final Ciphertext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  function railFenceDecrypt() {
    const text = getText();
    if (!text) throw new Error("Please enter text.");
    const rails = parseInt(document.getElementById("numRails").value, 10);
    if (isNaN(rails) || rails < 2) throw new Error("Number of rails must be ≥ 2.");
    if (rails > text.length) throw new Error("Number of rails cannot exceed text length.");

    const n = text.length;
    // Determine lengths of each rail
    const fence = Array.from({ length: rails }, () => Array(n).fill(""));
    let row = 0, dir = 1;
    for (let i = 0; i < n; i++) {
      fence[row][i] = "*"; // mark
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Ciphertext: <b>${text}</b><br>Rails: <b>${rails}</b></p>` });

    // Show rail lengths
    let idx = 0;
    const railLens = [];
    for (let r = 0; r < rails; r++) {
      const count = fence[r].filter((c) => c === "*").length;
      const chunk = text.slice(idx, idx + count);
      railLens.push(`Rail ${r}: length ${count} → "${chunk}"`);
      // Fill back
      let k = 0;
      for (let c = 0; c < n; c++) {
        if (fence[r][c] === "*") { fence[r][c] = text[idx++]; }
      }
    }
    steps.push({ heading: "Step 2 — Distribute Ciphertext to Rails", content: `<p>${railLens.join("<br>")}</p>` });

    // Zigzag visual
    let zigzag = "";
    for (let r = 0; r < rails; r++) {
      let line = `Rail ${r}: `;
      for (let c = 0; c < n; c++) {
        line += fence[r][c] ? fence[r][c] : ".";
        line += " ";
      }
      zigzag += line + "\n";
    }
    steps.push({ heading: "Step 3 — Reconstructed Zigzag", content: `<div class="zigzag-visual">${zigzag}</div>` });

    // Read in zigzag order
    let result = "";
    row = 0; dir = 1;
    for (let i = 0; i < n; i++) {
      result += fence[row][i];
      if (row === 0) dir = 1;
      else if (row === rails - 1) dir = -1;
      row += dir;
    }

    steps.push({ heading: "Step 4 — Read in Zigzag Order", content: `<p>Reading column-by-column in zigzag pattern...</p>` });
    steps.push({ heading: "Step 5 — Final Plaintext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  // ════════════════════════════════════════════════════════════
  //  6. ROW & COLUMN TRANSPOSITION CIPHER
  // ════════════════════════════════════════════════════════════

  /** Parse transposition key → column order (0-indexed) */
  function parseTransKey(raw) {
    raw = raw.trim().toUpperCase();
    let items;
    if (/^[\d\s,]+$/.test(raw)) {
      // Numeric: "3 1 4 2" or "3,1,4,2"
      items = raw.split(/[\s,]+/).map(Number);
      if (items.some(isNaN)) throw new Error("Numeric key contains non-numbers.");
      // Convert to 0-based ranks (they ARE the order)
      // Validate uniqueness and range
      const sorted = [...items].sort((a, b) => a - b);
      for (let i = 0; i < sorted.length; i++) {
        if (sorted[i] !== i + 1) throw new Error("Numeric key must be a permutation of 1..n (e.g. 3 1 4 2).");
      }
      return items.map((v) => v - 1); // 0-indexed column order
    } else {
      // Alphabetical: "HACK" → sort letters to get order
      items = raw.replace(/[^A-Z]/g, "").split("");
      if (items.length === 0) throw new Error("Key must contain letters or numbers.");
      const sorted = [...items].map((ch, i) => ({ ch, i })).sort((a, b) => a.ch < b.ch ? -1 : a.ch > b.ch ? 1 : a.i - b.i);
      const order = Array(items.length);
      sorted.forEach((obj, rank) => { order[obj.i] = rank; });
      return order;
    }
  }

  function transpositionEncrypt() {
    let text = getText();
    if (!text) throw new Error("Please enter text.");
    const rawKey = (document.getElementById("transKey").value || "").trim();
    if (!rawKey) throw new Error("Please enter a key.");
    const order = parseTransKey(rawKey);
    const cols = order.length;

    // Pad text
    while (text.length % cols !== 0) text += "X";
    const rows = text.length / cols;

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Plaintext (padded): <b>${text}</b><br>Key: <b>${rawKey.toUpperCase()}</b><br>Column order: [${order.map((v) => v + 1).join(", ")}]<br>Grid: ${rows} rows × ${cols} columns</p>` });

    // Build grid
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid.push([]);
      for (let c = 0; c < cols; c++) grid[r].push(text[r * cols + c]);
    }

    // Table display
    const header = ["Row \\ Col"];
    for (let c = 0; c < cols; c++) header.push(`Col ${order[c] + 1}`);
    const tableRows = [header];
    for (let r = 0; r < rows; r++) {
      const tr = [`Row ${r + 1}`];
      for (let c = 0; c < cols; c++) tr.push(grid[r][c]);
      tableRows.push(tr);
    }
    steps.push({ heading: "Step 2 — Fill Grid Row-by-Row", content: htmlTable(tableRows) });

    // Column sorting display
    const sortedCols = order.map((v, i) => ({ rank: v, idx: i })).sort((a, b) => a.rank - b.rank);
    let sortInfo = "<p>Reading columns in order: ";
    sortInfo += sortedCols.map((s) => `Col ${s.rank + 1} (original position ${s.idx + 1})`).join(", ");
    sortInfo += "</p>";
    steps.push({ heading: "Step 3 — Column Sorting & Reading", content: sortInfo });

    // Read columns in sorted order
    let result = "";
    for (const sc of sortedCols) {
      for (let r = 0; r < rows; r++) result += grid[r][sc.idx];
    }

    steps.push({ heading: "Step 4 — Final Ciphertext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

  function transpositionDecrypt() {
    let text = getText();
    if (!text) throw new Error("Please enter text.");
    const rawKey = (document.getElementById("transKey").value || "").trim();
    if (!rawKey) throw new Error("Please enter a key.");
    const order = parseTransKey(rawKey);
    const cols = order.length;

    if (text.length % cols !== 0) throw new Error(`Ciphertext length (${text.length}) must be divisible by key length (${cols}).`);
    const rows = text.length / cols;

    const steps = [];
    steps.push({ heading: "Step 1 — Parameters", content: `<p>Ciphertext: <b>${text}</b><br>Key: <b>${rawKey.toUpperCase()}</b><br>Column order: [${order.map((v) => v + 1).join(", ")}]<br>Grid: ${rows} rows × ${cols} columns</p>` });

    // Fill columns in sorted order
    const grid = Array.from({ length: rows }, () => Array(cols).fill(""));
    const sortedCols = order.map((v, i) => ({ rank: v, idx: i })).sort((a, b) => a.rank - b.rank);

    let idx = 0;
    const colContents = [];
    for (const sc of sortedCols) {
      let colChars = "";
      for (let r = 0; r < rows; r++) {
        grid[r][sc.idx] = text[idx++];
        colChars += grid[r][sc.idx];
      }
      colContents.push(`Col ${sc.rank + 1} (position ${sc.idx + 1}): ${colChars}`);
    }
    steps.push({ heading: "Step 2 — Distribute Ciphertext to Sorted Columns", content: `<p>${colContents.join("<br>")}</p>` });

    // Show grid
    const header = ["Row \\ Col"];
    for (let c = 0; c < cols; c++) header.push(`Col ${order[c] + 1}`);
    const tableRowsDisp = [header];
    for (let r = 0; r < rows; r++) {
      const tr = [`Row ${r + 1}`];
      for (let c = 0; c < cols; c++) tr.push(grid[r][c]);
      tableRowsDisp.push(tr);
    }
    steps.push({ heading: "Step 3 — Reconstructed Grid", content: htmlTable(tableRowsDisp) });

    // Read row by row
    let result = "";
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) result += grid[r][c];

    steps.push({ heading: "Step 4 — Read Row-by-Row", content: `<p>Reading the grid row by row gives the plaintext.</p>` });
    steps.push({ heading: "Step 5 — Final Plaintext", content: `<p><b>${result}</b></p>` });
    return { text: result, steps };
  }

})();
