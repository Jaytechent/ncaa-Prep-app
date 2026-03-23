// ─────────────────────────────────────────────────────────────────────────────
// parseController.js
//
// Pure JavaScript question parser — NO AI, NO external API, always works.
//
// SUPPORTED FORMATS (auto-detected, mix and match in same paste):
//
// Format 1 — ANS: label
//   1. Question text?
//   A. Option one
//   B. Option two
//   C. Option three
//   D. Option four
//   ANS: B
//
// Format 2 — Asterisk on correct option
//   1. Question text?
//   A. Option one
//   B. Option two *
//   C. Option three
//   D. Option four
//
// Format 3 — Answer on its own line (just the letter)
//   1. Question text?
//   A) Option one
//   B) Option two
//   C) Option three
//   D) Option four
//   Answer: C
//
// Format 4 — No answer marker at all (will be flagged as "needs review")
//   1. Question text?
//   a. Option one
//   b. Option two
//   c. Option three
//   d. Option four
//
// Numbers, letters, parentheses all accepted: 1. / 1) / Q1. / Q.1
// Option prefixes: A. / A) / (A) / a. / a) — all fine
// ─────────────────────────────────────────────────────────────────────────────

// ─── REGEX PATTERNS ───────────────────────────────────────────────────────────

// Matches question starters: "1.", "1)", "Q1.", "Q.1", "Question 1."
const QUESTION_START = /^(?:Q(?:uestion)?[\s.]*)?\d+[\.\)]\s+(.+)/i;

// Matches option lines: "A.", "A)", "(A)", "a.", "a)"
const OPTION_LINE = /^[(\s]*([A-Da-d])[.\)\s]\s*(.+)/;

// Matches answer markers anywhere in a line
const ANS_MARKER = /(?:ANS(?:WER)?|CORRECT(?:\s+ANSWER)?)\s*[:\-]?\s*([A-Da-d])/i;

// Asterisk at end of option text
const ASTERISK_MARKER = /\*\s*$/;

// Standalone answer line: just "B" or "B." or "(B)"
const STANDALONE_ANS = /^\s*[(\s]*([A-Da-d])[.\)\s]*\s*$/;

// ─── PARSER ───────────────────────────────────────────────────────────────────
function parseQuestionBlock(lines, tradeStr, blockIndex) {
  const result = {
    trade:         tradeStr,
    text:          '',
    options:       [],
    correctAnswer: '',
    explanation:   'Refer to the relevant NCAA/ICAO regulation for this topic.',
    difficulty:    'Medium',
    _needsReview:  false,
  };

  const optionMap = {};   // { 'A': 'text', 'B': 'text', ... }
  const questionLines = [];
  let   answerFound   = false;

  for (let i = 0; i < lines.length; i++) {
    const raw  = lines[i];
    const line = raw.trim();
    if (!line) continue;

    // ── Check for ANS: marker ──
    const ansMatch = line.match(ANS_MARKER);
    if (ansMatch) {
      result.correctAnswer = ansMatch[1].toUpperCase();
      answerFound = true;
      continue;
    }

    // ── Check for option line ──
    const optMatch = line.match(OPTION_LINE);
    if (optMatch) {
      const letter = optMatch[1].toUpperCase();
      let   text   = optMatch[2].trim();

      // Check for asterisk marker on this option
      if (ASTERISK_MARKER.test(text)) {
        text = text.replace(ASTERISK_MARKER, '').trim();
        result.correctAnswer = letter;
        answerFound = true;
      }

      optionMap[letter] = text;
      continue;
    }

    // ── Check for standalone answer line (just the letter) ──
    // Only if we already have some options (so we don't confuse with question)
    if (Object.keys(optionMap).length > 0) {
      const saMatch = line.match(STANDALONE_ANS);
      if (saMatch) {
        result.correctAnswer = saMatch[1].toUpperCase();
        answerFound = true;
        continue;
      }
    }

    // ── Otherwise treat as question text ──
    // Strip leading numbering if present
    const qMatch = line.match(QUESTION_START);
    questionLines.push(qMatch ? qMatch[1].trim() : line);
  }

  result.text = questionLines.join(' ').trim();

  // Build ordered options array
  ['A','B','C','D'].forEach(letter => {
    if (optionMap[letter] !== undefined) {
      result.options.push({ id: letter, text: optionMap[letter] });
    }
  });

  // Flag if no answer found or not enough options
  if (!answerFound || result.correctAnswer === '') {
    result._needsReview  = true;
    result.correctAnswer = result.options[0]?.id || 'A'; // default to A
  }
  if (result.options.length < 4) {
    result._needsReview = true;
  }

  return result;
}

