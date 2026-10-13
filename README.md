# Marketing Agent Hub

Website điều phối 13 marketing agents, tích hợp với dashboard competitor intelligence hiện có.

## Agent team

1. Marketing Orchestrator
2. Competitor Intelligence
3. Audience Insight
4. Campaign Strategist
5. Paid Media Optimizer
6. CRO & Journey
7. Creative Brief
8. SEO & Content
9. Social Listening
10. Lifecycle & CRM
11. Analytics & Attribution
12. Localization QA
13. Compliance & Risk

## Website features

- Mission Control chọn agent phù hợp từ mục tiêu, thị trường, funnel và channel.
- Tạo workflow theo giai đoạn, owner, KPI và approval gate.
- Sáu playbook: Competitor Pulse, Campaign Launch, Lead Quality Loop, Content Engine, Retention Recovery và Promotion Control.
- Lưu tối đa sáu mission gần nhất trong browser local storage.
- Copy kế hoạch hoặc xuất JSON.
- Tích hợp `data/latest.json` từ competitor scanner hiện có.
- Responsive và triển khai được trực tiếp qua GitHub Pages.

## Important operating rule

Website là lớp planning và coordination. Nó không tự gửi email, xuất bản nội dung, thay đổi campaign hoặc tăng ngân sách. Những hành động này luôn cần human approval và integration/API riêng.

## Run locally

```bash
python3 -m http.server 8000
```

Mở `http://localhost:8000`.

## Existing scanner

Giữ nguyên:

- `config/sources.json`
- `scripts/scan.py`
- `data/latest.json`
- GitHub Actions scan, test và Pages deployment.

Scanner tiếp tục cập nhật dữ liệu competitor; giao diện mới đọc dữ liệu đó trong phần **Live Intelligence**.
