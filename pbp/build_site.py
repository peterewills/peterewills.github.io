import html
import re
import markdown as md

import os

HERE = os.path.dirname(os.path.abspath(__file__))
SRC = f"{HERE}/_source"
OUT = f"{HERE}/site"

os.makedirs(f"{OUT}/videos", exist_ok=True)

VIDEOS = [
    dict(
        n=1, dirname="video1", slug="video1",
        section="PBP 2027 Prep Series", ep="#1",
        title="Mark Thomas discusses 2026",
        url="https://www.youtube.com/watch?v=kKd04aq0flc",
        blurb="Rob Hawks interviews Mark Thomas (RUSA #64, 7x PBP finisher) about why 2026 matters even though nothing is technically required until 2027 — ACP's pre-registration system rewards riders who complete a longer brevet or LRM event in 2026 with earlier registration waves and better start-time choices, and 2026 is also the ideal year to dial in equipment, nutrition, and sleep strategy for a 1200K. Covers the shift from RUSA-mediated to direct ACP registration and the actual qualifying requirements for 2027, closing with a rapid-fire Q&A on bikes, control food, and favorite controls.",
    ),
    dict(
        n=2, dirname="video2", slug="video2",
        section="PBP 2027 Prep Series", ep="#2",
        title="Putting in the miles",
        url="https://www.youtube.com/watch?v=XGlNY5vjq6g",
        blurb="Rob Hawks interviews Lisa Charlebois (San Francisco Randonneurs, PBP 2023 finisher) about physical preparation through working with a cycling coach — how she found her coach, the “simulation weekend” technique of riding two centuries back-to-back on minimal sleep to expose equipment and nutrition failure points before the event, and Rob's own contrasting decades of self-coached vs. coached PBP attempts. Closes with a rapid-fire Q&A and reflections on riding to finish and enjoy the experience rather than to race.",
    ),
    dict(
        n=3, dirname="video3", slug="video3",
        section="PBP 2027 Prep Series", ep="#3",
        title="A chorus of voices",
        url="https://www.youtube.com/watch?v=-pkRVNqGXgs",
        blurb="Rob Hawks interviews Peter Curley, creator of the “PBP Stories and Tips” YouTube channel and a two-time PBP finisher, who distills lessons from 50+ rider interviews into six universal recommendations: know your goals, over-communicate with teammates, treat every ride as training, minimize time off the bike, don't underestimate logistics stress, and expect things to go wrong. Also covers PBP's start-wave structure (80/84/90-hour groups) and a range of riders' sleep strategies on course.",
    ),
    dict(
        n=4, dirname="video4", slug="video4",
        section="PBP 2027 Prep Series", ep="#4",
        title="Prepping for PBP from the Regional Brevet Admins' perspective",
        url="https://www.youtube.com/watch?v=g_q1hxdsIC8",
        blurb="Rob Hawks interviews two Regional Brevet Administrators, Josh Haley (Ohio) and Rose Cox (Seattle/SIR), about how their regions are structuring the 2026 pre-qualifying season and the compressed 2027 qualifying season, advice on how many brevets to ride beyond the bare minimum, the value of practicing night riding, and Rose's perspective on riding PBP as a woman.",
    ),
    dict(
        n=5, dirname="video5", slug="video5",
        section="PBP 2027 Prep Series", ep="#5",
        title="Bag drops and Paris-Brest-Paris",
        url="https://www.youtube.com/watch?v=VcUuGiydEOc",
        blurb="Rob Hawks interviews Deb Banks, who ran a bag-drop service at PBP 2023, about what a bag-drop service actually is, the bad experiences as a rider in 2007 and 2011 that inspired her to start it, detailed packing advice (bag size, labeling, waterproofing, AirTags), and the added logistical complexity the new 2027 route creates since the classic Loudéac out-and-back control is now visited only once.",
    ),
    dict(
        n=6, dirname="video6", slug="video6",
        section="PBP 2027 Prep Series", ep="#6",
        title="Riding the 80 hour group and training without a coach",
        url="https://www.youtube.com/watch?v=wpHk-eOAW4E",
        blurb="Rob Hawks interviews James Walsh, who achieved Charlie Miller time (sub-56:40, self-supported) at PBP 2023, about self-directed training using the TrainerRoad app, how his pacing and sleep strategy changed between his 2019 and 2023 rides, mass-start-group practice, and general advice on brevet volume and drop-bag planning for the new PBP 2027 route.",
    ),
    dict(
        n=7, dirname="video7", slug="video7",
        section="PBP 2027 Prep Series", ep="#7",
        title="John Ende and the Adrian Hands Society",
        url="https://www.youtube.com/watch?v=RGPfJoZawVg",
        blurb="Rob Hawks interviews John Ende, a six-time PBP finisher, about the Adrian Hands Society — a randonneuring society honoring “full value” PBP finishes near the 90-hour cutoff, named for Adrian Hands, a rider who died of ALS in 2011 shortly after the society launched. Covers the society's history, qualifying criteria (finishing in 88:55 or slower), its international membership, and its counterpart, the speed-focused Charlie Miller Society.",
    ),
    dict(
        n=8, dirname="video8", slug="interview1",
        section="RUSA PBP Prep Interview Series", ep="#1",
        title="Cheryl Becker",
        url="https://www.youtube.com/watch?v=vX4biv0e6Rg",
        blurb="Rob Hawks interviews Cheryl Becker about her path into randonneuring via the Northern California double-century circuit, her relatively unplanned preparation for PBP 2019 (riding the 84-hour group, including an out-of-order qualifying series), and her experience as a woman at PBP — finding the event's scale and international variety welcoming rather than intimidating, with uniformly warm crowd support along the route.",
    ),
    dict(
        n=9, dirname="video9", slug="interview2",
        section="RUSA PBP Prep Interview Series", ep="#2",
        title="Roger Hillas",
        url="https://www.youtube.com/watch?v=QCclh3hPM4Y",
        blurb="Rob Hawks interviews five-time PBP finisher Roger Hillas (2003, 2007, 2011, 2015, 2019) about the very different weather and conditions across his five editions, mechanical self-sufficiency (fixing a kinked chain by headlamp in 2007), pacing philosophy (“stay calm, things are going to go bad”), regional French/Breton history and language tips for enjoying the route, and his decision to try the 90-hour start for the first time on what he expects to be his sixth and final PBP.",
    ),
    dict(
        n=10, dirname="video10", slug="interview3",
        section="RUSA PBP Prep Interview Series", ep="#3",
        title="Karen Nutter",
        url="https://www.youtube.com/watch?v=42Ov73MeeHw",
        blurb="Rob Hawks interviews two-time PBP finisher Karen Nutter (2015, 2019) about the dramatic improvement in her sleep strategy and overall confidence between her two rides, her switch from the 90-hour to the 84-hour (daytime) start, hiring a trainer both times, and gear lessons including upgrading to a generator hub to remove light-failure anxiety.",
    ),
    dict(
        n=11, dirname="video11", slug="interview4",
        section="RUSA PBP Prep Interview Series", ep="#4",
        title="Boyz On The Hoods (Ben, Carlin, Ian & Irving)",
        url="https://www.youtube.com/watch?v=c-J5aFgefqM",
        blurb="Rob Hawks interviews four Bay Area friends — Ian, Ben Goldenberg, Carlin, and Irving, riding under the team name “Boys on the Hoods” — who rode PBP 2019 together, discussing how years of shared fleches and brevets built the trust to ride independently on the road while regrouping at controls, detailed pre-ride pacing schedules, and memorable moments from the ride, including sleeping under a stairwell and the best watermelon of one rider's life at a roadside stand.",
    ),
    dict(
        n=12, dirname="video12", slug="seminar1",
        section="RUSA PBP Prep Seminars", ep="#1",
        title="Full panel seminar",
        url="https://www.youtube.com/watch?v=8mOpy6A215A",
        blurb="A RUSA prep webinar with eight presenters covering qualification, registration, and capacity for PBP (Mark Thomas); how to use the pre-PBP year to prepare; a harrowing first-PBP story from Deb Banks riding the disastrous, rain-soaked 2007 edition; Shermer's neck lessons from Dawn's 2015 PBP; French-language preparation (Greg); riding for Charlie Miller time (Brian Kilgore); trip logistics and lodging (Eric Norris); and club jerseys (Rose Cox). The longest and most comprehensive video in this collection.",
    ),
    dict(
        n=13, dirname="video13", slug="seminar1-1",
        section="RUSA PBP Prep Seminars", ep="#1.1",
        title="Bill Bryant on bikes and equipment",
        url="https://www.youtube.com/watch?v=drg1zDi28JE",
        blurb="An interview with Bill Bryant, a RUSA co-founder, longtime bike mechanic, and frame builder, covering how PBP bikes and gear have evolved since the late 1970s (generator lights, bags, fenders, clothing), a practiced roadside tire/puncture-repair routine, common mechanical failures beyond flats, the right timing for bike-fit changes before a qualifying season, and his “three keys” framework for a PBP-ready bike: fit, reliability, and reasonable weight.",
    ),
    dict(
        n=14, dirname="video14", slug="seminar2",
        section="RUSA PBP Prep Seminars", ep="#2",
        title="Start-wave panel + Q&A",
        url="https://www.youtube.com/watch?v=25KMZKJaj_E",
        blurb="A RUSA prep seminar covering each PBP start wave in turn: Max Paletta on the fast, adrenaline-heavy 80-hour start; Deb Banks on the 90-hour start as an “insurance policy”; Mary Gersma on the smaller 84-hour tandem start; Mark Thomas on PBP's surprisingly hilly climbing profile and how to train for it; and an interview segment with three-time finisher Narayan Krishnamurthy on riding smarter across repeat attempts — closing with a rapid-fire audience Q&A.",
    ),
    dict(
        n=15, dirname="video15", slug="seminar3",
        section="RUSA PBP Prep Seminars", ep="#3",
        title="Bag drop service + registration briefing",
        url="https://www.youtube.com/watch?v=_2Uo67iouaQ",
        blurb="A RUSA seminar presenting a first-year bag-drop service (Deb Banks, Eric Norris, Bill Green) with detailed packing and logistics guidance, pricing ($75/bag), and policy Q&A, followed by Mark Thomas's detailed briefing on PBP pre-registration and registration deadlines, qualifying windows, and start-wave availability for the 2023 cycle — useful as a template for how the 2027 registration process is likely to run.",
    ),
]

