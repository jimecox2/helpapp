#!/usr/bin/env python3
"""
Build the three Complete Reference Guides from the Common and Product help files.

The recipes are RECIPES below. Run this from the helpapp repo root rather than
assembling a complete guide by hand:

    python3 tools/buildCompleteGuides.py

It writes the three *_Complete_Reference_Guide.md files into public/docsHelp/. Then
`node tools/makeCompleteGuidePdfs.mjs` turns them into the PDFs in public/pdf/ (the form
/help offers for download).

Every source guide is included verbatim, with four mechanical adjustments:

  1. Its logo banner is dropped - the compiled guide carries one at the top.
  2. Its headings are demoted one level, so the part title is the only H1 in
     that part and the compiled contents list nests correctly.
  3. The User Interface Guide's opening chapter, "Why These Products Work the
     Way They Do", is removed. It is positioning and sales material; the TOC
     records this exclusion.
  4. Links to other guides and images are made absolute on the help site
     (HELP_URL, default https://help.timebars.com), because the compiled guide is
     read as a PDF, away from the site. A link to another guide goes to its
     /help page; a link inside the compiled guide would need its part anchor.

Agilebars omits Text Notifications and the Supply and Demand Grids - the
product uses neither.
"""

import os
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "public" / "docsHelp"

LOGO = "![Timebars Logo](/images/help/logos/timebars-ltd-logo-final.png)"

# The help site the PDF links point at. Set HELP_URL to build for another host.
HELP_URL = os.environ.get("HELP_URL", "https://help.timebars.com").rstrip("/")

# Version of the compiled guides themselves, not of any source guide. Bump this and
# add a CHANGELOG entry whenever a rebuild carries a change worth telling a reader
# about; the newest entry is rendered under the contents list of all three guides.
VERSION = "1.4"
UPDATED = "2026-10-21"

# (version, date, [bullets]) - newest first. "{cloud}" in a bullet is replaced with
# the Cloud Publishing part number, which differs between Agilebars and TB/CB.
CHANGELOG = [
    ("1.4", "2026-10-21", [
        "The help guides moved to the Timebars Help Library. Every link to another guide, "
        "and every image, now points at `help.timebars.com` instead of the old help "
        "articles on www.timebars.com, and images that did not show in 1.3 (the Supply "
        "and Demand grids) are fixed.",
    ]),
    ("1.3", "2026-09-26", [
        "**Part {cloud} — Cloud Publishing** rebuilt from Cloud Publishing and Bulk "
        "Operations Guide v2.3. License limits (bars, projects, cloud pubsets) now come "
        "from the purchased product and are downloaded at login; bars count every row "
        "below the Project level. Tier-1 licenses have no pubsets, so the Publish icons "
        "are hidden. The OpenProject tab is Tier-3 only. Pubsets are created "
        "automatically on cloud login and topped up to the license after an upgrade "
        "(the Activate button is gone). Show License lists every limit.",
        "New \"Who You Are Working As\" in Bulk Update: an **Administrator** (resource "
        "pool Primary Role) loads every pubset for their Customer ID on the Bulk Update "
        "and Re-Publish tabs, so one person can update and re-publish for the whole "
        "customer.",
    ]),
    ("1.2", "2026-09-10", [
        "**Part {cloud} — Cloud Publishing** rebuilt from Cloud Publishing and Bulk "
        "Operations Guide v2.2. New section 11.5, \"Two things that travel outside the "
        "mapping\": the OpenProject project **description** and project **status** are "
        "built-ins rather than custom fields, so the Schema sheet cannot describe them and "
        "the sync now writes both itself — the description from `tbMDDescription`, the "
        "status from the project's Health (`tbMDHealth`) through a fixed seven-row table. "
        "Both are in addition to the custom fields those values already travel to, and "
        "neither needs a workbook change. Work packages are unaffected.",
        "One row added to the Cloud Publishing troubleshooting table, for a project status "
        "in OpenProject that does not look like the Timebar Status.",
    ]),
    ("1.1", "2026-09-10", [
        "**Part {cloud} — Cloud Publishing** rebuilt from Cloud Publishing and Bulk "
        "Operations Guide v2.1. Section 11, OpenProject Sync, was four lines and is now "
        "the full picture: the Timebars level to OpenProject type mapping (and why an "
        "OpenProject \"work package\" is a Timebars L3 Sub-Project), pointing the app at "
        "an instance through the `apOpUrl` setting and Test Connection, the four sync "
        "scenarios A1/A2/B1/B2 and the sync master that decides which of them may run, "
        "the five OpenProject Integration buttons and the CSV each one downloads, where "
        "the field mapping lives across the Schema and Tags sheets, and a checklist for "
        "a field that will not sync.",
        "Six OpenProject rows added to the Cloud Publishing troubleshooting table.",
        "The old A1–A4 / B1–B4 scenario list is gone — there is no separate bulk-create "
        "step, because A2 and B2 create what is missing as part of the update.",
        "Part 4 caught up with the Data Synchronization guide: Bulk Update can now push "
        "**tbSchema** (Complete Replacement and Row-Level Patch only), and a pubset "
        "carries fifteen stores rather than thirteen.",
    ]),
    ("1.0", "2026-09-04", [
        "First compiled build of the three Complete Reference Guides, assembled from "
        "the product and common help files per the recipes in `docsHelp/a1 TOC`.",
    ]),
]

