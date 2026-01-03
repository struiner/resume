# EPIC: GLITCH.IO — Detailed Specification

## Introduction & Purpose

Glitch.io is a single‑table pinball simulation that fuses retro pinball sensibilities with a modern “glitch” aesthetic.  Inspired by classic PC/DOS pinball games like **Pinball Dreams** and **Pinball Fantasies**, the game embraces letter‑spelling objectives, multiball frenzies, timed scoring modes and high‑score pursuits:contentReference[oaicite:0]{index=0}:contentReference[oaicite:1]{index=1}.  This expanded epic builds upon the original ledger‑driven specification to provide a verbose, comprehensive blueprint for the game’s vision, world, systems, user interface and technical implementation.

The document references the **static definitions file** for immutable properties (table attributes, bumper types, ramps, flippers and modes) and the **wireframe layout** for UI structure.  It is designed as both a narrative and a set of actionable directives; every feature described here must be backed by an entry in a ledger or the static definitions.  Where possible, it ties modern design details back to precedents from classic pinball tables.  For example, many 1990s tables used lettered lights to unlock bonuses like extra balls, double bonus, hold bonus and score multipliers:contentReference[oaicite:2]{index=2}; Glitch.io inherits this idea through its BYTE, CIRCUIT, HACK and GHOST sequences.

## Non‑Negotiable Constraints

- **Originality and Homage** — No copyrighted names, artwork or music from existing pinball games may be used.  Inspiration from classics is expressed through mechanics (letter‑spelling modes, multiball, combo multipliers) and tone rather than direct assets.
- **Single Complex Table** — The entire game is built around one playfield (ID `G01_GLITCH_IO`).  This table contains multiple thematic sections (memory banks) and four distinct modes accessible via letter sequences.  There is no table selection screen and no additional playfields.
- **Ledger‑Driven & Deterministic** — All gameplay rules, scoring parameters and event probabilities must be resolved in ledgers or the static definitions.  The physics simulation must be deterministic; any randomness (e.g., glitch events) is parameterised and reproducible.
- **Web Technology** — The game runs as a web application built with Angular.  The playfield is rendered via HTML5 Canvas or WebGL and integrated with a physics library.  Touch and keyboard controls are both supported.
- **Skill‑Based Play** — Players must have meaningful control over outcomes.  Glitch events add uncertainty but always leave room for skillful recovery.  Tilt warnings are enforced; deliberate nudging is possible but excessive shaking will drain the ball.

## Section 1 — Root Task & Project Breakdown

### Root Task: GLITCH_IO_MASTER
The overarching objective is to deliver a fully playable Glitch.io pinball experience that aligns with this detailed epic.  The root task decomposes into six major subtasks:

1. **VISION_GLITCH** — Refine and document the creative vision, player fantasy, tone and design pillars.  This defines the emotional goals and guiding principles for all subsequent design decisions.
2. **CORE_LOOP_GLITCH** — Formalise the player’s repeating actions, feedback systems, progression incentives and win/loss conditions.  This ensures the game’s moment‑to‑moment experience is compelling and clear.
3. **WORLD_GLITCH** — Describe the setting, entities and underlying rules that govern the digital cabinet.  This includes physical hardware (ball, flippers, bumpers), environmental logic (physics, glitch events) and the relationship between them.
4. **SYSTEMS_GLITCH** — Detail the mechanical systems: ball physics, combo multipliers, glitch effects, mode timers, scoring and resources.  It also encapsulates the four signature modes (Data Multiball, Overclock, Debug Round, Poltergeist) and any auxiliary mini‑modes.
5. **UI_GLITCH** — Translate the wireframe into concrete UI specifications: screens, regions, controls and feedback channels.  Each screen from the wireframe (Main Menu, Table Play, Pause Menu, Game Over, Settings) must be implemented according to the region definitions.
6. **TECH_GLITCH** — Specify the technical architecture: choice of engine, platform targets, build pipeline and performance considerations.

Each subtask produces ledgers capturing decisions and can spawn further subtasks if deeper resolution is required.  Completion of the root task implies all subordinate tasks are done and the game can be implemented without inventing rules on the fly.

