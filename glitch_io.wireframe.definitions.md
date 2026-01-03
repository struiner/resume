glitch-io-wireframes.md
Screen Wireframe & Functional Region Definitions

This document defines all player‑facing screens in Glitch.io, a pinball simulation built around a glitchy, digital theme. Each screen is described via functional regions with tagged responsibilities.

This document:

Defines placement, visibility, and purpose of UI regions.

Does not define visuals, styles, or interaction timing.

Is authoritative for UI capability mapping.

GLOBAL UI CONVENTIONS

The following regions exist on all primary gameplay screens unless explicitly excluded.

REGION: TOP_BAR

Purpose: Always‑visible context and score display.

Contains:

Current table name (always “Glitch.io”)

Current score

Ball counter (remaining balls)

Active multiplier indicator

REGION: RIGHT_PANEL

Purpose: Contextual details and mode progress.

Visibility: Always visible during play; hidden on menu screens.

Contents vary by screen:

On gameplay screens: mode objectives, letters collected, current bonus status.

On menu screens: machine description or settings.

Read‑only unless explicitly noted.

REGION: BOTTOM_STATUS

Purpose: Short status messages and prompts.

Visibility: Collapsed by default; expands to display messages such as “MultiBall ready” or “Spell GLITCH for Bonus.”

No direct actions; purely informational.

SCREEN: MAIN_MENU

The initial menu where players start a new game and view high scores.

REGION: MAIN_PANEL

Displays: A stylised representation of the Glitch.io pinball machine along with the current top scores. Includes a prominent “Start Game” button.

Allows: Starting a game or navigating to the Settings screen.

REGION: RIGHT_PANEL (Machine Info)

Displays: A description of the Glitch.io machine, its glitch theme, and brief explanations of the four signature modes (Data Multiball, Overclock, Debug Round, Poltergeist). Also lists the letter sequences required to trigger each mode.

REGION: BOTTOM_STATUS

Displays: Instructions (e.g., “Press Start to launch a game; press Settings to adjust options”).

SCREEN: TABLE_PLAY

The core gameplay view where the pinball action occurs.

REGION: MAIN_PLAYFIELD

Displays:

A top‑down, scrolling view of the current table including flippers, bumpers, ramps, lanes, targets, and special mechanisms.

Animated lights and physics simulation of the ball(s).

Allows:

Flipper control via keyboard or mouse (left and right flippers).

Nudge input (limited) via tilt keys.

Launching a ball via plunger or auto‑launcher at start of ball.

Does NOT allow: Changing table, pausing or exiting (handled by separate menus).

REGION: TOP_BAR

Displays: As defined globally (score, balls, multiplier, table name).

REGION: RIGHT_PANEL (Gameplay)

Displays:

Current mode progress (letters collected, ramps remaining, jackpots lit).

Upcoming events (e.g., “Multiball ready,” “Hurry‑up ends in 10s”).

Table rules summary (read‑only) accessible via toggling.

REGION: BOTTOM_STATUS

Displays: Real‑time callouts and audio cues (“Extra Ball!”, “Jackpot!”). Auto‑scrolls if multiple messages.

SCREEN: PAUSE_MENU

Accessible via a pause button or key during gameplay.

REGION: MAIN_MENU

Displays: Options such as Resume, Restart Ball, Quit to Main Menu, Settings.

Allows: Resuming gameplay, restarting the current ball (costing one ball), or returning to the Main Menu.

REGION: RIGHT_PANEL (Help)

Displays: Quick reference for controls and tilt warnings.

SCREEN: GAME_OVER

Shown when all balls have been drained.

REGION: MAIN_SUMMARY

Displays:

Final score and breakdown by modes (e.g., points earned from MultiBall, jackpots, letter modes).

High‑score table with entries for initials and scores.

Allows: Entering initials if a new high score is achieved. Provides a button to play again or return to the Main Menu.

REGION: RIGHT_PANEL (Achievements)

Displays: Unlocked achievements or bonuses earned during play (e.g., “Completed Debug Mode,” “All letters collected”).

SCREEN: SETTINGS

Accessible via the pause menu or the main menu.

REGION: MAIN_SETTINGS

Displays: Toggle switches and sliders for volume, music, sound effects, display mode (fullscreen/windowed), and control mapping.

Allows: Modifying settings and saving preferences.

REGION: RIGHT_PANEL (Notes)

Displays: Explanations for each setting and default values.

END OF WIREFRAME DEFINITIONS

No visual styling, animations, or interaction timing is specified in this document.