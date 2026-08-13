#!/usr/bin/env python3
"""Refresh SEA broker marketing signals without inventing private social metrics."""

from __future__ import annotations

import hashlib
import html
import json
import os
import re
import sys
from datetime import datetime, timedelta, timezone
from email.utils import parsedate_to_datetime
from pathlib import Path
from typing import Any
from urllib.parse import quote

import feedparser
import requests
from bs4 import BeautifulSoup


ROOT = Path(__file__).resolve().parents[1]
CONFIG_PATH = ROOT / "config" / "sources.json"
DATA_PATH = ROOT / "data" / "latest.json"
HISTORY_DIR = ROOT / "data" / "history"
USER_AGENT = "CPT-SEA-Market-Intelligence/1.0 (+https://github.com/hahaonguyen-spec/competitor_research)"
TIMEZONE_VN = timezone(timedelta(hours=7))


def now_vn() -> datetime:
    return datetime.now(TIMEZONE_VN)


def load_json(path: Path, fallback: Any) -> Any:
    if not path.exists():
        return fallback
    return json.loads(path.read_text(encoding="utf-8"))


def normalize_text(value: str) -> str:
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def content_hash(value: str) -> str:
    return hashlib.sha256(normalize_text(value)[:100_000].encode("utf-8")).hexdigest()


def status_from_text(text: str, hint: str) -> str:
    lowered = text.lower()
    ended_terms = ("promotion has ended", "contest has ended", "registration closed", "đã kết thúc", "สิ้นสุดแล้ว")
    if any(term in lowered for term in ended_terms):
        return "ended"
    return hint if hint in {"live", "ended", "monitor"} else "unverified"


def score_item(item: dict[str, Any]) -> int:
    score = 35
    if item.get("source_confidence") == "official":
        score += 25
    if item.get("market") in {"ID", "TH", "PH", "VN"}:
        score += 10
    if item.get("kind") in {"promotion", "social_campaign"}:
        score += 12
    if item.get("status") == "live":
        score += 10
    if any(item.get("metrics", {}).get(key) is not None for key in ("views", "reactions", "comments", "shares")):
        score += 8
    return min(score, 100)


def scan_page(source: dict[str, Any], previous: dict[str, Any] | None, observed_at: str) -> tuple[dict[str, Any], bool]:
    response = requests.get(source["url"], timeout=30, headers={"User-Agent": USER_AGENT})
    response.raise_for_status()
    content_type = response.headers.get("content-type", "")
    if "pdf" in content_type or source["url"].lower().endswith(".pdf"):
        page_text = response.content[:200_000].decode("latin-1", errors="ignore")
        title = source.get("summary", source["id"])
    else:
        soup = BeautifulSoup(response.text, "html.parser")
        for tag in soup(["script", "style", "noscript"]):
            tag.decompose()
        title = normalize_text(soup.title.get_text(" ") if soup.title else source["id"])
        page_text = normalize_text(soup.get_text(" "))

    digest = content_hash(page_text)
    prior_hash = (previous or {}).get("content_hash")
    changed = bool(prior_hash and prior_hash != digest)
    item = {
        "id": source["id"],
        "brand": source["brand"],
        "market": source["market"],
        "kind": source["kind"],
        "platform": source["platform"],
        "title": title[:160],
        "url": source["url"],
        "observed_at": observed_at,
        "status": status_from_text(page_text, source.get("status_hint", "unverified")),
        "source_confidence": "official",
        "funnel_stage": source.get("funnel_stage", "Monitor"),
        "summary": source.get("summary", ""),
        "takeaway": source.get("takeaway", ""),
        "metrics": (previous or {}).get("metrics", {"views": None, "reactions": None, "comments": None, "shares": None}),
        "content_hash": digest,
        "changed": changed,
        "http_status": response.status_code,
    }
    item["signal_score"] = score_item(item)
    return item, changed


def parse_feed_date(entry: Any) -> datetime | None:
    raw = entry.get("published") or entry.get("updated")
    if not raw:
        return None
    try:
        return parsedate_to_datetime(raw).astimezone(TIMEZONE_VN)
    except (TypeError, ValueError):
        return None


def scan_news(feed: dict[str, Any], observed_at: str) -> list[dict[str, Any]]:
    parsed = feedparser.parse(feed["url"], agent=USER_AGENT)
    cutoff = now_vn() - timedelta(days=14)
    results: list[dict[str, Any]] = []
    for entry in parsed.entries[:12]:
        published = parse_feed_date(entry)
        if published and published < cutoff:
            continue
        url = entry.get("link", "")
        title = normalize_text(entry.get("title", "Untitled signal"))
        item_id = "news-" + hashlib.sha1(url.encode("utf-8")).hexdigest()[:12]
        item = {
            "id": item_id,
            "brand": "Industry signal",
            "market": feed["market"],
            "kind": "news_signal",
            "platform": "News RSS",
            "title": title[:160],
            "url": url,
            "observed_at": observed_at,
            "published_at": published.isoformat() if published else None,
            "status": "unverified",
            "source_confidence": "secondary",
            "funnel_stage": "Market monitoring",
            "summary": "Secondary-source signal. Open and validate against the broker's official page before using it in a decision.",
            "takeaway": "Verify official entity, market eligibility and terms before classifying the campaign.",
            "metrics": {"views": None, "reactions": None, "comments": None, "shares": None},
        }
        item["signal_score"] = score_item(item)
        results.append(item)
    return results