## Section 2 — Vision

### Player Fantasy

The player assumes the role of a **pinball wizard** operating a sentient pinball cabinet.  The machine, dubbed *Glitch.io*, exists in a neon‑lit cyberpunk arcade.  It has a mischievous personality: lights flicker unpredictably, magnets occasionally grab the ball, and electronic voices tease the player.  Through precise flipper control, nudging and ramp shots, the player manipulates the ball to unlock deeper functions within the cabinet.  The ultimate fantasy is mastery over the machine — bending its glitches to one’s advantage and achieving legendary scores.

### Tone & Aesthetic

Glitch.io fuses **retro‑future neon** with **digital distortion**.  The colour palette favours blues, purples and hot pinks, punctuated by bursts of white and orange when jackpots explode.  The audio combines classic pinball chimes with 16‑bit synth and distorted vocal callouts.  Humour is present but subtle; the machine occasionally displays tongue‑in‑cheek text like “Overclock initiated — don’t burn out!” while respecting the overall sleek aesthetic.  Each section of the playfield is illuminated by LED lamps, and glitch events are accompanied by screen static or inverted colours.

### Design Pillars

1. **Skill & Flow** — The control scheme (flippers, nudging, plunger) must feel responsive and precise.  Repetitive loop shots should encourage a trance‑like state where the player loses themselves in building multipliers and completing sequences.  This echoes classic strategies such as repeatedly shooting ramps to increase bonus multipliers:contentReference[oaicite:3]{index=3}.
2. **Glitch as Mechanic** — Unexpected events are telegraphed and can be exploited.  Glitch bumpers invert flipper controls after every third hit, forcing players to adapt.  Magnet pulses briefly trap or accelerate the ball.  These events provide tension and excitement without being unfair.
3. **Homage through Variety** — The single table contains four distinct modes inspired by classic pinball concepts: multiball chaos, timed scoring, target knock‑downs and spooky multi‑stage modes.  Letter‑spelling objectives pay homage to how classic tables used illuminated letters to enable extra ball, double bonus or other features:contentReference[oaicite:4]{index=4}.  Each mode offers its own soundtrack, light show and scoring rules to keep play fresh.
4. **Clarity & Feedback** — Players always know what they need to do.  LEDs next to each letter sequence indicate progress.  Mode availability is signaled by flashing lamps and voice callouts.  The UI displays current score, multiplier, balls remaining, mode timers and collected letters.  Sound cues reinforce successful shots and warn of impending ball drains.
5. **Progression & Mastery** — While there is no narrative campaign, players earn cosmetic table skins, achievement badges and leaderboard status.  Completing all four modes within a single game confers a special “System Exploited” achievement, while high scores unlock glitch effects or cabinet art variants.

## Section 3 — Core Gameplay Loop

### Actions

- **Launch** — At the start of each ball, the player pulls back the plunger using a mouse drag or touch gesture and releases to shoot the ball into the playfield.  A digital auto‑launcher can be enabled in settings.
- **Flipper Control** — The left and right flippers (standard length) keep the ball in play and aim at targets.  Mini flippers on the upper playfield are activated during certain modes; they require finer timing due to their shorter length.
- **Target Shots** — The player aims for stand‑up targets spelling B Y T E, rollover lanes for C I R C U I T, drop targets for H A C K and captive ball shots for G H O S T.  Collecting a complete word lights the corresponding mode at the centre ramp or captive ball.
- **Ramp & Loop Shots** — Left and right loop ramps score base points and increment a combo multiplier by ×0.5 per successive hit (up to ×5).  Hitting the centre ramp resets the combo but awards an immediate bonus and can start a mode.
- **Bumper Interaction** — Standard bumpers offer small points and random deflection.  Glitch bumpers invert controls every third hit, and mega bumpers award high points and light an extra ball after five hits.
- **Nudge** — The player can nudge the table left, right or up to influence the ball’s path.  Nudging accumulates a tilt meter; exceeding the tilt threshold drains the current ball and forfeits bonus points.
- **Mode Activation** — When a letter sequence is complete and the mode start is lit, shooting the centre ramp or captive ball initiates the corresponding mode.  During modes, the game state changes significantly (e.g., multiple balls, double scoring, ghost magnets).  Completing mode objectives returns the playfield to normal and grants bonuses or extra balls.

