# Me — Product Film v3 (9:16, 64.8 s, narrated)

Revision 3 goals: clean, simple, professional look; real narration; OWS removed; hardware + app introduced together; a dedicated scene explaining how the family owns everything.
Privacy rule (authoritative): AI processing is local; actions that reach outside services share only task details, and only after approval.

## Identity
- Palette: porcelain #F3F2EE field, graphite #17191C ink, slate #6B6F76 secondary, hairline #DAD8D2, one accent: deep teal #1E6B66 (matches the device status light).
- Type: Geist (display 500, -0.045em) + Geist Mono for labels. No serif italics, grain, glows or blobs.
- Mark: thin graphite ring with a teal core.
- Motion: short 0.5–0.9 s ease-out rises, hairline clip wipes, no bounces.
- Assets: public/images/piggy.png, public/images/me-home.png (generated concept hardware, no branding).

## Shots and narration
| # | Time | Scene | On screen | Narration (starts +0.4 s) |
|---|---|---|---|---|
| 1 | 0–7.4 | piggy | YESTERDAY: "We invested in a child's future with a piggy bank." Three coins drop. 3.5 s: TODAY "Now we invest in their intelligence." Piggy fades, Me mark appears. | "We used to invest in a child's future with a piggy bank. Now, it's time to invest in their intelligence." |
| 2 | 7.4–14.0 | learn | Graphite wipe. WHAT KIDS NEED TO LEARN. Rows: Use AI / Don't be used by it (0.3 s), Trust it / Never blindly (2.7 s), Offload chores / Keep the thinking (4.6 s). | "Kids need to learn to use A.I., not be used by it. To trust it, but never blindly." |
| 3 | 14.0–20.6 | meet | "Meet Me." "Not another chatbot. A home AI computer + the app that connects your family to it." The device and the phone appear together, joined by a teal dashed line. Cards: 01 HARDWARE Me Home / 02 APP Me. Phone shows "Connected to Me Home" and the family profiles. | "Meet Me. A home A.I. computer, and the app that connects your family to it." |
| 4 | 20.6–34.6 | private | Simple private chat (fictional, non-clinical). "Ask the hard questions." → (7.4 s) "Processed at home." Header: Me · private chat · on Me Home. You: "I'm two months behind on rent. I'm embarrassed to tell my family." → typing → Me: "That's more common than it feels. Want to make a plan, and think about how to tell them?" → You: "Where does this chat go?" → typing → Me: "It's processed on Me Home and saved on its drive. It isn't sent to the cloud." → (9.0 s) circular iris from the phone opens to a full-bleed photo of the Me Home computer on a living-room sideboard (public/images/me-home-room.jpg), slow push-in, teal pulse rings from its status light; eyebrow "ME HOME · IN THE LIVING ROOM", headline "Your chat is saved right here." Chat stays clean (no data-path strip). Footer: Fictional example · Processed on Me Home. Claim scoped to this chat; no claim about who in the household can read it; approved external actions elsewhere may still share task details. | "Some questions feel hard to say out loud. With Me, a conversation like this is processed on the computer in your home, and saved on its own drive. It never goes to the cloud." |
| 5 | 34.6–46.6 | feed | Full-screen reels with snap scroll ("For Maya", RANKED ON ME HOME · RULES BY MOM & DAD): volcano science (0) → pet fail, JUST FOR FUN (1.3) → prank, JUST FOR FUN (2.6). 4.0 s: Feed rules dial sheet; 5.0 s: MOM CHANGED THIS, Learning 30%→80%. 7.6 s sheet drops; 8.0 s paper-bridge reel, 10.0 s bee-dance reel, both tagged FROM YOUR RULE. Headlines: "A feed you control." → "Built to teach, not to hook." → "You set the dial. The feed follows." Browsing beat removed. | "And her feed works for her. Short videos, like the apps she knows, but made to teach, not to keep her hooked. You turn the dial, and the feed follows your rules." |
| 6 | 46.6–59.2 | own | HOW YOU OWN IT, "It lives in your home." Device hero; four cards timed to the narration: You own the machine (in your home) / Open-source models (no AI processing in the cloud) / Your data, your drive (data stored on the home computer) / Your rules. | "And you own all of it. The computer lives in your home, runs open-source models, keeps your family's data on its own drive, and follows the rules you set." |
| 7 | 59.2–64.8 | lockup | A graphite iris opens: Me mark, "Me", "Home-first intelligence.", ME HOME AI COMPUTER · ME APP. Then the iris closes for the loop. | "Me. Home-first intelligence." |

## Audio spec
- Narration: ElevenLabs voice "Frederick Surrey" (calm British narrator), public/audio/vo_*.mp3, each placed 0.4 s into its scene.
- Music: public/audio/bg_music.mp3, minimal felt piano/pads at 84 BPM, mixed under the voice at 0.22 with a fade-out.
- Playback: public/audio/composite_audio.mp3 (64.8 s; bed extended by a 4 s triangular crossfade at 53–57 s into its own 4 s mark, fade-out 61.8–64.8 s), built with ffmpeg adelay/amix (normalize=0).
- Scene durations follow the narration lengths; the cuts are not aligned to music beats.