// ─── SPLIT PASTE INTO QUESTION BLOCKS ────────────────────────────────────────
function splitIntoBlocks(text) {
  const lines  = text.split('\n');
  const blocks = [];
  let   current = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // New question starts when we see a number prefix AND we already have content
    const isNewQuestion = QUESTION_START.test(trimmed) && current.length > 0;

    if (isNewQuestion) {
      blocks.push(current);
      current = [line];
    } else {
      current.push(line);
    }
  }

  if (current.length > 0) blocks.push(current);
  return blocks;
}

// ─── VALIDATE ─────────────────────────────────────────────────────────────────
function validate(q) {
  const issues = [];
  if (!q.text || q.text.length < 5)     issues.push('question text too short');
  if (q.options.length < 2)             issues.push(`only ${q.options.length} options found (need 4)`);
  if (q.options.length < 4)             issues.push(`only ${q.options.length} of 4 options found`);
  if (!['A','B','C','D'].includes(q.correctAnswer)) issues.push(`invalid answer: "${q.correctAnswer}"`);
  if (q._needsReview)                   issues.push('no answer marker found — defaulted to A');
  return issues;
}

// ─── MAIN CONTROLLER ─────────────────────────────────────────────────────────
const parseQuestions = async (req, res, next) => {
  const TAG = 'parseQuestions';
  try {
    const { rawText, trade } = req.body;

    // ── Input validation ──
    if (!rawText || typeof rawText !== 'string' || rawText.trim().length < 10) {
      return res.status(400).json({ message: 'rawText is required (minimum 10 characters)' });
    }
    if (!trade) {
      return res.status(400).json({ message: 'trade is required' });
    }

    console.log(`\n[${TAG}] ─── Parse request ───`);
    console.log(`[${TAG}] Trade   : ${trade}`);
    console.log(`[${TAG}] Length  : ${rawText.length} chars`);
    console.log(`[${TAG}] Preview : ${rawText.slice(0, 200)}`);

    // ── Split into blocks ──
    const blocks = splitIntoBlocks(rawText);
    console.log(`[${TAG}] Found ${blocks.length} question block(s)`);

    const valid       = [];
    const needsReview = [];
    const skipped     = [];

    blocks.forEach((block, idx) => {
      const nonEmpty = block.filter(l => l.trim().length > 0);
      if (nonEmpty.length < 3) {
        // Too short to be a real question
        console.warn(`[${TAG}] Block ${idx + 1}: skipped (too short — ${nonEmpty.length} lines)`);
        return;
      }

      const q      = parseQuestionBlock(block, trade, idx);
      const issues = validate(q);

      if (issues.length === 0) {
        // Perfect — remove internal flag before saving
        const { _needsReview, ...clean } = q;
        valid.push(clean);
        console.log(`[${TAG}] Block ${idx + 1}: ✅ "${q.text.slice(0, 50)}..." → ANS: ${q.correctAnswer}`);
      } else if (q.text && q.options.length >= 2) {
        // Parseable but imperfect — include with review flag
        const { _needsReview, ...clean } = q;
        needsReview.push({ ...clean, _issues: issues });
        console.warn(`[${TAG}] Block ${idx + 1}: ⚠️  needs review — ${issues.join(', ')}`);
      } else {
        // Not parseable at all
        skipped.push({ blockIndex: idx + 1, preview: nonEmpty[0]?.slice(0, 80), issues });
        console.error(`[${TAG}] Block ${idx + 1}: ❌ skipped — ${issues.join(', ')}`);
      }
    });

    console.log(`[${TAG}] ✅ Valid: ${valid.length} | ⚠️ Review: ${needsReview.length} | ❌ Skipped: ${skipped.length}`);

    res.json({
      questions:    valid,
      needsReview,
      stats: {
        total:        blocks.length,
        valid:        valid.length,
        needsReview:  needsReview.length,
        skipped:      skipped.length,
        skippedDetails: skipped,
      },
    });

  } catch (error) {
    console.error(`[${TAG}] ❌ Fatal:`, error.message, '\n', error.stack);
    next(error);
  }
};

module.exports = { parseQuestions };