### Feedback & UI

- **Top Bar** — Displays “Glitch.io” as the table name, current score, balls remaining and active multiplier.  When a mode is active, a timer bar appears next to the multiplier.
- **Right Panel** — During gameplay, shows collected letters, remaining shots to light each mode, current jackpot value and any hurry‑up countdowns.  On menus, it displays machine lore or settings explanations.
- **Bottom Status Bar** — Pops up short messages like “BYTE locked!”, “Jackpot 75 000!”, “Glitch event triggered!” or warnings about tilt.
- **Audio Cues** — Each event has a unique sound: targets play a chime, ramps play a swoosh, bumpers emit pops, and glitch bumpers play a distorted glitch noise.  Voice callouts announce mode names (“Data Multiball!”, “Overclock ready!”) and extras.

### Progression & Win/Loss

The game ends when all balls are drained.  The default is three balls, but extra balls can be earned through mega bumper hits or completing Poltergeist Mode.  There is no final “win” condition; success is measured by high score and achievements.  Players can enter their initials for high‑score tables.  Achievements encourage mastery: completing all four modes within one game, achieving a ×5 multiplier, scoring a single jackpot over 250 000 points, or surviving a long glitch event without draining.

## Section 4 — World & Fiction

### Setting

Glitch.io exists within a fictional cyberpunk arcade in Rotterdam.  The cabinet, built by an enigmatic hacker collective, is sentient and draws players into a digitised world.  Its single playfield represents a circuit board of the machine’s mind: neon highways (loops), data towers (targets), debug consoles (drop targets) and haunted memory sectors.  Each letter sequence corresponds to a subsystem — B Y T E unlocks raw data processing, C I R C U I T energises the processor pathways, H A C K exposes the underlying code, and G H O S T opens a backdoor to the machine’s haunted past.  The Poltergeist Mode hints at the machine being inhabited by a rogue AI or ghost in the machine.

### Entities

- **Ball** — A chrome sphere representing a bit of data.  Subject to gravity, friction and magnetism.  Its velocity and spin are tracked in the physics simulation.
- **Flippers** — The primary tools the player uses.  Standard flippers at the bottom keep the ball from draining; mini flippers on the upper playfield appear during Poltergeist Mode and certain mini‑games.
- **Bumpers** — Pop bumpers include standard, glitch and mega variants.  Each has a defined point value and special effect: random deflection, control inversion, and extra ball lighting.
- **Ramps & Loops** — Left and right loop ramps feed opposing flippers and build the combo multiplier.  The centre ramp is the gateway to modes and awards higher base points but resets the combo.
- **Targets** — Stand‑up targets light B Y T E letters; rollover lanes cycle through C I R C U I T letters; drop targets spell H A C K; a captive ball with magnets is used to spell G H O S T.
- **Outlanes & Inlanes** — The left and right outlanes drain balls; inlanes feed balls back to the flippers and sometimes light letters.
- **Modes & Mini‑Modes** — Data Multiball, Overclock, Debug Round and Poltergeist are the primary modes.  Secondary mini‑modes include the **Super Loop Hurry‑Up** (lit when both loops are completed), **Mystery Award** (random award collected via the mega bumper), and **Skill Shot** (hitting a specific rollover at the start of a ball).

### World Rules

The digital world abides by deterministic physics: ball movement is governed by gravity, elasticity and friction coefficients.  Letter lamps remain lit until their corresponding mode is started or the ball drains.  Glitch events (inverted controls, flickering lights, magnetic pulls) occur based on probabilities defined per bumper; the player is always warned via sound and light cues before an event triggers.  Scoring is additive and multiplicative: base points are added for each hit, and combo multipliers scale those values.  Tilt warnings accumulate if the player nudges repeatedly; exceeding the tilt threshold ends the current ball and forfeits the held bonus and mode progress.

