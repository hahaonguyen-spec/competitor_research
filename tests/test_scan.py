import importlib.util
from pathlib import Path


SCAN_PATH = Path(__file__).resolve().parents[1] / "scripts" / "scan.py"
SPEC = importlib.util.spec_from_file_location("scan", SCAN_PATH)
SCAN = importlib.util.module_from_spec(SPEC)
assert SPEC.loader
SPEC.loader.exec_module(SCAN)


def test_status_from_text_respects_ended_signal():
    assert SCAN.status_from_text("This promotion has ended", "live") == "ended"


def test_status_from_text_keeps_safe_hint():
    assert SCAN.status_from_text("Current official page", "monitor") == "monitor"


def test_score_does_not_require_invented_metrics():
    item = {"source_confidence": "official", "market": "VN", "kind": "promotion", "status": "live", "metrics": {"views": None}}
    assert SCAN.score_item(item) == 92

