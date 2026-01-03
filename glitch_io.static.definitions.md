glitch-io-static-definitions.md
Static Properties Registry (Immutable)

This document defines all static, named, enumerable properties for Glitch.io, a pinball‑type game. All values herein are authoritative unless superseded by a future ledger resolution. No dynamic rules, formulas, or behaviours are defined here.

SECTION 1 — PINBALL TABLE (1)

This game focuses on a single machine, Glitch.io, which incorporates multiple letter sequences and modes inspired by classic pinball tables. The table has the following attributes:

Name: Unique identifier and display name.

Theme: Core aesthetic and setting.

Modes: List of special modes available on this table and how to trigger them.

Letter Sequences: Words to spell to light mode locks (mirroring the letter‑spelling goals in classic pinball games
en.wikipedia.org
).

Description: Lore‑free summary of play style and objectives.

Table: G01_GLITCH_IO

Theme: Sentient glitch pinball cabinet mixing neon cyberspace, racetrack speed and haunted hardware. The machine feels alive and occasionally injects glitch events.

Modes:

Data Multiball – Spell B Y T E via stand‑up targets to enable locks; lock two balls via the centre ramp and hit the ramp again to start a three‑ball frenzy.

Overclock – Light C I R C U I T by completing rollover lanes; shoot both loops within 15 seconds to double ramp values for 30 seconds.

Debug Round – Knock down H A C K drop targets; start the mode at the centre ramp for timed jackpots that increase with each shot.

Poltergeist – Spell G H O S T via the captive ball and inner loop; shoot the captive ball to begin a multistage mode with magnets and disappearing shots.

Letter Sequences: Multiple sequences (B Y T E, C I R C U I T, H A C K, G H O S T). Letters light when targets are hit and persist until their corresponding mode is started or the ball drains.

Description: A single, highly complex table combining the best elements of classic pinball. Players navigate long loops, precise ramps and drop targets to spell words. Completing sequences triggers modes with unique scoring rules. Glitch bumpers and magnets introduce unpredictable twists, demanding skill and strategy.

SECTION 2 — BUMPER TYPES (3)

Each bumper type has:

Name

Score Value: Base points per hit.

Effect: Additional behaviour beyond scoring.

Description

Bumper: B01_STANDARD_BUMPER

Score Value: 1 000 points per hit.

Effect: Adds small random variation to ball trajectory.

Description: Basic pop bumper. Standard score addition with little risk.

Bumper: B02_GLITCH_BUMPER

Score Value: 2 500 points per hit.

Effect: Randomly inverts flipper controls for 2 seconds after each third hit (introduces a “glitch” moment).

Description: A special bumper unique to the Glitch.io machine; adds unpredictability and encourages situational awareness.

Bumper: B03_MEGA_BUMPER

Score Value: 5 000 points per hit.

Effect: Lights an additive bonus; after five hits, lights an Extra Ball at the outlane.

Description: Large bumper positioned near upper playfields; high reward but risk of draining due to steep ricochet.

SECTION 3 — RAMP TYPES (3)

Each ramp type has:

Name

Base Score

Multiplier Contribution

Description

Ramp: R01_LEFT_LOOP

Base Score: 5 000 points.

Multiplier Contribution: Advances combo multiplier by ×0.5 (cumulative).

Description: Long sweeping ramp that feeds the right flipper. Repeated shots stack the combo multiplier up to ×5.

Ramp: R02_RIGHT_LOOP

Base Score: 5 000 points.

Multiplier Contribution: Advances combo multiplier by ×0.5 (cumulative).

Description: Mirror of the left loop; feeds the left flipper. Completing both loops lights the Super Loop for a one‑shot hurry‑up.

Ramp: R03_CENTER_RAMP

Base Score: 10 000 points.

Multiplier Contribution: Resets combo but awards immediate bonus; lights mode start when lit.

Description: Central ramp used to start signature modes (Data Multiball, Overclock, Debug Round, Poltergeist Mode). Requires precision to hit.

SECTION 4 — FLIPPER TYPES (2)
Flipper: F01_STANDARD_FLIPPER

Position: Lower left/right

Length: Standard (as per classic pinball machines)

Color: Neon blue (customizable in settings)

Description: Primary flippers controlled by the player; required to keep the ball in play.

Flipper: F02_MINI_FLIPPER

Position: Upper playfield (varies by mode)

Length: Shorter

Color: Neon purple

Description: Secondary flippers that allow shots to upper lanes and secrets. In the Glitch.io table these appear on the upper playfield during specific modes and mini‑games. Their shorter length encourages precise timing for advanced shots.

SECTION 5 — MODE EVENTS (4)

Each mode represents a special state or scoring opportunity triggered by specific conditions. Modes are mutually exclusive unless noted.

Mode: M01_DATA_MULTIBALL

Trigger: Collect all letters in BYTE, then lock two balls via ramp shots. Hit center ramp to start.

Balls In Play: 3

Duration: Until two balls drain or all jackpots collected.

Description: Primary multiball for the Glitch.io machine. Jackpots start at 50 000 and increase by 25 000 per collection. Hitting glitch bumpers doubles jackpot value.

Mode: M02_OVERCLOCK

Trigger: Spell CIRCUIT and hit both loops within 15 seconds.

Effect: Doubles all ramp and bumper values for 30 seconds; lights Super Loop for a one‑time 250 000 point award.

Description: A timed scoring mode rewarding speed and accuracy on the Glitch.io playfield.

Mode: M03_DEBUG_ROUND

Trigger: Knock down HACK drop targets, then shoot the center ramp.

Effect: All major shots (ramps, lanes, bumpers) award jackpots that start at 75 000 points and increase by 15 000 each time; hitting glitch bumpers subtracts from the timer but adds to jackpot value.

Duration: 45 seconds or until timer expires.

Description: Primary scoring mode on the Glitch.io machine, encouraging rapid target completion. This mode fuses the hacker theme into the singular Glitch.io table.

Mode: M04_POLTERGEIST

Trigger: Spell GHOST and shoot the captive ball.

Stages: Three stages with escalating difficulty and rewards.

Manifest – Switches on magnets randomly; all major shots light for 25 000 points.

Possess – Lights the mini‑flipper for ghost shots worth 50 000 points and adds random ball path changes.

Exorcise – All lights flicker; jackpots worth 100 000 points available at the center ramp. Completion awards Extra Ball.

Description: A complex multistage mode reminiscent of spooky tables in classic pinball games. Completion requires hitting a sequence of lit shots without draining.

END OF STATIC DEFINITIONS

All items in this document are immutable identifiers. Behaviour and scoring logic are defined elsewhere.