## Section 5 — Systems

### Mechanics

1. **Deterministic Physics** — The simulation uses fixed‑timestep rigid‑body dynamics.  Collisions with flippers, bumpers and walls conserve momentum with defined restitution coefficients.  Ball spin influences side roll when hitting angled surfaces.
2. **Combo Multiplier** — Each successive loop ramp increases the multiplier by ×0.5.  The multiplier resets to ×1 when the ball hits the centre ramp or drains.  The maximum multiplier is ×5, incentivising players to alternate loop shots and manage risk.
3. **Glitch Events** — Hitting a glitch bumper three times triggers an event: controls invert for 2 seconds, lights flicker and ball speed temporarily increases.  In Poltergeist Mode, magnets activate unpredictably for added challenge.  The probabilities and durations of glitch events are defined in the static definitions and can be tuned via ledger resolutions.
4. **Mode Timers** — Timed modes display a countdown in the top bar.  The timers pause while balls are served or saved and resume when all balls are in play.  Expiring the timer ends the mode even if objectives are incomplete.
5. **Extra Ball & Ball Save** — Five hits on the mega bumper light an extra ball in the outlane.  Shooting the lit lane grants an extra ball.  A ball save feature is active for the first 10 seconds of each ball; draining during this window automatically reloads the ball without penalty.
6. **Mystery Award** — Randomly lit by the glitch bumper or mega bumper.  Collecting the award via the centre scoop grants random prizes: instant points, temporary ball save, a glitch event cancel, or lighting a letter.  The random selection is seeded from a deterministic table.

### Resources

- **Balls** — Lives; start with three, can be increased via extra balls.  Ball save acts as a temporary shield.
- **Score** — Accumulated across all hits and modes.  Jackpots during modes start at defined values (50 000 for Data Multiball, 75 000 for Debug Round) and increase by defined increments.  Completing stages in Poltergeist Mode awards large jackpots (100 000) and an extra ball.
- **Multiplier** — Increases scoring; resets on mode start or centre ramp hit.  Displayed prominently in the top bar.
- **Letters Collected** — Tracked individually for each sequence; resetting on ball drain.  Used to determine mode readiness.
- **Glitch Rating** — A meta‑score across sessions representing the number of modes completed, highest multiplier achieved and total number of glitch events survived.  Used for leaderboards and cosmetics.

### Modes & Upgrades

Each primary mode has its own trigger, ball count, duration and scoring rules, as defined in the static definitions:

1. **Data Multiball (M01)**
   - **Trigger** — Spell B Y T E via stand‑up targets.  Lock two balls via the centre ramp (a ball lock indicator shows progress).  Hit the centre ramp again to launch multiball.
   - **Balls** — Three balls are in play.  Additional locks are disabled during the mode.
   - **Duration** — Continues until two balls drain or all jackpots are collected.
   - **Scoring** — Jackpots start at 50 000 points and increase by 25 000 with each collection.  Hitting a glitch bumper doubles the jackpot value for the next shot.  Combo multipliers also apply.
   - **Strategy** — The player must manage multiple balls, prioritising hitting flashing jackpot shots (loops and centre ramp) while avoiding drains.  Inverted controls from glitch events add tension.

2. **Overclock (M02)**
   - **Trigger** — Spell C I R C U I T by completing rollover lanes (lanes cycle each time they are passed).  Within 15 seconds of spelling the word, shoot both loop ramps.
   - **Effect** — Doubles all ramp and bumper values for 30 seconds.  During this window, the “Super Loop” hurry‑up is lit: completing left and right loops alternately within 10 seconds awards a 250 000 point bonus.
   - **Scoring** — All base values are doubled; hitting the centre ramp resets the multiplier but awards a large bonus.  Once the timer expires, play returns to normal.
   - **Strategy** — Players must act quickly, alternating ramps to build and cash in on the doubled scoring.  The mode encourages fluid play and mastery of both flippers.