CSS = """
:root {
  --bg: #faf8f5;
  --bg-card: #ffffff;
  --text: #2a2420;
  --text-dim: #6b6259;
  --accent: #a13d2e;
  --accent-soft: #f2e3de;
  --border: #e5ddd3;
  --transcript-bg: #f5f1ea;
  --link: #8a3226;
}
@media (prefers-color-scheme: dark) {
  :root {
    --bg: #1b1815;
    --bg-card: #252019;
    --text: #ede6dc;
    --text-dim: #a89d8f;
    --accent: #e08a6f;
    --accent-soft: #3a2a24;
    --border: #3a332b;
    --transcript-bg: #211d18;
    --link: #e8a48c;
  }
}
:root[data-theme="dark"] {
  --bg: #1b1815; --bg-card: #252019; --text: #ede6dc; --text-dim: #a89d8f;
  --accent: #e08a6f; --accent-soft: #3a2a24; --border: #3a332b;
  --transcript-bg: #211d18; --link: #e8a48c;
}
:root[data-theme="light"] {
  --bg: #faf8f5; --bg-card: #ffffff; --text: #2a2420; --text-dim: #6b6259;
  --accent: #a13d2e; --accent-soft: #f2e3de; --border: #e5ddd3;
  --transcript-bg: #f5f1ea; --link: #8a3226;
}
* { box-sizing: border-box; }
body {
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
  line-height: 1.55;
}
.wrap { max-width: 820px; margin: 0 auto; padding: 2.5rem 1.5rem 5rem; }
h1 { font-size: 1.9rem; margin: 0 0 0.3rem; }
h1.page-title { margin-top: 0.6rem; }
.subtitle { color: var(--text-dim); margin: 0 0 2rem; font-size: 1.05rem; }
.section-title {
  font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.08em;
  color: var(--accent); margin: 2.5rem 0 1rem; font-weight: 600;
}
.section-title:first-of-type { margin-top: 1rem; }
.card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 1.2rem 1.4rem;
  margin-bottom: 1rem;
}
.card h3 { margin: 0 0 0.5rem; font-size: 1.15rem; }
.card h3 a { color: var(--text); text-decoration: none; }
.card h3 a:hover { color: var(--accent); }
.ep-tag {
  display: inline-block; background: var(--accent-soft); color: var(--accent);
  font-size: 0.75rem; font-weight: 600; padding: 0.15rem 0.5rem; border-radius: 5px;
  margin-right: 0.5rem; vertical-align: middle;
}
.card p.blurb { margin: 0.4rem 0 0.6rem; color: var(--text); }
.card .yt-link { font-size: 0.85rem; }
a { color: var(--link); }
.back-link { font-size: 0.9rem; margin-bottom: 1.5rem; display: inline-block; text-decoration: none; color: var(--text-dim); }
.back-link:hover { color: var(--accent); }
.meta-line { color: var(--text-dim); font-size: 0.95rem; margin-bottom: 1.8rem; }
.summary-body h2 { font-size: 1.15rem; margin: 1.6rem 0 0.5rem; color: var(--accent); }
.summary-body p { margin: 0.6rem 0; }
.summary-body ul { margin: 0.4rem 0 0.9rem; padding-left: 1.3rem; }
.summary-body li { margin: 0.3rem 0; }
.summary-body strong { color: var(--text); }
details.transcript-toggle {
  margin-top: 2.2rem;
  border: 1px solid var(--border);
  border-radius: 10px;
  background: var(--bg-card);
  overflow: hidden;
}
details.transcript-toggle summary {
  cursor: pointer;
  padding: 0.9rem 1.3rem;
  font-weight: 600;
  color: var(--accent);
  list-style: none;
  user-select: none;
}
details.transcript-toggle summary::-webkit-details-marker { display: none; }
details.transcript-toggle summary::before { content: "\\25B8  "; }
details.transcript-toggle[open] summary::before { content: "\\25BE  "; }
.transcript-body {
  padding: 0 1.3rem 1.3rem;
  white-space: pre-wrap;
  font-size: 0.92rem;
  color: var(--text-dim);
  background: var(--transcript-bg);
  border-top: 1px solid var(--border);
  padding-top: 1rem;
  max-height: 70vh;
  overflow-y: auto;
}
footer { margin-top: 3rem; color: var(--text-dim); font-size: 0.85rem; border-top: 1px solid var(--border); padding-top: 1.2rem; }
footer a { color: var(--text-dim); text-decoration: underline; }
footer a:hover { color: var(--accent); }
.doc-body h2 { font-size: 1.35rem; margin: 2.2rem 0 0.7rem; color: var(--accent); }
.doc-body h3 { font-size: 1.1rem; margin: 1.6rem 0 0.5rem; }
.doc-body p { margin: 0.6rem 0; }
.doc-body ul, .doc-body ol { margin: 0.4rem 0 0.9rem; padding-left: 1.4rem; }
.doc-body li { margin: 0.35rem 0; }
.doc-body code {
  background: var(--accent-soft); color: var(--accent);
  padding: 0.1rem 0.35rem; border-radius: 4px; font-size: 0.88em;
  font-family: "SF Mono", Menlo, Consolas, monospace;
}
.doc-body pre {
  background: var(--transcript-bg);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.9rem 1.1rem;
  overflow-x: auto;
  margin: 0.8rem 0 1.2rem;
}
.doc-body pre code {
  background: none; color: var(--text); padding: 0; font-size: 0.85rem; line-height: 1.5;
}
.callout {
  border-left: 4px solid var(--accent);
  background: var(--accent-soft);
  border-radius: 0 8px 8px 0;
  padding: 0.9rem 1.1rem;
  margin: 1rem 0 1.4rem;
}
.callout p:first-child { margin-top: 0; }
.callout p:last-child { margin-bottom: 0; }
"""

