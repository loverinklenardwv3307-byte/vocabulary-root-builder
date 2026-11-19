/** Tunable parameters for the learning flow. */

/** Branded splash duration. Must stay at 8000 ms (pipeline screenshot gate). */
export const LOADER_DURATION_MS = 8000;

export const QUIZ_LENGTH = 5;
export const PASS_THRESHOLD = 4;
export const MASTERY_PASS_DATES = 2;

export const DAILY_GOAL_DEFAULT = 3;
export const DAILY_GOAL_MIN = 1;
export const DAILY_GOAL_MAX = 5;

export const REVIEW_INTERVAL_DAYS = 7;

export const ROOT_COUNT = 6;
export const PREFIX_COUNT = 15;
export const SUFFIX_COUNT = 6;
export const WORD_COUNT = 30;

/** Builder targets per lesson. */
export const BUILDER_TARGETS = 2;

/** Motion budget (ms) — ordinary transitions stay within 150-200 ms. */
export const FADE_MS = 180;
export const ENTER_MS = 160;
export const STAGGER_MS = 20;
export const STAGGER_CAP_MS = 200;
export const CHECKMARK_MS = 180;

/** Press feedback spring. */
export const PRESS_SCALE = 0.98;
export const PRESS_IN_MS = 80;
export const PRESS_TENSION = 120;
export const PRESS_FRICTION = 14;

/** Board geometry — see rules #4/#5. */
export const BOARD_PADDING = 16;
export const BOARD_BORDER = 1;
export const BOARD_FRAME = BOARD_PADDING + BOARD_BORDER;
export const SLOT_GAP = 8;
export const SLOT_MIN_HEIGHT = 64;

export const TOUCH_MIN = 48;
export const PRIMARY_HEIGHT = 56;
export const SECONDARY_HEIGHT = 48;
export const CONTROLS_TARGET_HEIGHT = 200;