3. **Debug Round (M03)**
   - **Trigger** — Knock down H A C K drop targets (arranged in a bank).  Once all targets are down, shoot the centre ramp.
   - **Balls** — Single ball.  No multiball.
   - **Duration** — 45 seconds.  Hitting a glitch bumper subtracts 5 seconds but increases the jackpot value by 5 000 points; thus, risk and reward are intertwined.
   - **Scoring** — All major shots (ramps, lanes, bumpers) award jackpots starting at 75 000 points and increasing by 15 000 each time.  Hitting all drop targets again relights jackpots.
   - **Strategy** — This mode focuses on precision and speed.  Players must weigh the benefits of hitting glitch bumpers for higher jackpots against the reduced timer.  Completing multiple jackpots within the timeframe yields large scores.

4. **Poltergeist (M04)**
   - **Trigger** — Spell G H O S T by hitting the captive ball and inner loop.  Once spelled, shoot the captive ball again to start the mode.
   - **Balls** — Single ball, but magnets and disappearing shots simulate supernatural interference.
   - **Stages** — Three stages with increasing challenge:
     1. **Manifest** — Magnets randomly energise, pulling the ball off course.  All major shots are lit for 25 000 points.  After hitting six lit shots, move to the next stage.
     2. **Possess** — The mini‑flipper appears on the upper playfield.  Hitting ghost targets with the mini‑flipper scores 50 000 points each.  Random ball path changes occur.  After hitting four ghost targets, proceed.
     3. **Exorcise** — All lights flicker and the centre ramp becomes the only lit shot.  Hitting it three times scores 100 000 points per shot and awards an extra ball upon completion.  Failure to hit within 15 seconds ends the mode prematurely.
   - **Strategy** — Players must adapt to unpredictable magnet pulses and inverted controls.  Managing ball speed and angle is critical, particularly when using the mini‑flipper.  Completing the mode awards a huge bonus and an extra ball, making it essential for high score attempts.

### Upgrades & Achievements

While Glitch.io does not feature RPG‑style upgrades, players can unlock cosmetic changes and hidden challenges through achievements:

- **Cabinet Skins** — Earned for reaching certain high‑score thresholds.  Skins include “Retro Wireframe”, “Neon Dreams” and “Ghostly Green”.  Skins modify LED colours and ball trails but not gameplay.
- **Glitch Modifier** — Awarded for completing all four modes in a single game without tilting.  Activating this modifier in the Options menu increases the frequency of glitch events for a greater challenge and higher score multiplier.
- **Secret Mode** — A hidden mini‑mode becomes available after spelling all four words at least once in one game.  It triggers a short sequence of random awards and a chance for a massive score.

## Section 6 — User Interface & Experience

### Screen Overview

Glitch.io’s UI follows the wireframe definitions.  All primary gameplay screens share consistent regions: a top bar for score/multiplier, a right panel for context, and a bottom status bar for messages.  The screens are:

1. **Main Menu** — The opening screen shows a stylised view of the Glitch.io machine.  A central “Start Game” button initiates a new game.  To the right, a panel summarises the machine’s lore, the four modes and their corresponding letter sequences.  High scores scroll beneath the machine, encouraging competition.  A Settings button opens the settings screen.  The bottom status bar instructs players to start or adjust settings.
2. **Table Play** — The core gameplay screen uses a scrolling perspective to show the entire playfield.  The top bar displays score, balls, multiplier and active mode timer.  The right panel lists letters collected for BYTE, CIRCUIT, HACK and GHOST, shows the current combo multiplier, and indicates which mode is ready.  Buttons for flipper control are placed unobtrusively at the edges on touch devices.  The bottom status bar flashes messages like “Super Loop lit!” or “Glitch event incoming!”
3. **Pause Menu** — Accessible via the pause key or a menu button, this overlay darkens the playfield and offers options: Resume, Restart Ball (costs a ball), Quit to Main Menu, and Settings.  The right panel provides a quick reference for controls and tilt warnings.
4. **Game Over** — Appears when the last ball drains.  The main panel displays the final score and a breakdown of points earned from each mode, combo multipliers and glitch bonuses.  A high‑score table allows players to enter initials.  Buttons let players start a new game or return to the main menu.  The right panel lists achievements unlocked during the session.
5. **Settings** — Accessible from the main menu or pause menu.  Options include volume sliders, toggle for music and sound effects, full‑screen toggle, visual quality settings, and control remapping.  Each setting has a brief explanation in the right panel.  The bottom status bar reminds players to save changes before exiting.