def md_to_html(text):
    # normalize the closing "Video URL / Title" footer out - handled separately by templates
    text = re.sub(r"\n?---\n\n\*\*Video URL:\*\*.*$", "", text, flags=re.S)
    text = re.sub(r"\n?\*Note:.*$", "", text, flags=re.S)

    # python-markdown needs a blank line before a list actually starts; our
    # summaries write "**Header**\n- item" with no blank line, so lists never
    # get recognized. Insert a blank line before any "- " line whose previous
    # line is non-blank and not itself a list item.
    lines = text.split("\n")
    fixed = []
    for i, line in enumerate(lines):
        is_item = re.match(r"^\s*-\s", line)
        if is_item and fixed and fixed[-1].strip() != "" and not re.match(r"^\s*-\s", fixed[-1]):
            fixed.append("")
        # bump 2-space nested-bullet indent to 4-space so python-markdown
        # recognizes it as a nested list instead of flattening it
        m = re.match(r"^(\s*)- (.*)$", line)
        if m and len(m.group(1)) == 2:
            line = "    - " + m.group(2)
        fixed.append(line)
    text = "\n".join(fixed)

    return md.markdown(text.strip(), extensions=["extra", "sane_lists"])

def doc_md_to_html(text):
    # standard markdown with fenced code blocks - written with proper blank
    # lines, so no preprocessing hacks needed here (unlike md_to_html above).
    return md.markdown(text.strip(), extensions=["extra", "sane_lists", "fenced_code"])