def scan_meta_pages(config: dict[str, Any], observed_at: str) -> list[dict[str, Any]]:
    token = os.getenv("META_ACCESS_TOKEN")
    pages = config.get("meta_pages", [])
    if not token or not pages:
        return []
    results: list[dict[str, Any]] = []
    for page in pages:
        fields = quote("id,message,created_time,permalink_url,shares")
        url = f"https://graph.facebook.com/v23.0/{page['page_id']}/posts?fields={fields}&limit=10&access_token={token}"
        response = requests.get(url, timeout=30, headers={"User-Agent": USER_AGENT})
        response.raise_for_status()
        for post in response.json().get("data", []):
            post_url = post.get("permalink_url", "")
            item = {
                "id": f"meta-{post.get('id')}", "brand": page["brand"], "market": page["market"],
                "kind": "social_post", "platform": "Facebook", "title": normalize_text(post.get("message", "Facebook post"))[:160],
                "url": post_url, "observed_at": observed_at, "published_at": post.get("created_time"), "status": "monitor",
                "source_confidence": "official_social", "funnel_stage": "Social", "summary": normalize_text(post.get("message", ""))[:320],
                "takeaway": "Review hook, CTA and comments before adapting the concept.",
                "metrics": {"views": None, "reactions": None, "comments": None, "shares": (post.get("shares") or {}).get("count")},
            }
            item["signal_score"] = score_item(item)
            results.append(item)
    return results


def main() -> int:
    config = load_json(CONFIG_PATH, {})
    previous_payload = load_json(DATA_PATH, {"items": [], "strategies": []})
    previous = {item["id"]: item for item in previous_payload.get("items", [])}
    observed_at = now_vn().replace(microsecond=0).isoformat()
    official_items: list[dict[str, Any]] = []
    failures: list[dict[str, str]] = []
    changed_count = 0

    for source in config.get("sources", []):
        try:
            item, changed = scan_page(source, previous.get(source["id"]), observed_at)
            official_items.append(item)
            changed_count += int(changed)
        except Exception as exc:  # keep the last verified record when a source is temporarily blocked
            failures.append({"id": source["id"], "error": str(exc)[:240]})
            if source["id"] in previous:
                fallback = dict(previous[source["id"]])
                fallback["last_error"] = str(exc)[:240]
                fallback["observed_at"] = observed_at
                official_items.append(fallback)

    news_items: list[dict[str, Any]] = []
    for feed in config.get("news_feeds", []):
        try:
            news_items.extend(scan_news(feed, observed_at))
        except Exception as exc:
            failures.append({"id": feed["id"], "error": str(exc)[:240]})

    try:
        social_items = scan_meta_pages(config, observed_at)
    except Exception as exc:
        social_items = []
        failures.append({"id": "meta_pages", "error": str(exc)[:240]})

    deduped: dict[str, dict[str, Any]] = {}
    for item in official_items + social_items + news_items:
        deduped[item["id"]] = item
    items = sorted(deduped.values(), key=lambda item: (item.get("signal_score", 0), item.get("published_at") or item["observed_at"]), reverse=True)

    payload = {
        "generated_at": observed_at,
        "timezone": config.get("timezone", "Asia/Ho_Chi_Minh"),
        "scan_health": {
            "sources_total": len(config.get("sources", [])) + len(config.get("news_feeds", [])),
            "sources_ok": len(config.get("sources", [])) + len(config.get("news_feeds", [])) - len(failures),
            "sources_failed": len(failures),
            "changed_sources": changed_count,
            "new_signals": len([item for item in items if item["id"] not in previous]),
            "failures": failures,
        },
        "items": items,
        "strategies": previous_payload.get("strategies", []),
    }

    HISTORY_DIR.mkdir(parents=True, exist_ok=True)
    if DATA_PATH.exists():
        history_name = now_vn().strftime("%Y%m%d-%H%M%S.json")
        (HISTORY_DIR / history_name).write_text(DATA_PATH.read_text(encoding="utf-8"), encoding="utf-8")
    DATA_PATH.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps(payload["scan_health"], ensure_ascii=False))
    return 0 if official_items else 1


if __name__ == "__main__":
    sys.exit(main())