### Controls

Keyboard defaults are: Left flipper (Z or Left Arrow), Right flipper (/ or Right Arrow), Launch (Space or Down Arrow), Nudge left (X), Nudge right (C), Nudge up (Up Arrow), Pause (Esc or P).  On touch devices, transparent buttons representing flippers and plunger are placed at the screen edges.  Control mapping can be customised; remapping to gamepads is supported.  The controls must respond within 16 ms to avoid perceived lag.

### Feedback Systems

Every action has immediate feedback:

- **Visual** — LED lamps illuminate when letters are collected.  Ramps flash when part of a combo.  The playfield darkens slightly during glitch events and brightens when jackpots are hit.  Mode timers shrink as time runs out.
- **Audio** — Sound effects correspond to each element.  Distinct callouts announce modes.  A heartbeat sound subtly increases tempo when timers are below 10 seconds.
- **Text** — The bottom status bar scrolls narrative flavour (“Circuits overheating…”) and system messages (“Extra Ball Lit”).

UI accessibility options include colourblind modes (adjusting LED hues), high‑contrast settings and subtitles for callouts.

## Section 7 — Technology & Implementation

### Engine & Architecture

Glitch.io will be built as an **Angular** single‑page application.  The rendering layer will use either HTML5 Canvas with WebGL acceleration or a dedicated WebGL library (e.g., PIXI.js) to draw the playfield and effects.  Physics will be handled by a deterministic physics engine (such as Matter.js) configured with fixed timesteps and seeded random number generators for glitch events.  Separation of concerns is enforced: simulation logic resides in services; UI components subscribe to reactive streams for updates.

### Platform Targets

The game targets modern desktop and mobile browsers (Chrome, Safari, Firefox, Edge).  Responsive design ensures playability on various screen sizes.  Performance targets include 60 fps on average hardware.  Asset loading is optimised via lazy loading and sprite atlases.  Offline capability is optional but desirable for arcades with intermittent connections.

### Build & Continuous Integration

Development uses Angular’s build pipeline (`ng build`) with custom WebGL shaders compiled at build time.  Continuous integration runs unit tests for physics accuracy and UI component rendering.  Linting enforces code quality and deterministic usage of randomness.  Deployments generate a versioned build to be hosted on the portal’s CDN.  A telemetry module records anonymised gameplay metrics (e.g., average game time, most triggered mode) for balancing.

### Performance & Quality Targets

- **Physics Accuracy** — Collisions must be accurate within ±1 pixel.  Test cases include multi‑ball interactions and edge cases near flipper tips.
- **Input Latency** — Flipper commands must register within one frame (~16 ms).  Touch controls must be debounced to prevent accidental double flips.
- **Determinism** — Simulations with identical initial conditions and random seeds should produce identical outcomes.  This ensures fairness in leaderboards and eases debugging.
- **Accessibility** — The game must meet WCAG 2.1 AA standards for colour contrast and keyboard navigation.

## Conclusion

This detailed epic clarifies every facet of the **Glitch.io** project.  By elaborating on the vision, mechanics, world, UI and technical requirements, it ensures that designers and developers have a shared understanding of the desired outcome.  The static definitions file supplies concrete parameters (scores, triggers, modes, bumpers, ramps), while the wireframe outlines the UI structure.  The legacy of classic pinball — lighting letters to collect bonuses:contentReference[oaicite:5]{index=5} and navigating themed objectives:contentReference[oaicite:6]{index=6}:contentReference[oaicite:7]{index=7} — is carried forward into a cohesive single‑table experience.  With this specification, the team can proceed confidently to production, knowing that there are no hidden assumptions and that every gameplay element is designed with intent.
