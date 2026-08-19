#!/usr/bin/env python3
"""Deterministic scorer for the website-page-audit skill.

No dependencies beyond the stdlib — runs under any Python 3, from either
Claude Code or a Codex session, with no repo install step.

Input: a JSON file (or stdin) that is a list of
    {"category": "<name>", "raw": <0-5 int/float>, "weight": <0-100 number>}
one entry per dimension the chosen page-type profile actually lists
(see references/page-weightings.md). Weights across the list must sum to
100 — this is checked, not assumed.

Usage:
    calculate_score.py scores.json
    calculate_score.py scores.json --fail "Primary CTA does not navigate"
    calculate_score.py scores.json --check-weights   (just validates weights sum to 100, no raw scores needed)
    calculate_score.py --selftest                    (runs the built-in checks below)
    cat scores.json | calculate_score.py -
"""
from __future__ import annotations

import argparse
import json
import sys
from dataclasses import dataclass


@dataclass
class CategoryScore:
    category: str
    raw: float
    weight: float

    def __post_init__(self) -> None:
        if not (0 <= self.raw <= 5):
            raise ValueError(f"{self.category!r}: raw score {self.raw} out of range 0-5")
        if self.weight < 0:
            raise ValueError(f"{self.category!r}: weight {self.weight} cannot be negative")

    @property
    def contribution(self) -> float:
        return round((self.raw / 5) * self.weight, 2)


def load_scores(data: list[dict]) -> list[CategoryScore]:
    return [CategoryScore(d["category"], float(d["raw"]), float(d["weight"])) for d in data]


def check_weights(scores: list[CategoryScore], tolerance: float = 0.05) -> None:
    total_weight = round(sum(s.weight for s in scores), 2)
    if abs(total_weight - 100) > tolerance:
        raise SystemExit(
            f"Weights sum to {total_weight}, not 100 — fix the profile in page-weightings.md "
            f"or the JSON before scoring."
        )


def render(scores: list[CategoryScore], gate_reason: str | None) -> str:
    scores_sorted = sorted(scores, key=lambda s: s.weight, reverse=True)
    lines = ["| Category | Raw /5 | Weight | Weighted contribution |", "|---|---|---|---|"]
    total = 0.0
    for s in scores_sorted:
        lines.append(f"| {s.category} | {s.raw:g} | {s.weight:g} | {s.contribution:g} |")
        total += s.contribution
    total = round(total, 2)
    lines.append(f"| **Total** | | **100** | **{total:g}/100** |")

    status = "FAIL" if gate_reason else "PASS"
    header = [
        f"**Numeric score: {total:g}/100**",
        f"**Audit status: {status}**" + (f"  \n**Reason:** {gate_reason}" if gate_reason else ""),
        "",
    ]
    return "\n".join(header + lines)


def _selftest() -> None:
    # ponytail: one runnable check, not a test suite — enough to catch a
    # broken formula or a weight-sum regression, nothing more.
    homepage = load_scores([
        {"category": "First Impression / Wow Factor", "raw": 4, "weight": 14},
        {"category": "Navigation & User Journey", "raw": 3, "weight": 10},
        {"category": "Engagement & Interaction", "raw": 3, "weight": 10},
        {"category": "Visual Design & Polish", "raw": 4, "weight": 10},
        {"category": "Clarity & Information Hierarchy", "raw": 3, "weight": 9},
        {"category": "Conversion Effectiveness", "raw": 3, "weight": 9},
        {"category": "Trust & Credibility", "raw": 3, "weight": 8},
        {"category": "Responsive Design", "raw": 3, "weight": 7},
        {"category": "Content Quality & Persuasion", "raw": 3, "weight": 6},
        {"category": "Accessibility", "raw": 3, "weight": 6},
        {"category": "Performance & Technical Quality", "raw": 3, "weight": 6},
        {"category": "SEO & Discoverability", "raw": 3, "weight": 3},
        {"category": "Brand Consistency", "raw": 3, "weight": 2},
    ])
    check_weights(homepage)  # must not raise — profile weights sum to 100
    total = round(sum(s.contribution for s in homepage), 2)
    assert total == 64.8, f"expected 64.8, got {total}"  # script-verified: sum of (raw/5)*weight above

    # a raw score out of range must be rejected
    try:
        load_scores([{"category": "x", "raw": 6, "weight": 100}])
    except ValueError:
        pass
    else:
        raise AssertionError("expected ValueError for raw=6")

    # a bad weight sum must be rejected
    try:
        check_weights(load_scores([{"category": "x", "raw": 3, "weight": 50}]))
    except SystemExit:
        pass
    else:
        raise AssertionError("expected SystemExit for weights summing to 50")

    print("selftest OK")


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    parser.add_argument("input", nargs="?", help="path to scores JSON, or '-' for stdin")
    parser.add_argument("--fail", metavar="REASON", help="mark the audit FAIL with this critical-gate reason")
    parser.add_argument("--check-weights", action="store_true", help="only validate weights sum to 100")
    parser.add_argument("--selftest", action="store_true", help="run the built-in self-check and exit")
    args = parser.parse_args()

    if args.selftest:
        _selftest()
        return

    if not args.input:
        parser.error("input is required unless --selftest is given")

    raw_text = sys.stdin.read() if args.input == "-" else open(args.input, encoding="utf-8").read()
    scores = load_scores(json.loads(raw_text))
    check_weights(scores)

    if args.check_weights:
        print(f"Weights OK — sum to {round(sum(s.weight for s in scores), 2)}")
        return

    print(render(scores, args.fail))


if __name__ == "__main__":
    main()
