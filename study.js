/* ============================================================
   EnCRITed – Study Mode – study.js
   Interactive lessons, step-by-step animations & quizzes for
   each cipher technique. Pure vanilla JS, no dependencies.
   ============================================================ */

(function () {
  "use strict";

  // ─────────────── CIPHER LESSON DATA ───────────────

  const LESSONS = {
    caesar: {
      name: "Caesar Cipher",
      icon: "🔑",
      type: "Substitution",
      desc: "Shift each letter by a fixed number of positions in the alphabet.",
      theory: {
        what: `The <span class="theory-highlight">Caesar Cipher</span> is one of the oldest and simplest encryption techniques, named after Julius Caesar, who used it to communicate with his generals. Each letter in the plaintext is replaced by a letter a fixed number of positions further down the alphabet.`,
        how: [
          "Pick a <b>shift key</b> (e.g. 3).",
          "For each letter, find its position in the alphabet (A=0, B=1, …, Z=25).",
          "Add the shift key and take modulo 26.",
          "The result is the new ciphertext letter."
        ],
        formulas: {
          encrypt: "C = (P + K) mod 26",
          decrypt: "P = (C − K) mod 26"
        },
        keyPoints: [
          "Only 25 possible keys (shift 1–25), making it vulnerable to brute force.",
          "It is a <b>monoalphabetic</b> cipher — each letter always maps to the same cipher letter.",
          "Also called a <b>shift cipher</b> or <b>additive cipher</b>."
        ]
      },
      example: {
        plaintext: "HELLO",
        key: "Shift = 3",
        steps: [
          { plain: "H",  idx: 7,  calc: "7 + 3 = 10",  mod: 10, cipher: "K" },
          { plain: "E",  idx: 4,  calc: "4 + 3 = 7",   mod: 7,  cipher: "H" },
          { plain: "L",  idx: 11, calc: "11 + 3 = 14",  mod: 14, cipher: "O" },
          { plain: "L",  idx: 11, calc: "11 + 3 = 14",  mod: 14, cipher: "O" },
          { plain: "O",  idx: 14, calc: "14 + 3 = 17",  mod: 17, cipher: "R" }
        ],
        ciphertext: "KHOOR"
      },
      quiz: [
        {
          q: `Using Caesar Cipher with a shift of 5, what is the encryption of the letter <code>A</code>?`,
          opts: ["E", "F", "D", "G"],
          correct: 1,
          explanation: "A = 0, and (0 + 5) mod 26 = 5, which is F."
        },
        {
          q: "How many possible keys does the Caesar Cipher have (excluding shift = 0)?",
          opts: ["26", "25", "52", "10"],
          correct: 1,
          explanation: "Shifts 1 through 25 are the only distinct keys (shift 0 = no encryption, shift 26 = same as 0)."
        },
        {
          q: `If the ciphertext is <code>WKH</code> and the shift is 3, what is the plaintext?`,
          opts: ["THE", "KEY", "HEY", "CAT"],
          correct: 0,
          explanation: "W(22)−3=19=T, K(10)−3=7=H, H(7)−3=4=E → THE."
        },
        {
          q: "The Caesar Cipher is classified as a:",
          opts: ["Polyalphabetic substitution cipher", "Transposition cipher", "Monoalphabetic substitution cipher", "Block cipher"],
          correct: 2,
          explanation: "Each plaintext letter always maps to the same ciphertext letter, making it monoalphabetic."
        }
      ]
    },

    vigenere: {
      name: "Vigenère Cipher",
      icon: "🗝️",
      type: "Substitution",
      desc: "Use a repeating keyword to shift each letter by a different amount.",
      theory: {
        what: `The <span class="theory-highlight">Vigenère Cipher</span> was described by Giovan Battista Bellaso in 1553 and later misattributed to Blaise de Vigenère. It was considered unbreakable for nearly 300 years and was called <em>"le chiffre indéchiffrable"</em> (the indecipherable cipher).`,
        how: [
          "Choose a keyword (e.g. <b>KEY</b>).",
          "Repeat the keyword to match the length of the plaintext.",
          "For each position, add the plaintext letter index and the keyword letter index, then take mod 26."
        ],
        formulas: {
          encrypt: "Cᵢ = (Pᵢ + Kᵢ) mod 26",
          decrypt: "Pᵢ = (Cᵢ − Kᵢ) mod 26"
        },
        keyPoints: [
          "It is a <b>polyalphabetic</b> cipher — the same plaintext letter can encrypt to different ciphertext letters.",
          "Keyword length determines the cipher's strength. Longer keywords are harder to break.",
          "Can be broken using <b>Kasiski examination</b> or <b>frequency analysis</b> on repeated keyword patterns."
        ]
      },
      example: {
        plaintext: "HELLO",
        key: "Keyword = KEY",
        keyExpanded: "KEYKE",
        steps: [
          { plain: "H", pIdx: 7,  keyLetter: "K", kIdx: 10, sum: 17, mod: 17, cipher: "R" },
          { plain: "E", pIdx: 4,  keyLetter: "E", kIdx: 4,  sum: 8,  mod: 8,  cipher: "I" },
          { plain: "L", pIdx: 11, keyLetter: "Y", kIdx: 24, sum: 35, mod: 9,  cipher: "J" },
          { plain: "L", pIdx: 11, keyLetter: "K", kIdx: 10, sum: 21, mod: 21, cipher: "V" },
          { plain: "O", pIdx: 14, keyLetter: "E", kIdx: 4,  sum: 18, mod: 18, cipher: "S" }
        ],
        ciphertext: "RIJVS"
      },
      quiz: [
        {
          q: `Using keyword <code>AB</code>, encrypt <code>HI</code> with the Vigenère Cipher.`,
          opts: ["HJ", "IJ", "HI", "GI"],
          correct: 0,
          explanation: "H(7)+A(0)=7→H, I(8)+B(1)=9→J. Result: HJ."
        },
        {
          q: "Why is the Vigenère Cipher stronger than the Caesar Cipher?",
          opts: [
            "It uses a longer key",
            "The same letter can encrypt differently depending on position",
            "It uses transposition",
            "It is a block cipher"
          ],
          correct: 1,
          explanation: "Being polyalphabetic means the same plaintext letter maps to different ciphertext letters at different positions, defeating simple frequency analysis."
        },
        {
          q: "What method is commonly used to break the Vigenère Cipher?",
          opts: ["Brute force", "Kasiski examination", "Matrix inversion", "Rail pattern analysis"],
          correct: 1,
          explanation: "Kasiski examination finds repeated sequences in ciphertext to determine the keyword length."
        }
      ]
    },

    hill: {
      name: "Hill Cipher",
      icon: "📐",
      type: "Substitution",
      desc: "Uses matrix multiplication over mod 26 to encrypt blocks of letters.",
      theory: {
        what: `The <span class="theory-highlight">Hill Cipher</span> was invented by mathematician Lester S. Hill in 1929. It is the first polygraphic cipher that is practical to operate on more than three symbols at once using linear algebra.`,
        how: [
          "Choose an n×n <b>key matrix</b> K (e.g. 2×2).",
          "Break the plaintext into blocks of n letters and convert to numerical vectors.",
          "Multiply each vector by the key matrix mod 26.",
          "For decryption, compute the <b>inverse matrix</b> K⁻¹ mod 26."
        ],
        formulas: {
          encrypt: "C = K · P (mod 26)",
          decrypt: "P = K⁻¹ · C (mod 26)"
        },
        keyPoints: [
          "The key matrix <b>must be invertible mod 26</b> — its determinant must be coprime with 26.",
          "Block size = matrix dimension. A 2×2 matrix encrypts 2 letters at a time.",
          "Stronger than simple substitution because it encrypts <b>multiple letters at once</b>, mixing their values.",
          "Vulnerable to <b>known-plaintext attacks</b>."
        ]
      },
      example: {
        plaintext: "HI",
        key: "Matrix = [[3, 3], [2, 5]]",
        matrix: [[3, 3], [2, 5]],
        steps: [
          { block: "HI", vec: [7, 8], calc: ["3×7 + 3×8 = 45", "2×7 + 5×8 = 54"], result: [19, 2], cipher: "TC" }
        ],
        ciphertext: "TC"
      },
      quiz: [
        {
          q: "What is a requirement for the key matrix in the Hill Cipher?",
          opts: [
            "The determinant must be 0",
            "The determinant mod 26 must be coprime with 26",
            "All elements must be prime numbers",
            "The matrix must be symmetric"
          ],
          correct: 1,
          explanation: "For the inverse to exist mod 26, gcd(det(K) mod 26, 26) must equal 1."
        },
        {
          q: "How many letters does a 3×3 Hill Cipher encrypt at a time?",
          opts: ["1", "2", "3", "9"],
          correct: 2,
          explanation: "The block size equals the matrix dimension — a 3×3 matrix operates on blocks of 3 letters."
        },
        {
          q: `If the key matrix is <code>[[1,0],[0,1]]</code> (identity matrix), what happens to the plaintext?`,
          opts: [
            "It is reversed",
            "It stays unchanged",
            "Each letter shifts by 1",
            "It becomes all A's"
          ],
          correct: 1,
          explanation: "The identity matrix leaves the vector unchanged: I · P = P."
        }
      ]
    },

    playfair: {
      name: "Playfair Cipher",
      icon: "🧩",
      type: "Substitution",
      desc: "Encrypts pairs of letters using a 5×5 key matrix with three rules.",
      theory: {
        what: `The <span class="theory-highlight">Playfair Cipher</span> was invented by Charles Wheatstone in 1854 but bears the name of Lord Playfair, who promoted its use. It was the first practical digraph substitution cipher and was used by the British in the Boer War and World War I.`,
        how: [
          "Build a <b>5×5 matrix</b> from a keyword (I and J share a cell).",
          "Break plaintext into <b>digraphs</b> (pairs). Insert 'X' between repeated letters; pad odd length with 'X'.",
          "For each pair, apply one of three rules based on their positions in the matrix:",
          "<b>Same Row:</b> Replace each letter with the one to its right (wrap around).",
          "<b>Same Column:</b> Replace each letter with the one below it (wrap around).",
          "<b>Rectangle:</b> Swap columns — each letter takes the one in the same row but the other's column."
        ],
        formulas: {
          encrypt: "Same Row: shift right | Same Col: shift down | Rectangle: swap cols",
          decrypt: "Same Row: shift left | Same Col: shift up | Rectangle: swap cols"
        },
        keyPoints: [
          "Letters I and J are treated as the same letter (merged into one cell).",
          "It's a <b>digraphic</b> cipher — encrypts two letters at a time.",
          "Much harder to break with frequency analysis than monoalphabetic ciphers because there are 600 possible digraphs.",
          "Decryption uses the <b>reverse</b> rules (shift left, shift up, same rectangle swap)."
        ]
      },
      example: {
        plaintext: "HELLO",
        key: "Keyword = MONARCHY",
        matrixDisplay: [
          ["M","O","N","A","R"],
          ["C","H","Y","B","D"],
          ["E","F","G","I","K"],
          ["L","P","Q","S","T"],
          ["U","V","W","X","Z"]
        ],
        digraphs: [["H","E"],["L","L"],["O","X"]],
        digraphsNote: "LL is split → LX, LO. Padded: HE LX LO",
        adjustedDigraphs: [["H","E"],["L","X"],["L","O"]],
        steps: [
          { pair: "HE", positions: "(1,1) (2,0)", rule: "Rectangle → swap cols", result: "CF" },
          { pair: "LX", positions: "(3,0) (4,3)", rule: "Rectangle → swap cols", result: "SU" },
          { pair: "LO", positions: "(3,0) (0,1)", rule: "Rectangle → swap cols", result: "PM" }
        ],
        ciphertext: "CFSUPM"
      },
      quiz: [
        {
          q: "In the Playfair cipher, how are the letters I and J handled?",
          opts: [
            "J is removed entirely",
            "I and J share the same cell in the 5×5 matrix",
            "I is replaced by K",
            "A separate row is added for J"
          ],
          correct: 1,
          explanation: "The 5×5 matrix has 25 cells for 26 letters, so I and J are merged into one cell."
        },
        {
          q: `If two identical letters appear in a digraph (e.g. "LL"), what happens?`,
          opts: [
            "They are encrypted normally",
            "An 'X' is inserted between them to split the pair",
            "The second letter is removed",
            "They are swapped"
          ],
          correct: 1,
          explanation: "Repeated letters in a pair are separated by inserting 'X', so LL becomes LX, L..."
        },
        {
          q: "When two letters of a digraph are in the same row, the Playfair rule is:",
          opts: [
            "Swap their columns",
            "Replace each with the letter below",
            "Replace each with the letter to the right (wrapping around)",
            "Replace each with the letter to the left"
          ],
          correct: 2,
          explanation: "Same Row: each letter is replaced by the letter immediately to its right, wrapping around if needed."
        }
      ]
    },

    railfence: {
      name: "Rail Fence Cipher",
      icon: "🚂",
      type: "Transposition",
      desc: "Write text in a zigzag pattern across rails, then read off row by row.",
      theory: {
        what: `The <span class="theory-highlight">Rail Fence Cipher</span> is one of the simplest transposition ciphers. It works by writing the plaintext in a zigzag (diagonal) pattern across a set number of "rails" (rows), and then reading off each row in order to form the ciphertext.`,
        how: [
          "Choose the number of <b>rails</b> (rows), e.g. 3.",
          "Write the plaintext in a <b>zigzag pattern</b> down and up across the rails.",
          "Read off each rail from top to bottom, left to right, to get the ciphertext.",
          "For decryption, calculate how many characters go in each rail, fill them in, and read the zigzag."
        ],
        formulas: {
          encrypt: "Write in zigzag → read rows left to right",
          decrypt: "Calculate rail lengths → fill rows → read zigzag"
        },
        keyPoints: [
          "It only <b>rearranges</b> the letters — it does not replace them (transposition, not substitution).",
          "The number of rails is the only key. Very few possible keys → easy to brute force.",
          "With 2 rails, it simply interleaves odd- and even-positioned characters.",
          "Often combined with other ciphers for additional security."
        ]
      },
      example: {
        plaintext: "HELLO WORLD",
        key: "Rails = 3",
        railPattern: [
          { rail: 0, chars: [{ch:"H",col:0},{ch:"O",col:4},{ch:"R",col:8}] },
          { rail: 1, chars: [{ch:"E",col:1},{ch:"L",col:3},{ch:"W",col:5},{ch:"O",col:7},{ch:"L",col:9}] },
          { rail: 2, chars: [{ch:"L",col:2},{ch:" ",col:6},{ch:"D",col:10}] }
        ],
        ciphertext: "HORELWOLD (spaces removed)"
      },
      quiz: [
        {
          q: "The Rail Fence Cipher is classified as a:",
          opts: ["Substitution cipher", "Transposition cipher", "Block cipher", "Stream cipher"],
          correct: 1,
          explanation: "Rail Fence only rearranges (transposes) the letter positions — it does not replace them."
        },
        {
          q: `Using 2 rails, what is the ciphertext of <code>ABCDEF</code>?`,
          opts: ["ACEBDF", "ABCDEF", "BADCFE", "FEDCBA"],
          correct: 0,
          explanation: "Rail 1: A,C,E — Rail 2: B,D,F → ACEBDF."
        },
        {
          q: "What makes the Rail Fence cipher easy to break?",
          opts: [
            "It uses complex mathematics",
            "Very few possible keys (number of rails)",
            "It requires a computer to solve",
            "It changes letters to numbers"
          ],
          correct: 1,
          explanation: "With a message of length n, there are only n−1 possible keys (2 to n rails), making brute force trivial."
        }
      ]
    },

    transposition: {
      name: "Row & Column Transposition",
      icon: "📊",
      type: "Transposition",
      desc: "Rearrange letters by writing into a grid and reading columns in key order.",
      theory: {
        what: `The <span class="theory-highlight">Columnar Transposition Cipher</span> writes the plaintext into a grid row by row, then reads the columns in an order determined by a keyword. It was widely used in World War I and II and is the basis of many more complex cipher systems.`,
        how: [
          "Choose a <b>keyword</b> or numeric key (e.g. <b>3 1 4 2</b> or <b>HACK</b>).",
          "Write the plaintext into a grid, filling rows left to right.",
          "Determine column order from the key (alphabetical order for keywords, or numeric order).",
          "Read the columns in that order to get the ciphertext.",
          "Pad with 'X' if needed to fill the last row."
        ],
        formulas: {
          encrypt: "Fill grid row-by-row → Read columns in key order",
          decrypt: "Calculate column heights → Fill columns in key order → Read rows"
        },
        keyPoints: [
          "Like Rail Fence, this is a <b>pure transposition cipher</b> — letters are rearranged, not replaced.",
          "The key determines the number of columns and the read order.",
          "A <b>double transposition</b> (applying it twice) significantly increases security.",
          "Can be broken with anagramming and frequency analysis of column pairs."
        ]
      },
      example: {
        plaintext: "HELLO WORLD",
        key: "Key = 3 1 4 2",
        grid: [
          ["H","E","L","L"],
          ["O","W","O","R"],
          ["L","D","X","X"]
        ],
        columnOrder: [3, 1, 4, 2],
        readOrder: "Col2→Col4→Col1→Col3: EWDLRXHOLOX",
        ciphertext: "EWDLRXHOLOOX"
      },
      quiz: [
        {
          q: "In columnar transposition, the key determines:",
          opts: [
            "How much to shift each letter",
            "The order in which columns are read",
            "Which letters to replace",
            "The number of rails"
          ],
          correct: 1,
          explanation: "The key defines the column read order — columns are read in the order given by the key to produce ciphertext."
        },
        {
          q: "What is a double transposition?",
          opts: [
            "Using two different substitution ciphers",
            "Applying the columnar transposition twice",
            "Using a key of double length",
            "Encrypting only even-positioned letters"
          ],
          correct: 1,
          explanation: "A double transposition applies the columnar transposition cipher a second time (possibly with a different key) for extra security."
        },
        {
          q: "If the plaintext doesn't fill the last row of the grid, what typically happens?",
          opts: [
            "The row is left empty",
            "The message is truncated",
            "Padding characters (like X) are added",
            "The key is shortened"
          ],
          correct: 2,
          explanation: "Padding characters (often X) are appended so all rows are complete."
        }
      ]
    }
  };

  // ─────────────── DOM SETUP ───────────────

  const $studyToggle = document.getElementById("studyToggle");
  const $studyMode = document.getElementById("studyMode");
  const $mainContainer = document.querySelector(".container");
  const $cardGrid = document.getElementById("cipherCardGrid");
  const $lessonView = document.getElementById("lessonView");

  let currentCipher = null;
  let currentTab = "theory";
  let animStep = 0;
  let animTimer = null;
  let quizState = { idx: 0, score: 0, answered: false };

  // ─────────────── PROGRESS STORAGE ───────────────

  function getProgress() {
    try { return JSON.parse(localStorage.getItem("encrited-study-progress") || "{}"); }
    catch { return {}; }
  }
  function setProgress(cipher) {
    const p = getProgress();
    p[cipher] = true;
    localStorage.setItem("encrited-study-progress", JSON.stringify(p));
  }

  // ─────────────── TOGGLE STUDY MODE ───────────────

  $studyToggle.addEventListener("click", () => {
    const entering = !$studyMode.classList.contains("visible");
    $studyMode.classList.toggle("visible", entering);
    $mainContainer.style.display = entering ? "none" : "";
    $studyToggle.classList.toggle("active", entering);
    if (entering) {
      renderCardGrid();
      showCardGrid();
    } else {
      clearAnimTimer();
    }
  });

  // ─────────────── CARD GRID ───────────────

  function renderCardGrid() {
    const progress = getProgress();
    $cardGrid.innerHTML = "";
    for (const [key, lesson] of Object.entries(LESSONS)) {
      const card = document.createElement("div");
      card.className = "cipher-card";
      card.dataset.cipher = key;

      const done = progress[key];
      card.innerHTML = `
        <div class="card-badge ${done ? "completed" : ""}">${done ? "✓" : (Object.keys(LESSONS).indexOf(key) + 1)}</div>
        <div class="card-icon">${lesson.icon}</div>
        <span class="card-type">${lesson.type}</span>
        <h3>${lesson.name}</h3>
        <p>${lesson.desc}</p>
      `;
      card.addEventListener("click", () => openLesson(key));
      $cardGrid.appendChild(card);
    }
  }

  function showCardGrid() {
    $cardGrid.style.display = "";
    $lessonView.classList.remove("visible");
    document.querySelector(".study-hero").style.display = "";
    clearAnimTimer();
  }

  // ─────────────── OPEN LESSON ───────────────

  function openLesson(cipherKey) {
    currentCipher = cipherKey;
    const lesson = LESSONS[cipherKey];
    $cardGrid.style.display = "none";
    document.querySelector(".study-hero").style.display = "none";
    $lessonView.classList.add("visible");
    $lessonView.innerHTML = "";

    // Back button
    const back = document.createElement("button");
    back.className = "lesson-back";
    back.innerHTML = "← Back to All Ciphers";
    back.addEventListener("click", () => { showCardGrid(); renderCardGrid(); });
    $lessonView.appendChild(back);

    // Title
    const title = document.createElement("h2");
    title.className = "lesson-title";
    title.textContent = lesson.icon + " " + lesson.name;
    $lessonView.appendChild(title);

    const sub = document.createElement("p");
    sub.className = "lesson-subtitle";
    sub.textContent = lesson.type + " Cipher — Learn how it works, see it in action, and test yourself!";
    $lessonView.appendChild(sub);

    // Tabs
    const tabs = document.createElement("div");
    tabs.className = "lesson-tabs";
    ["theory", "example", "quiz"].forEach((t) => {
      const btn = document.createElement("button");
      btn.className = "lesson-tab" + (t === "theory" ? " active" : "");
      btn.textContent = t === "theory" ? "📖 Theory" : t === "example" ? "🎬 Animated Example" : "🧪 Quiz";
      btn.dataset.tab = t;
      btn.addEventListener("click", () => switchTab(t));
      tabs.appendChild(btn);
    });
    $lessonView.appendChild(tabs);

    // Panels
    const theoryPanel = document.createElement("div");
    theoryPanel.className = "tab-panel visible";
    theoryPanel.id = "panel-theory";
    theoryPanel.innerHTML = renderTheory(lesson);
    $lessonView.appendChild(theoryPanel);

    const examplePanel = document.createElement("div");
    examplePanel.className = "tab-panel";
    examplePanel.id = "panel-example";
    $lessonView.appendChild(examplePanel);

    const quizPanel = document.createElement("div");
    quizPanel.className = "tab-panel";
    quizPanel.id = "panel-quiz";
    $lessonView.appendChild(quizPanel);

    currentTab = "theory";
  }

  function switchTab(tab) {
    currentTab = tab;
    clearAnimTimer();
    document.querySelectorAll(".lesson-tab").forEach((b) => b.classList.toggle("active", b.dataset.tab === tab));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("visible"));
    const panel = document.getElementById("panel-" + tab);
    panel.classList.add("visible");

    if (tab === "example" && !panel.dataset.rendered) {
      panel.dataset.rendered = "1";
      renderExample(LESSONS[currentCipher], panel);
    }
    if (tab === "quiz" && !panel.dataset.rendered) {
      panel.dataset.rendered = "1";
      renderQuiz(LESSONS[currentCipher], panel);
    }
  }

  // ─────────────── THEORY RENDERER ───────────────

  function renderTheory(lesson) {
    const t = lesson.theory;
    let html = `<div class="theory-section">`;

    html += `<div class="theory-block"><h3>📘 What is it?</h3><p>${t.what}</p></div>`;

    html += `<div class="theory-block"><h3>⚙️ How does it work?</h3><ul>`;
    t.how.forEach((s) => html += `<li>${s}</li>`);
    html += `</ul></div>`;

    html += `<div class="theory-block"><h3>📝 Formulas</h3>`;
    html += `<div class="formula-box"><b>Encryption:</b> ${t.formulas.encrypt}<br><b>Decryption:</b> ${t.formulas.decrypt}</div>`;
    html += `</div>`;

    html += `<div class="theory-block"><h3>💡 Key Points</h3><ul>`;
    t.keyPoints.forEach((p) => html += `<li>${p}</li>`);
    html += `</ul></div>`;

    html += `</div>`;
    return html;
  }

  // ─────────────── ANIMATED EXAMPLE RENDERERS ───────────────

  function renderExample(lesson, panel) {
    const key = currentCipher;
    const renderers = {
      caesar: renderCaesarExample,
      vigenere: renderVigenereExample,
      hill: renderHillExample,
      playfair: renderPlayfairExample,
      railfence: renderRailFenceExample,
      transposition: renderTranspositionExample,
    };
    if (renderers[key]) renderers[key](lesson, panel);
  }

  function clearAnimTimer() {
    if (animTimer) { clearInterval(animTimer); animTimer = null; }
  }

  // ── Caesar Animation ──
  function renderCaesarExample(lesson, panel) {
    const ex = lesson.example;
    panel.innerHTML = `
      <div class="example-section">
        <div class="example-header"><h3>Step-by-Step: Caesar Encryption</h3></div>
        <div class="example-params">
          <div class="param-chip"><span class="label">Plaintext:</span><span class="value">${ex.plaintext}</span></div>
          <div class="param-chip"><span class="label">Key:</span><span class="value">${ex.key}</span></div>
        </div>
        <div class="anim-canvas" id="caesarCanvas">
          <div class="row-label">Plaintext</div>
          <div class="letter-row" id="caesarPlain">${ex.steps.map((s,i)=>`<div class="letter-box plain" data-i="${i}">${s.plain}</div>`).join("")}</div>
          <div class="row-label" style="margin-top:1rem">Calculation</div>
          <div id="caesarCalc" style="text-align:center;font-size:.85rem;color:var(--text-2);min-height:28px;font-family:var(--font-mono)"></div>
          <div class="row-label" style="margin-top:1rem">Ciphertext</div>
          <div class="letter-row" id="caesarCipher">${ex.steps.map((s,i)=>`<div class="letter-box cipher" data-i="${i}" style="opacity:.3">?</div>`).join("")}</div>
        </div>
        <div class="anim-controls">
          <button class="anim-btn primary" id="caesarPlay">▶ Play Animation</button>
          <button class="anim-btn" id="caesarReset">↺ Reset</button>
          <div class="step-indicator"><span class="current" id="caesarStep">0</span> / ${ex.steps.length}</div>
        </div>
      </div>`;

    let step = 0;
    const play = () => {
      clearAnimTimer();
      step = 0;
      resetCaesarVisuals(ex);
      animTimer = setInterval(() => {
        if (step >= ex.steps.length) { clearAnimTimer(); return; }
        const s = ex.steps[step];
        // Highlight plain
        document.querySelectorAll("#caesarPlain .letter-box").forEach((b,i) => b.classList.toggle("highlight", i === step));
        // Show calc
        document.getElementById("caesarCalc").innerHTML = `<b>${s.plain}</b>(${s.idx}) + 3 = ${s.idx+3} mod 26 = <b>${s.mod}</b> → <b>${s.cipher}</b>`;
        // Reveal cipher
        const cb = document.querySelectorAll("#caesarCipher .letter-box")[step];
        cb.textContent = s.cipher;
        cb.style.opacity = "1";
        cb.classList.add("highlight");
        if (step > 0) document.querySelectorAll("#caesarCipher .letter-box")[step-1].classList.remove("highlight");
        step++;
        document.getElementById("caesarStep").textContent = step;
      }, 900);
    };

    const resetCaesarVisuals = (ex) => {
      document.querySelectorAll("#caesarPlain .letter-box").forEach(b => b.classList.remove("highlight"));
      document.querySelectorAll("#caesarCipher .letter-box").forEach((b,i) => { b.textContent = "?"; b.style.opacity = ".3"; b.classList.remove("highlight"); });
      document.getElementById("caesarCalc").innerHTML = "";
      document.getElementById("caesarStep").textContent = "0";
    };

    document.getElementById("caesarPlay").addEventListener("click", play);
    document.getElementById("caesarReset").addEventListener("click", () => { clearAnimTimer(); step = 0; resetCaesarVisuals(ex); });
  }

  // ── Vigenère Animation ──
  function renderVigenereExample(lesson, panel) {
    const ex = lesson.example;
    panel.innerHTML = `
      <div class="example-section">
        <div class="example-header"><h3>Step-by-Step: Vigenère Encryption</h3></div>
        <div class="example-params">
          <div class="param-chip"><span class="label">Plaintext:</span><span class="value">${ex.plaintext}</span></div>
          <div class="param-chip"><span class="label">${ex.key}</span></div>
          <div class="param-chip"><span class="label">Expanded:</span><span class="value">${ex.keyExpanded}</span></div>
        </div>
        <div class="anim-canvas">
          <div class="row-label">Plaintext</div>
          <div class="letter-row" id="vigPlain">${ex.steps.map((s,i)=>`<div class="letter-box plain" data-i="${i}">${s.plain}</div>`).join("")}</div>
          <div class="row-label">Key</div>
          <div class="letter-row" id="vigKey">${ex.steps.map((s,i)=>`<div class="letter-box key-letter" data-i="${i}">${s.keyLetter}</div>`).join("")}</div>
          <div class="row-label" style="margin-top:.75rem">Calculation</div>
          <div id="vigCalc" style="text-align:center;font-size:.85rem;color:var(--text-2);min-height:28px;font-family:var(--font-mono)"></div>
          <div class="row-label" style="margin-top:.75rem">Ciphertext</div>
          <div class="letter-row" id="vigCipher">${ex.steps.map((s,i)=>`<div class="letter-box cipher" data-i="${i}" style="opacity:.3">?</div>`).join("")}</div>
        </div>
        <div class="anim-controls">
          <button class="anim-btn primary" id="vigPlay">▶ Play Animation</button>
          <button class="anim-btn" id="vigReset">↺ Reset</button>
          <div class="step-indicator"><span class="current" id="vigStep">0</span> / ${ex.steps.length}</div>
        </div>
      </div>`;

    let step = 0;
    const reset = () => {
      document.querySelectorAll("#vigPlain .letter-box, #vigKey .letter-box").forEach(b => b.classList.remove("highlight"));
      document.querySelectorAll("#vigCipher .letter-box").forEach(b => { b.textContent = "?"; b.style.opacity = ".3"; b.classList.remove("highlight"); });
      document.getElementById("vigCalc").innerHTML = "";
      document.getElementById("vigStep").textContent = "0";
    };

    const play = () => {
      clearAnimTimer(); step = 0; reset();
      animTimer = setInterval(() => {
        if (step >= ex.steps.length) { clearAnimTimer(); return; }
        const s = ex.steps[step];
        document.querySelectorAll("#vigPlain .letter-box").forEach((b,i) => b.classList.toggle("highlight", i === step));
        document.querySelectorAll("#vigKey .letter-box").forEach((b,i) => b.classList.toggle("highlight", i === step));
        document.getElementById("vigCalc").innerHTML = `<b>${s.plain}</b>(${s.pIdx}) + <b>${s.keyLetter}</b>(${s.kIdx}) = ${s.sum} mod 26 = <b>${s.mod}</b> → <b>${s.cipher}</b>`;
        const cb = document.querySelectorAll("#vigCipher .letter-box")[step];
        cb.textContent = s.cipher; cb.style.opacity = "1"; cb.classList.add("highlight");
        if (step > 0) document.querySelectorAll("#vigCipher .letter-box")[step-1].classList.remove("highlight");
        step++;
        document.getElementById("vigStep").textContent = step;
      }, 1000);
    };

    document.getElementById("vigPlay").addEventListener("click", play);
    document.getElementById("vigReset").addEventListener("click", () => { clearAnimTimer(); step = 0; reset(); });
  }

  // ── Hill Animation ──
  function renderHillExample(lesson, panel) {
    const ex = lesson.example;
    const m = ex.matrix;
    panel.innerHTML = `
      <div class="example-section">
        <div class="example-header"><h3>Step-by-Step: Hill Cipher Encryption</h3></div>
        <div class="example-params">
          <div class="param-chip"><span class="label">Plaintext:</span><span class="value">${ex.plaintext}</span></div>
          <div class="param-chip"><span class="label">Key Matrix:</span><span class="value">[[${m[0].join(",")}],[${m[1].join(",")}]]</span></div>
        </div>
        <div class="anim-canvas">
          <div class="row-label">Key Matrix</div>
          <div style="display:flex;justify-content:center">
            <div class="study-matrix" id="hillMatrix" style="grid-template-columns:repeat(2,38px)">
              ${m.flat().map(v => `<span>${v}</span>`).join("")}
            </div>
          </div>
          <div class="row-label" style="margin-top:1rem">Block: "${ex.plaintext}" → Vector [${ex.steps[0].vec.join(", ")}]</div>
          <div id="hillCalcArea" style="margin-top:.75rem;font-size:.85rem;color:var(--text-2);font-family:var(--font-mono);text-align:center;min-height:60px"></div>
          <div class="row-label" style="margin-top:.75rem">Result</div>
          <div class="letter-row" id="hillResult">
            <div class="letter-box cipher" style="opacity:.3">?</div>
            <div class="letter-box cipher" style="opacity:.3">?</div>
          </div>
        </div>
        <div class="anim-controls">
          <button class="anim-btn primary" id="hillPlay">▶ Play Animation</button>
          <button class="anim-btn" id="hillReset">↺ Reset</button>
          <div class="step-indicator"><span class="current" id="hillStep">0</span> / 2</div>
        </div>
      </div>`;

    let step = 0;
    const s = ex.steps[0];
    const reset = () => {
      document.querySelectorAll("#hillMatrix span").forEach(b => b.classList.remove("highlight"));
      document.querySelectorAll("#hillResult .letter-box").forEach(b => { b.textContent = "?"; b.style.opacity = ".3"; b.classList.remove("highlight"); });
      document.getElementById("hillCalcArea").innerHTML = "";
      document.getElementById("hillStep").textContent = "0";
    };

    const play = () => {
      clearAnimTimer(); step = 0; reset();
      animTimer = setInterval(() => {
        if (step >= 2) { clearAnimTimer(); return; }
        // Highlight row in matrix
        document.querySelectorAll("#hillMatrix span").forEach((b, i) => {
          b.classList.toggle("highlight", Math.floor(i / 2) === step);
        });
        document.getElementById("hillCalcArea").innerHTML = `Row ${step}: ${s.calc[step]} mod 26 = <b>${s.result[step]}</b> → <b>${s.cipher[step]}</b>`;
        const rb = document.querySelectorAll("#hillResult .letter-box")[step];
        rb.textContent = s.cipher[step]; rb.style.opacity = "1"; rb.classList.add("highlight");
        if (step > 0) document.querySelectorAll("#hillResult .letter-box")[step-1].classList.remove("highlight");
        step++;
        document.getElementById("hillStep").textContent = step;
      }, 1200);
    };

    document.getElementById("hillPlay").addEventListener("click", play);
    document.getElementById("hillReset").addEventListener("click", () => { clearAnimTimer(); step = 0; reset(); });
  }

  // ── Playfair Animation ──
  function renderPlayfairExample(lesson, panel) {
    const ex = lesson.example;
    const mx = ex.matrixDisplay;
    panel.innerHTML = `
      <div class="example-section">
        <div class="example-header"><h3>Step-by-Step: Playfair Encryption</h3></div>
        <div class="example-params">
          <div class="param-chip"><span class="label">Plaintext:</span><span class="value">${ex.plaintext}</span></div>
          <div class="param-chip"><span class="label">${ex.key}</span></div>
        </div>
        <div class="anim-canvas">
          <div class="row-label">5×5 Playfair Matrix (Keyword: MONARCHY)</div>
          <div style="display:flex;justify-content:center">
            <div class="study-matrix" id="pfMatrix" style="grid-template-columns:repeat(5,38px)">
              ${mx.flat().map(c => `<span data-ch="${c}">${c}</span>`).join("")}
            </div>
          </div>
          <div class="row-label" style="margin-top:1rem">Digraphs: ${ex.adjustedDigraphs.map(d => d.join("")).join(" ")}</div>
          <div id="pfCalc" style="margin-top:.75rem;text-align:center;font-size:.85rem;color:var(--text-2);font-family:var(--font-mono);min-height:40px"></div>
          <div class="row-label" style="margin-top:.75rem">Ciphertext</div>
          <div class="letter-row" id="pfResult">${ex.steps.map(()=>`<div class="letter-box cipher" style="opacity:.3;width:60px">??</div>`).join("")}</div>
        </div>
        <div class="anim-controls">
          <button class="anim-btn primary" id="pfPlay">▶ Play Animation</button>
          <button class="anim-btn" id="pfReset">↺ Reset</button>
          <div class="step-indicator"><span class="current" id="pfStep">0</span> / ${ex.steps.length}</div>
        </div>
      </div>`;

    let step = 0;
    const findCell = (ch) => document.querySelector(`#pfMatrix span[data-ch="${ch}"]`);

    const reset = () => {
      document.querySelectorAll("#pfMatrix span").forEach(b => b.classList.remove("highlight"));
      document.querySelectorAll("#pfResult .letter-box").forEach(b => { b.textContent = "??"; b.style.opacity = ".3"; b.classList.remove("highlight"); });
      document.getElementById("pfCalc").innerHTML = "";
      document.getElementById("pfStep").textContent = "0";
    };

    const play = () => {
      clearAnimTimer(); step = 0; reset();
      animTimer = setInterval(() => {
        if (step >= ex.steps.length) { clearAnimTimer(); return; }
        const s = ex.steps[step];
        document.querySelectorAll("#pfMatrix span").forEach(b => b.classList.remove("highlight"));
        // Highlight the two source letters
        const c1 = findCell(s.pair[0]); if (c1) c1.classList.add("highlight");
        const c2 = findCell(s.pair[1]); if (c2) c2.classList.add("highlight");
        document.getElementById("pfCalc").innerHTML = `<b>${s.pair}</b> ${s.positions} → ${s.rule} → <b>${s.result}</b>`;
        const rb = document.querySelectorAll("#pfResult .letter-box")[step];
        rb.textContent = s.result; rb.style.opacity = "1"; rb.classList.add("highlight");
        if (step > 0) document.querySelectorAll("#pfResult .letter-box")[step-1].classList.remove("highlight");
        step++;
        document.getElementById("pfStep").textContent = step;
      }, 1400);
    };

    document.getElementById("pfPlay").addEventListener("click", play);
    document.getElementById("pfReset").addEventListener("click", () => { clearAnimTimer(); step = 0; reset(); });
  }

  // ── Rail Fence Animation ──
  function renderRailFenceExample(lesson, panel) {
    const ex = lesson.example;
    const text = "HELLOWORLD";
    const rails = 3;
    const numCols = text.length;

    // Build rail grid data
    const grid = Array.from({length: rails}, () => Array(numCols).fill(""));
    let r = 0, dir = 1;
    for (let i = 0; i < text.length; i++) {
      grid[r][i] = text[i];
      if (r === 0) dir = 1;
      else if (r === rails - 1) dir = -1;
      r += dir;
    }

    panel.innerHTML = `
      <div class="example-section">
        <div class="example-header"><h3>Step-by-Step: Rail Fence Encryption</h3></div>
        <div class="example-params">
          <div class="param-chip"><span class="label">Plaintext:</span><span class="value">${text}</span></div>
          <div class="param-chip"><span class="label">${ex.key}</span></div>
        </div>
        <div class="anim-canvas">
          <div class="row-label">Zigzag Pattern (3 Rails)</div>
          <div class="rail-canvas" id="railGrid" style="grid-template-columns:repeat(${numCols},32px)">
            ${grid.map((row, ri) => row.map((ch, ci) =>
              `<div class="rail-cell ${ch ? "filled" : "empty"}" data-r="${ri}" data-c="${ci}" style="opacity:.3">${ch || "·"}</div>`
            ).join("")).join("")}
          </div>
          <div class="row-label" style="margin-top:1rem">Read-off: top rail → middle rail → bottom rail</div>
          <div id="railReadoff" style="text-align:center;font-family:var(--font-mono);font-size:.9rem;color:var(--accent-2);min-height:28px;margin-top:.5rem"></div>
        </div>
        <div class="anim-controls">
          <button class="anim-btn primary" id="railPlay">▶ Play Animation</button>
          <button class="anim-btn" id="railReset">↺ Reset</button>
          <div class="step-indicator"><span class="current" id="railStep">0</span> / ${text.length}</div>
        </div>
      </div>`;

    // Build animation order: first place zigzag, then readoff
    const zigzagOrder = [];
    r = 0; dir = 1;
    for (let i = 0; i < text.length; i++) {
      zigzagOrder.push({r, c: i, ch: text[i]});
      if (r === 0) dir = 1;
      else if (r === rails - 1) dir = -1;
      r += dir;
    }

    let step = 0;
    const reset = () => {
      document.querySelectorAll("#railGrid .rail-cell").forEach(c => { c.style.opacity = ".3"; c.classList.remove("current"); });
      document.getElementById("railReadoff").textContent = "";
      document.getElementById("railStep").textContent = "0";
    };

    const play = () => {
      clearAnimTimer(); step = 0; reset();
      animTimer = setInterval(() => {
        if (step >= zigzagOrder.length) {
          // After zigzag, show the readoff
          clearAnimTimer();
          let readoff = "";
          for (let rail = 0; rail < rails; rail++) {
            for (let c = 0; c < numCols; c++) {
              if (grid[rail][c]) readoff += grid[rail][c];
            }
          }
          document.getElementById("railReadoff").innerHTML = `<b>${readoff}</b>`;
          return;
        }
        const z = zigzagOrder[step];
        const cell = document.querySelector(`#railGrid .rail-cell[data-r="${z.r}"][data-c="${z.c}"]`);
        document.querySelectorAll("#railGrid .rail-cell").forEach(c => c.classList.remove("current"));
        if (cell) { cell.style.opacity = "1"; cell.classList.add("current"); }
        step++;
        document.getElementById("railStep").textContent = step;
      }, 400);
    };

    document.getElementById("railPlay").addEventListener("click", play);
    document.getElementById("railReset").addEventListener("click", () => { clearAnimTimer(); step = 0; reset(); });
  }

  // ── Transposition Animation ──
  function renderTranspositionExample(lesson, panel) {
    const ex = lesson.example;
    const text = "HELLOWORLDXX";
    const keyOrder = [3, 1, 4, 2];
    const numCols = 4;
    const numRows = Math.ceil(text.length / numCols);
    const grid = [];
    for (let r = 0; r < numRows; r++) {
      grid.push([]);
      for (let c = 0; c < numCols; c++) {
        const idx = r * numCols + c;
        grid[r].push(idx < text.length ? text[idx] : "X");
      }
    }

    panel.innerHTML = `
      <div class="example-section">
        <div class="example-header"><h3>Step-by-Step: Columnar Transposition</h3></div>
        <div class="example-params">
          <div class="param-chip"><span class="label">Plaintext:</span><span class="value">${text}</span></div>
          <div class="param-chip"><span class="label">${ex.key}</span></div>
        </div>
        <div class="anim-canvas">
          <div class="row-label">Grid (Key Order: ${keyOrder.join(" ")})</div>
          <div style="display:flex;justify-content:center">
            <div>
              <div class="letter-row" style="margin-bottom:2px">${keyOrder.map((k,i)=>`<div class="letter-box key-letter" style="font-size:.72rem" id="colHead${i}">${k}</div>`).join("")}</div>
              ${grid.map((row, ri) => `<div class="letter-row" style="margin-bottom:2px">${row.map((ch, ci) =>
                `<div class="letter-box plain" data-r="${ri}" data-c="${ci}" id="tCell${ri}_${ci}">${ch}</div>`
              ).join("")}</div>`).join("")}
            </div>
          </div>
          <div class="row-label" style="margin-top:1rem">Reading columns in key order...</div>
          <div id="transReadoff" style="text-align:center;font-family:var(--font-mono);font-size:.9rem;color:var(--accent-2);min-height:28px;margin-top:.5rem"></div>
        </div>
        <div class="anim-controls">
          <button class="anim-btn primary" id="transPlay">▶ Play Animation</button>
          <button class="anim-btn" id="transReset">↺ Reset</button>
        </div>
      </div>`;

    const sortedCols = keyOrder.map((k, i) => ({key: k, col: i})).sort((a, b) => a.key - b.key);
    let readoff = "";
    let colStep = 0;
    let rowStep = 0;

    const reset = () => {
      document.querySelectorAll(".anim-canvas .letter-box").forEach(b => b.classList.remove("highlight"));
      document.getElementById("transReadoff").textContent = "";
      readoff = ""; colStep = 0; rowStep = 0;
    };

    const play = () => {
      clearAnimTimer(); reset();
      animTimer = setInterval(() => {
        if (colStep >= sortedCols.length) { clearAnimTimer(); return; }
        const ci = sortedCols[colStep].col;
        // Highlight column header
        document.querySelectorAll(".anim-canvas .letter-box").forEach(b => b.classList.remove("highlight"));
        const head = document.getElementById("colHead" + ci);
        if (head) head.classList.add("highlight");

        if (rowStep < numRows) {
          const cell = document.getElementById(`tCell${rowStep}_${ci}`);
          if (cell) { cell.classList.add("highlight"); readoff += cell.textContent; }
          document.getElementById("transReadoff").innerHTML = `<b>${readoff}</b>`;
          rowStep++;
        } else {
          rowStep = 0;
          colStep++;
        }
      }, 400);
    };

    document.getElementById("transPlay").addEventListener("click", play);
    document.getElementById("transReset").addEventListener("click", () => { clearAnimTimer(); reset(); });
  }

  // ─────────────── QUIZ RENDERER ───────────────

  function renderQuiz(lesson, panel) {
    quizState = { idx: 0, score: 0, answered: false };
    panel.innerHTML = `<div class="quiz-section" id="quizInner"></div>`;
    renderQuizQuestion(lesson);
  }

  function renderQuizQuestion(lesson) {
    const qs = lesson.quiz;
    const qi = quizState.idx;
    const inner = document.getElementById("quizInner");
    if (!inner) return;

    if (qi >= qs.length) {
      // Show score
      const pct = Math.round((quizState.score / qs.length) * 100);
      const emoji = pct === 100 ? "🎉" : pct >= 60 ? "👍" : "📚";
      inner.innerHTML = `
        <div class="quiz-score">
          <div class="score-emoji">${emoji}</div>
          <div class="score-text">${quizState.score} / ${qs.length} Correct!</div>
          <div class="score-detail">${pct === 100 ? "Perfect score! You've mastered this cipher." : pct >= 60 ? "Good job! Review the theory for any you missed." : "Keep studying! Review the theory and try again."}</div>
          <div class="score-bar"><div class="score-bar-fill" style="width:${pct}%"></div></div>
          <div class="score-actions">
            <button class="anim-btn" id="quizRetry">↺ Retry Quiz</button>
            <button class="anim-btn primary" id="quizBack">← Back to Ciphers</button>
          </div>
        </div>`;
      document.getElementById("quizRetry").addEventListener("click", () => {
        const p = document.getElementById("panel-quiz");
        p.dataset.rendered = "";
        renderQuiz(lesson, p);
      });
      document.getElementById("quizBack").addEventListener("click", () => { showCardGrid(); renderCardGrid(); });

      // Mark as completed
      setProgress(currentCipher);
      return;
    }

    const q = qs[qi];
    quizState.answered = false;
    const markers = ["A", "B", "C", "D"];

    inner.innerHTML = `
      <div class="quiz-progress">${qs.map((_, i) => {
        let cls = "quiz-pip";
        if (i < qi) cls += " done-correct"; // simplified
        else if (i === qi) cls += " active";
        return `<div class="${cls}"></div>`;
      }).join("")}</div>
      <div class="quiz-question">Q${qi + 1}. ${q.q}</div>
      <div class="quiz-options">${q.opts.map((o, i) => `
        <button class="quiz-option" data-idx="${i}">
          <span class="option-marker">${markers[i]}</span>
          <span>${o}</span>
        </button>
      `).join("")}</div>
      <div class="quiz-feedback" id="quizFeedback"></div>
      <button class="quiz-next" id="quizNext">Next Question →</button>
    `;

    // Click handlers
    document.querySelectorAll(".quiz-option").forEach((btn) => {
      btn.addEventListener("click", () => {
        if (quizState.answered) return;
        quizState.answered = true;
        const chosen = parseInt(btn.dataset.idx);
        const isCorrect = chosen === q.correct;
        if (isCorrect) quizState.score++;

        // Lock all options
        document.querySelectorAll(".quiz-option").forEach((b, i) => {
          b.classList.add("locked");
          if (i === q.correct) b.classList.add("correct");
          if (i === chosen && !isCorrect) b.classList.add("wrong");
        });

        // Show feedback
        const fb = document.getElementById("quizFeedback");
        fb.className = `quiz-feedback visible ${isCorrect ? "correct" : "wrong"}`;
        fb.innerHTML = isCorrect
          ? `✅ Correct! ${q.explanation}`
          : `❌ Incorrect. ${q.explanation}`;

        // Update pip
        const pips = document.querySelectorAll(".quiz-pip");
        if (pips[qi]) pips[qi].className = `quiz-pip ${isCorrect ? "done-correct" : "done-wrong"}`;

        document.getElementById("quizNext").classList.add("visible");
      });
    });

    document.getElementById("quizNext").addEventListener("click", () => {
      quizState.idx++;
      renderQuizQuestion(lesson);
    });
  }

})();
