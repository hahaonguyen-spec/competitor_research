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

- Project intake thu thập goal, context, audience, budget, deadline, KPI, assets và constraints.
- Mission Control tự chọn agent, chạy tuần tự và tạo project plan hoàn chỉnh.
- Tạo implementation backlog với phase, deliverable, owner, deadline và trạng thái.
- Tracking specification gồm event taxonomy, UTM dimensions, KPI và decision formulas.
- Task progress được cập nhật và lưu trong browser local storage.
- Sáu playbook: Competitor Pulse, Campaign Launch, Lead Quality Loop, Content Engine, Retention Recovery và Promotion Control.
- Lưu tối đa tám project gần nhất trong browser local storage.
- Copy kế hoạch, xuất project JSON hoặc task CSV.
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
