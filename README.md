# SEA Broker Competitor Intelligence

Dashboard theo dõi social media, promotion và marketing signals của broker tại Indonesia, Thailand, Philippines và Việt Nam.

## Dashboard logic

`Official source → Signal → CPT takeaway → Strategic bet → Business KPI`

- Promotion được gắn nhãn `live`, `ended`, `monitor` hoặc `unverified`.
- Metric social không công khai luôn giữ `N/A`.
- Tin từ nguồn thứ cấp chỉ là tín hiệu; phải đối chiếu website/T&C chính thức trước khi dùng.
- KPI business nên nối theo funnel: Lead → Qualified Lead → KYC → FTD → Active Client → Contribution Margin.

## Automatic scan schedule

GitHub Actions chạy mỗi ngày lúc **00:00, 06:00, 12:00 và 18:00 giờ Việt Nam**. Workflow dùng cron UTC `0 5,11,17,23 * * *`.

Scanner hiện hỗ trợ:

- Official websites, promotion pages and regulator pages.
- Google News RSS as a secondary early-warning feed.
- Facebook Page posts when `META_ACCESS_TOKEN` and `meta_pages` are configured.
- Safe fallback: if a source is temporarily blocked, the last verified record is retained and the error is logged.

Instagram/Facebook engagement, TikTok and private ad data require authorized platform APIs. The dashboard does not fabricate these metrics.

## Run locally

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python scripts/scan.py
python -m http.server 8000
```

Open `http://localhost:8000`.

## Add sources

Edit `config/sources.json`:

- `sources`: official HTML/PDF pages.
- `news_feeds`: RSS feeds used only as unverified market signals.
- `meta_pages`: Facebook Page IDs, brand and market; also add repository secret `META_ACCESS_TOKEN`.
- `youtube_channels`: reserved for official YouTube channel feeds.

## Data files

- `data/latest.json`: current dashboard dataset.
- `data/history/`: snapshots created before each successful refresh.