# Shared spine, in reading order: orientation, then the model, then the work.
COMMON = [
    ("Common_02_User_Interface_Guide.md", "The User Interface"),
    ("Common_03_Data_Model_and_Scheduling_Engine_Guide.md", "Data Model and Scheduling Engine"),
    ("Common_04_Data_Synchronization_Backup_Recovery_And_Retention_User_Guide.md",
     "Data Synchronization, Backup, Recovery and Retention"),
    ("Common_05_Forms_Reports_And_Graphs_Guide.md", "Forms, Reports and Graphs"),
    ("Common_05_Risks_Issues_Change_Requests_User_Guide.md", "Risks, Issues and Change Requests"),
    ("Common_06_How_To_Use_Ask_AI.md", "How to Use Ask AI"),
]

# TB/CB only - Agilebars uses neither.
TB_CB_ONLY = [
    ("Common_11_Supply_And_Demand_Grids_User_Guide.md", "Supply and Demand Grids"),
    ("Common_10_Text_Notifications_User_Guide.md", "Text Notifications"),
]

CLOUD = [
    ("Common_07_Cloud_Publishing_Guide.md", "Cloud Publishing"),
    ("Common_08_Personal_Dashboard_Guide.md", "The Personal Dashboard"),
    ("Common_09_Enterprise_Dashboard_Guide.md", "The Enterprise Dashboard"),
]

RECIPES = {
    "Agilebars": {
        "out": "Agilebars_Complete_Reference_Guide.md",
        "product": ("Agilebars_User_Guide.md", "The Agilebars Product"),
        "parts": COMMON + CLOUD,
        "note": (
            "Agilebars does not use the Supply and Demand Grids or Text Notifications, "
            "so neither is included here. Both are covered in the Timebars and Costbars guides."
        ),
    },
    "Timebars": {
        "out": "Timebars_Complete_Reference_Guide.md",
        "product": ("Timebars_User_Guide.md", "The Timebars Product"),
        "parts": COMMON + TB_CB_ONLY + CLOUD,
        "note": "",
    },
    "Costbars": {
        "out": "Costbars_Complete_Reference_Guide.md",
        "product": ("Costbars_User_Guide.md", "The Costbars Product"),
        "parts": COMMON + TB_CB_ONLY + CLOUD,
        "note": "",
    },
}

# The UI guide chapter that is positioning material rather than product help.
UI_GUIDE = "Common_02_User_Interface_Guide.md"
UI_DROP_HEADING = "## Why These Products Work the Way They Do"


def strip_ui_opening_chapter(text: str) -> str:
    """Remove the UI guide's positioning chapter, up to the next H2."""
    start = text.find(UI_DROP_HEADING)
    if start == -1:
        print(f"  ! '{UI_DROP_HEADING}' not found - nothing removed", file=sys.stderr)
        return text
    nxt = re.search(r"^## (?!Why These Products)", text[start + 1:], re.M)
    if not nxt:
        print("  ! no heading follows the opening chapter - nothing removed", file=sys.stderr)
        return text
    return text[:start] + text[start + 1 + nxt.start():]