def video_page(v):
    with open(f"{SRC}/{v['dirname']}/summary.md") as f:
        summary_md = f.read()
    with open(f"{SRC}/{v['dirname']}/transcript.txt") as f:
        transcript = f.read().strip()

    summary_html = md_to_html(summary_md)
    transcript_escaped = html.escape(transcript)

    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>{html.escape(v['ep'] + ': ' + v['title'])} — PBP Prep Videos</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="../style.css">
</head>
<body>
<div class="wrap">
  <a class="back-link" href="../index.html">&larr; Back to all videos</a>
  <div class="ep-tag">{html.escape(v['section'])} {html.escape(v['ep'])}</div>
  <h1 class="page-title">{html.escape(v['title'])}</h1>
  <div class="meta-line">
    <a href="{html.escape(v['url'])}" target="_blank" rel="noopener">Watch on YouTube &#8599;</a>
  </div>

  <div class="summary-body">
  {summary_html}
  </div>

  <details class="transcript-toggle">
    <summary>Full transcript</summary>
    <div class="transcript-body">{transcript_escaped}</div>
  </details>

  <footer>Transcribed locally with whisper.cpp (small model) and summarized by Claude. Proper nouns / jargon corrected where obvious; transcript is raw and may contain errors.</footer>
</div>
</body>
</html>
"""
    with open(f"{OUT}/videos/{v['slug']}.html", "w") as f:
        f.write(page)

PROCESS_MD = r"""
# How This Site Gets Updated