def demote_headings(text: str) -> str:
    """Add one # to every ATX heading, leaving fenced code blocks alone."""
    out, in_fence = [], False
    for line in text.split("\n"):
        if line.lstrip().startswith("```"):
            in_fence = not in_fence
        elif not in_fence and re.match(r"^#{1,5} ", line):
            line = "#" + line
        out.append(line)
    return "\n".join(out)


def prepare(filename: str) -> str:
    path = DOCS / filename
    if not path.exists():
        raise SystemExit(f"missing source guide: {path}")
    text = path.read_text(encoding="utf-8")
    text = text.replace(LOGO, "").lstrip("\n")
    if text.startswith("---\n"):
        text = text[4:].lstrip("\n")
    if filename == UI_GUIDE:
        text = strip_ui_opening_chapter(text)
    return demote_headings(text).strip()


def slug(heading: str) -> str:
    """GitHub's heading-anchor algorithm.

    Note it does NOT collapse runs of whitespace: "Part 1 — Title" loses the
    em-dash but keeps both surrounding spaces, so each becomes a hyphen and the
    anchor is "part-1--title" with TWO hyphens. Collapsing them here produces
    links that silently do not resolve on GitHub.
    """
    h = re.sub(r"[`*]", "", heading).lower()
    h = re.sub(r"[^\w\s-]", "", h)
    return h.strip().replace(" ", "-")


GUIDE_LINK = re.compile(r"\]\(([A-Za-z0-9_]+)\.md(#[^)]*)?\)")
SITE_LINK = re.compile(r"\]\((/(?:images|pdf|spreadsheets)/[^)]*)\)")


def absolute_links(text: str) -> str:
    """Guide links -> HELP_URL/<slug>#anchor, site files -> HELP_URL/<path>."""
    text = GUIDE_LINK.sub(
        lambda m: f"]({HELP_URL}/{m.group(1).replace('_', '-').lower()}{m.group(2) or ''})", text)
    return SITE_LINK.sub(lambda m: f"]({HELP_URL}{m.group(1)})", text)


def changelog_block(cloud_part: int) -> str:
    """The newest CHANGELOG entry in full, older ones as a one-line history."""
    version, date, bullets = CHANGELOG[0]
    lines = [f"## What changed in version {version} ({date})", ""]
    lines += [f"- {b.format(cloud=cloud_part)}" for b in bullets]
    if len(CHANGELOG) > 1:
        history = ", ".join(f"{v} ({d})" for v, d, _ in CHANGELOG[1:])
        lines += ["", f"Earlier versions: {history}."]
    return "\n".join(lines)


def build(product: str, recipe: dict) -> str:
    parts = [recipe["product"]] + recipe["parts"]

    chunks, toc = [], []
    cloud_part = 0
    for n, (filename, title) in enumerate(parts, start=1):
        heading = f"Part {n} — {title}"
        toc.append(f"{n}. [{title}](#{slug(heading)})")
        chunks.append(f"# {heading}\n\n{prepare(filename)}")
        if filename == CLOUD[0][0]:
            cloud_part = n

    note = f"\n> {recipe['note']}\n" if recipe["note"] else ""

    header = f"""{LOGO}
---

# {product} — Complete Reference Guide

**Version**: {VERSION}\\
**Last Updated**: {UPDATED}

Every help topic for **{product}**, compiled into one document: the product guide,
followed by the guides shared across Agilebars, Timebars and Costbars.

This file is **generated** from the individual guides in `public/docsHelp` of the helpapp
repo by `tools/buildCompleteGuides.py`. Edit those guides and rebuild — changes made here are
lost on the next run.
{note}
> **About the cross-references.** Each part keeps the links it had as a standalone
> guide, so a reference to another guide points at its page on the help site. In
> this document, that guide is one of the parts listed below.

## Contents

{chr(10).join(toc)}

---

{changelog_block(cloud_part)}

---

"""
    return absolute_links(header + "\n\n---\n\n".join(chunks) + "\n")


def main() -> None:
    for product, recipe in RECIPES.items():
        out = DOCS / recipe["out"]
        text = build(product, recipe)
        out.write_text(text, encoding="utf-8")
        print(f"{recipe['out']}: {len(text.splitlines())} lines, "
              f"{len(recipe['parts']) + 1} parts")


if __name__ == "__main__":
    main()