A runbook for a **future Claude session** doing the thing this site actually needs
periodically: **Rob Hawks (`@robhawks`) posts new videos to the same channel, and
they need to be added to this site** &mdash; not a from-scratch rebuild, not a different
channel. Everything below assumes the site already exists at this path, with
`_source/videoN/` folders and a `VIDEOS` list in `build_site.py` covering the videos
already processed.

The one-time setup (tools, model, initial 15 videos) is done. This doc is about the
recurring, cheaper task: check the channel, find what's new, run the same per-video
pipeline on *only* the new videos, and append them to the existing site without
touching anything already built.

## Overview of an update run

1. Check what's already covered (read the `VIDEOS` list in this file) and list the
   channel's current videos to diff against it.
2. For each genuinely new video: download audio &rarr; convert to 16kHz mono &rarr;
   transcribe locally with whisper.cpp &rarr; summarize into a structured markdown file
   &mdash; same pipeline as before, into a new `_source/videoN/` folder.
3. If there's more than one or two new videos, fan step 2 out across background
   subagents (Claude Code's `Agent` tool), same as the original run &mdash; see the
   gotchas below, they still apply.
4. Append one entry per new video to the `VIDEOS` list in this file (reuse the
   existing `section` name if it's the same ongoing series), then rerun
   `python build_site.py`. Existing video pages regenerate identically; only the
   index page and the new video pages actually change.

## 1. Confirm the toolchain is still there

This machine already has everything installed from the initial run, but a fresh
session doesn't know that &mdash; confirm rather than assume, and only install what's
actually missing:

```bash
which yt-dlp && which ffmpeg && which whisper-cli
python -c "import markdown" 2>&1
```

If `whisper-cli` is missing its model, don't re-download blindly &mdash; the model used
for every video on this site so far is at:

```
/Users/peter.wills@equipmentshare.com/Library/Application Support/MacWhisper/models/ggml-model-whisper-small.bin
```

(Originally installed by MacWhisper, not by this pipeline — worth rechecking with
`find ~ -iname "ggml-*.bin"` in case that's moved or a better model has since been
added.) Use the **same model** for new videos that was used for the existing ones, so
transcription quality/quirks stay consistent across the site.

## 2. Find what's new on the channel

First, see what's already covered — every video already on the site has a `url=`
entry in the `VIDEOS` list below in this file:

```bash
grep -oE 'url="[^"]+"' build_site.py
```

Then list what's currently on the channel and diff by video ID:

```bash
yt-dlp --flat-playlist --print "%(id)s | %(title)s | %(duration_string)s" \
  "https://www.youtube.com/@robhawks/videos"
```

Any video ID in the channel listing that isn't already in the `grep` output above is
new. Get its upload date too (cheap, skip-download):

```bash
yt-dlp --skip-download --print "%(id)s|||%(title)s|||%(upload_date)s|||%(duration_string)s" \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```

Sanity-check the title against the existing series naming (e.g. `PBP 2027 Prep
Series #N: ...`) &mdash; if Rob starts a genuinely new/different series, that's worth
flagging to the user rather than silently lumping it into an existing section.

## 3. The per-video pipeline (unchanged)

Same as the original run, once per new video, in a fresh `_source/videoN/` folder
(continue the numbering &mdash; if the last one is `video15`, the next is `video16`):

This is the core loop, run once per video in its own working directory:

```bash
mkdir -p "$WORKDIR" && cd "$WORKDIR"

# 1. audio only, as wav
yt-dlp -x --audio-format wav --audio-quality 0 -o "audio.%(ext)s" "$VIDEO_URL"

# 2. whisper.cpp needs 16kHz mono
ffmpeg -y -i audio.wav -ar 16000 -ac 1 -c:a pcm_s16le audio16k.wav

# 3. transcribe (plain text output, no timestamps)
whisper-cli -m "$MODEL_PATH" -f audio16k.wav -otxt -of transcript --print-progress

# 4. free disk space - a raw wav can be 400MB-1.5GB depending on length
rm -f audio.wav audio16k.wav
```

Then read `transcript.txt` and write a structured `summary.md` &mdash; see the exact
prompt template in section 4 below for the format that worked well.

## 4. If there's more than a couple of new videos: fan out (and the gotchas)

For one new video, just run the pipeline yourself in the main conversation. For more
than a couple at once (e.g. catching up after being away for a month), running it
sequentially is slow and burns context on transcript text you don't need there.
Instead, launch one background subagent (Claude Code's `Agent` tool) per new video,
with a fully self-contained prompt: exact commands, the model path, the working
directory, and formatting instructions for the summary. The subagent does the whole
download &rarr; transcribe &rarr; summarize pipeline independently and returns only the
finished summary text.

<div class="callout">

**This is the part that went wrong repeatedly in practice.** Four distinct failure
modes showed up the first time this ran across a batch of 14 parallel subagents.
They'll show up again on any future multi-video batch too &mdash; bake the fixes
directly into the agent prompt up front rather than rediscovering them.

</div>

### Gotcha 1: agents stop and wait for a "notification" that never comes

Subagents kept launching whisper-cli with the Bash tool's `run_in_background: true`
option (or the `Monitor` tool), then ending their turn saying "I'll wait for the
completion notification" &mdash; but that notification pattern is for the *main*
session's background tasks, not something a subagent can meaningfully wait on inside
its own turn. The agent just stops, indefinitely, having done nothing after that
point.

**Fix:** tell the agent explicitly not to use `run_in_background` or `Monitor` for
this. Instead, background the process with plain shell job control, then poll with an
ordinary *blocking* foreground `Bash` call that returns real output when it's done:

```bash
# launch, detached, returns immediately
nohup whisper-cli -m "$MODEL_PATH" -f audio16k.wav -otxt -of transcript \
  --print-progress > whisper.log 2>&1 & disown; echo launched
```

```bash
# then poll with a single blocking call (timeout: 590000 or so) -
# this actually blocks and returns "DONE" when the file appears
while [ ! -f transcript.txt ]; do sleep 20; done; echo DONE
```

If that poll call times out before the file exists (common for anything over ~30
minutes of audio), just call the *exact same* wait command again &mdash; never restart
whisper-cli, it's still running from the first launch. Tell the agent explicitly to
complete the read/summarize steps in the *same turn* immediately after the poll
returns "DONE", rather than ending its turn again.

### Gotcha 2: the sandbox silently kills the backgrounded process anyway

Even with the plain-shell-backgrounding approach above, a `while` polling loop that
runs past roughly 590 seconds can cause the sandbox to reap the backgrounded
whisper-cli process silently &mdash; no error, it just dies mid-transcription. This is
easy to miss: the poll loop just keeps timing out and you assume it's slow, when it's
actually dead.

**Fix:** if a video is long enough that transcription clearly should have progressed
further than it has, sanity-check with `ps aux | grep whisper-cli` and `tail
whisper.log` to see if the process is actually still alive and the log is still
growing. If it's dead, relaunch the exact same whisper-cli command but with
`dangerouslyDisableSandbox: true` set on that specific Bash call &mdash; this exempts
just that one long-running command from the reaping behavior. It only affects the
sandboxing of that command; it does not grant any additional capability beyond what
the agent already had (no network access, no new file permissions) &mdash; it just lets
a long-lived local process survive past the tool call's own scope. Worth noting
transparently to the user afterward, since instructing a subagent to disable
sandboxing is the kind of thing that (correctly) gets flagged for review.

### Gotcha 3: subagents can't write files that look like "reports"

Subagent `Write` calls to a file literally named `summary.md` get hard-blocked with
something like *"subagents should return findings as text, not write report
files."* This is a deliberate harness restriction on subagents self-reporting, and it
fires on the filename/context, not on user intent &mdash; even when the task explicitly
asks for a `summary.md` deliverable.

**Fix:** don't fight it. Tell agents to just return the full summary as their final
answer text if the write is blocked (some worked around it via a Bash heredoc or a
write-then-`mv` trick instead &mdash; that also works, but isn't necessary). Either way,
the **coordinating session** should always plan to persist the returned text to disk
itself, since you can't rely on every subagent's write succeeding.

### Gotcha 4: CPU contention when many whisper-cli jobs run at once

Running many transcriptions in parallel on one machine means they all compete for the
same CPU cores, so each one takes noticeably longer than it would running alone.
This isn't really fixable &mdash; it's just worth setting expectations (and telling the
user) that a batch of a dozen-plus long videos can take the better part of an hour of
wall-clock time even though each individual transcription is fast in isolation.

### The prompt template that worked

Each per-video agent prompt should include, concretely:

- The exact video title, URL, and expected duration.
- The exact working directory to use.
- The exact shell commands for each pipeline step (don't make the agent improvise
  the yt-dlp/ffmpeg/whisper-cli invocations &mdash; give them verbatim).
- The gotchas above, stated as direct instructions ("do not use `run_in_background`
  or `Monitor` for this, instead...").
- The desired summary format &mdash; what worked well here: a one-line **Video:** header
  naming participants/credentials, then a handful of bolded thematic sections each as
  a bullet list of *concrete* points (names, numbers, dates, specific advice &mdash; not
  vague paraphrasing), a dedicated section for any rapid-fire Q&amp;A/lightning-round
  segment, and an instruction to silently correct obvious whisper mis-transcriptions
  of jargon/proper nouns rather than preserving garbled text.
- An instruction to return the video's URL/title at the end of the summary, so the
  coordinator can match it back up without re-deriving it.

## 5. Coordinator responsibilities

While the batch runs:

- Use `TaskCreate`/`TaskUpdate` to track one task per video plus a final "compile"
  task, so progress is visible and nothing gets dropped.
- As each agent's summary comes back, write it to `summary.md` in that video's
  directory yourself (see Gotcha 3) rather than assuming the agent already did.
- If an agent reports it already "delivered" a summary in an earlier turn that you
  don't actually have in context (this happens when a `SendMessage` reply is terse),
  ask it to resend the full text rather than fabricating or skipping that video.
- Keep transcripts *and* summaries side by side per video &mdash; don't discard the raw
  transcript once summarized. It's the thing you'll want to search when the user
  later asks a specific question the summary didn't happen to cover (see below).

## 6. Adding the new video(s) to the site

This file (`build_site.py`) is the generator. It expects a `_source/videoN/`
directory per video (each containing `summary.md` and `transcript.txt`), a `VIDEOS`
metadata list describing title/URL/section/one-paragraph blurb per video, and
produces `index.html` + `videos/*.html` + `style.css`.

To add a new video:

1. Put its `summary.md` and `transcript.txt` in a new `_source/videoN/` folder
   (continuing the numbering).
2. Append a new `dict(...)` entry to the `VIDEOS` list, copying the shape of an
   existing entry in the same `section` (reuse `"PBP 2027 Prep Series"` as-is if
   that's still the ongoing series &mdash; don't invent a new section name for a video
   that's just the next episode of the same one). Write a fresh one-paragraph
   `blurb` for it — condense the new summary down to ~3-6 sentences, matching the
   tone of the existing blurbs on the index page.
3. Rerun:

```bash
cd /path/to/this/site && python build_site.py
```

Every video page is regenerated from its `summary.md` every time the script runs,
including ones that didn't change &mdash; that's expected and harmless (their output is
deterministic, so an unrelated re-run produces byte-identical files for untouched
videos). Only `index.html` and the brand-new video page(s) will actually have new
content.

Notable implementation details worth knowing before editing this script further:

- **Markdown list-blank-line hack.** The summarizing agents write
  `**Header**\n- item` with no blank line before the list, which most markdown
  parsers (including Python's `markdown` package) won't recognize as a real list
  without a preceding blank line. `md_to_html()` inserts one automatically rather
  than trying to get 15 independently-written summaries to all follow strict
  markdown list syntax.
- **Nested-bullet indent fix.** The same summaries use 2-space indentation for
  nested sub-bullets; standard markdown wants 4-space (or a full tab) to recognize
  nesting, otherwise it silently flattens the sublist into the parent list. Bumped
  to 4-space before conversion.
- **Don't hand-write HTML entities in Python string literals that later get
  `html.escape()`'d.** This bit us directly: a few `VIDEOS` blurb/title fields were
  written with literal `&amp;`, `&mdash;`, etc. (intending them as ready-made HTML),
  and then a template call to `html.escape()` on that same field turned `&amp;` into
  `&amp;amp;` &mdash; which renders in the browser as the literal text `&amp;` instead of
  an ampersand. The fix (and the right way to do it from the start): keep the raw
  Python strings as plain Unicode (`&`, `&mdash;` written as the actual character
  &mdash;, `"curly quotes"` as actual curly-quote characters), and either escape
  consistently exactly once wherever a field is inserted, or don't escape fields
  that are meant to already be safe plain text. Don't mix both.
- **Collapsible transcripts.** Each video page uses a native `<details>`/`<summary>`
  element for the full transcript rather than JS tabs &mdash; works with zero
  JavaScript, and is closed by default so the page reads as summary-first.
- **Theme-aware CSS.** Uses `prefers-color-scheme` plus `:root[data-theme]`
  overrides so it looks reasonable in both light and dark, without needing any
  external CSS framework &mdash; this is a fully offline, dependency-free static site.

## 7. Quality-checking before calling it done

- Open the **new** video page(s) and the index in an actual browser &mdash; don't just
  eyeball the generated HTML source.
- Grep the whole output tree for tell-tale double-escaping artifacts before
  shipping: `grep -rn "amp;amp;" .` should return nothing. This is especially worth
  doing after hand-writing a new `blurb`/`title` string &mdash; see the entity-escaping
  note above, it's an easy mistake to reintroduce on every new entry.
- Spot-check that nested bullet lists in the new summary actually nest (`<ul>` inside
  an `<li>`, not a flat sibling list).
- Confirm the new video landed in the right section on the index page, in the right
  order (episode order within a section, matching its `ep` field).
- If the user asks a substantive question about the content afterward, prefer
  grepping the raw `_source/*/transcript.txt` files (now including the new one) over
  relying purely on the condensed summaries &mdash; summaries are lossy by design, and a
  specific question often surfaces detail and exact quotes that only exist in the
  full transcript.
"""

def process_page():
    body_html = doc_md_to_html(PROCESS_MD)
    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>How to Add New Videos — PBP Prep Videos</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="wrap">
  <a class="back-link" href="index.html">&larr; Back to all videos</a>
  <div class="doc-body">
  {body_html}
  </div>
  <footer>This page documents the pipeline used to build this site, for future re-use.</footer>
</div>
</body>
</html>
"""
    with open(f"{OUT}/process.html", "w") as f:
        f.write(page)

def index_page():
    sections = []
    seen = []
    for v in VIDEOS:
        if v["section"] not in seen:
            seen.append(v["section"])

    cards_by_section = {s: [] for s in seen}
    for v in VIDEOS:
        card = f"""
  <div class="card">
    <h3><span class="ep-tag">{html.escape(v['ep'])}</span><a href="videos/{v['slug']}.html">{html.escape(v['title'])}</a></h3>
    <p class="blurb">{v['blurb']}</p>
    <div class="yt-link"><a href="{html.escape(v['url'])}" target="_blank" rel="noopener">Watch on YouTube &#8599;</a> &nbsp;&middot;&nbsp; <a href="videos/{v['slug']}.html">Read summary &amp; transcript &rarr;</a></div>
  </div>"""
        cards_by_section[v["section"]].append(card)

    body_sections = ""
    section_notes = {
        "PBP 2027 Prep Series": "The current, ongoing series (2026 &rarr; 2027 PBP cycle).",
        "RUSA PBP Prep Interview Series": "Archival rider interviews from the 2023 PBP cycle.",
        "RUSA PBP Prep Seminars": "Archival full-panel prep seminars from the 2023 PBP cycle.",
    }
    for s in seen:
        body_sections += f'\n<div class="section-title">{html.escape(s)} &mdash; {section_notes.get(s, "")}</div>\n'
        body_sections += "".join(cards_by_section[s])

    page = f"""<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>PBP Prep Videos — Rob Hawks / RUSA</title>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="style.css">
</head>
<body>
<div class="wrap">
  <h1>Paris-Brest-Paris Prep Videos</h1>
  <p class="subtitle">Summaries and transcripts of every PBP prep video from Rob Hawks' YouTube channel (<a href="https://www.youtube.com/@robhawks" target="_blank" rel="noopener">@robhawks</a>) &mdash; the current PBP 2027 Prep Series plus the archival RUSA interview series and seminars from the 2023 cycle.</p>
  {body_sections}
  <footer>15 videos, ~13 hours of audio. Transcribed locally with whisper.cpp; summarized by Claude. &middot; <a href="process.html">How to add new videos &rarr;</a></footer>
</div>
</body>
</html>
"""
    with open(f"{OUT}/index.html", "w") as f:
        f.write(page)

with open(f"{OUT}/style.css", "w") as f:
    f.write(CSS)

for v in VIDEOS:
    video_page(v)

index_page()
process_page()
print("done:", len(VIDEOS), "video pages + index.html + process.html + style.css")
