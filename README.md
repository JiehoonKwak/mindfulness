# 마음챙김 (Mindfulness)

매일의 명상 습관을 위한 웹 앱.

## 구조

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend                           │
│  React 19 + Vite + Tailwind v4 + Zustand               │
│                                                         │
│  ┌─────────┐  ┌──────────┐  ┌───────────────┐         │
│  │  Timer  │  │ Visuals  │  │BreathingGuide │         │
│  │  (SVG)  │  │(10 종류) │  │ (Flower/Circle)│         │
│  └────┬────┘  └────┬─────┘  └───────┬───────┘         │
│       │            │                │                  │
│       └────────────┴────────────────┘                  │
│                    │                                   │
│              Zustand Stores                            │
│       (timer, session, settings, breathing)            │
└─────────────────────┬───────────────────────────────────┘
                      │ fetch
                      ▼
┌─────────────────────────────────────────────────────────┐
│                      Backend                            │
│            FastAPI + SQLModel + SQLite                 │
│                                                         │
│   /api/sessions ──▶ Session CRUD                       │
│   /api/health   ──▶ Health check                       │
└─────────────────────────────────────────────────────────┘
```

## 기능

| 기능 | 설명 |
|------|------|
| Timer | 3-60분 설정, SVG progress ring |
| Visuals | 10개 명상 애니메이션 (Canvas, WebGL, SVG, CSS) |
| Breathing | Apple Watch 스타일 꽃잎 애니메이션, 4개 패턴 |
| Themes | 8개 테마 (dark 5, light 3) |
| i18n | 한국어 (기본), English |
| Session | SQLite 기반 명상 기록 |

### 10개 Visuals

```
BreathingCircle  ParticleFlow   GradientWaves  Aurora (WebGL)  Mandala
CosmicDust       ZenGarden      LiquidMetal    SacredGeometry  OceanDepth
```

### 4개 호흡 패턴

```
4-7-8 Relaxing   Box (4-4-4-4)   Calming (4-0-6-0)   Energizing (6-0-2-0)
```

## 의존성

### Frontend
- **react** (19): UI 프레임워크
- **zustand**: 상태 관리
- **framer-motion**: 애니메이션
- **react-i18next**: 다국어
- **tailwindcss** (v4): 스타일링

### Backend
- **fastapi**: REST API
- **sqlmodel**: ORM (SQLAlchemy + Pydantic)
- **uvicorn**: ASGI 서버

## 사용법

### 개발 서버

```bash
# 전체 실행
./dev start

# Frontend만
./dev start fe

# Backend만
./dev start be

# 상태 확인
./dev status

# 종료
./dev stop
```

### 개별 실행

```bash
# Frontend (localhost:5173)
cd frontend && bun install && bun run dev

# Backend (localhost:8000)
cd backend && uv sync && uv run uvicorn app.main:app --reload
```

### 테스트

```bash
cd backend && uv run pytest -v
```

### 빌드

```bash
./dev build    # frontend/dist/ 생성
```

## API

```
GET    /api/health              Health check
POST   /api/sessions/           세션 생성
GET    /api/sessions/           세션 목록
GET    /api/sessions/{id}       세션 조회
PATCH  /api/sessions/{id}       세션 수정
DELETE /api/sessions/{id}       세션 삭제
```

### 예시

```bash
# 세션 생성
curl -X POST http://localhost:8000/api/sessions/ \
  -H "Content-Type: application/json" \
  -d '{"planned_duration_seconds": 600, "visual_type": "aurora"}'

# 세션 완료
curl -X PATCH http://localhost:8000/api/sessions/1 \
  -H "Content-Type: application/json" \
  -d '{"completed": true, "actual_duration_seconds": 580}'
```

## 설정

### Bell 사운드

`frontend/public/sounds/`에 MP3 파일 추가:
- `start-bell.mp3` (명상 시작)
- `end-bell.mp3` (명상 완료)

### config/config.yaml

```yaml
server:
  port: 8000
  cors_origins:
    - "http://localhost:5173"

meditation:
  presets: [3, 5, 10, 12, 15, 20, 30, 45, 60]
```

## 디렉토리

```
mindfulness/
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Timer/           # 타이머 UI
│       │   ├── Visuals/         # 10개 명상 애니메이션
│       │   └── BreathingGuide/  # 호흡 가이드
│       ├── stores/              # Zustand 상태
│       ├── hooks/               # useTimer, useAudio
│       ├── pages/               # Home, Meditate, Breathe, Settings
│       └── i18n/                # ko.json, en.json
├── backend/
│   └── app/
│       ├── routes/              # API 엔드포인트
│       └── models/              # SQLModel 스키마
├── config/config.yaml
└── dev                          # 서버 관리 스크립트
```

## 참고

- [PLAN.md](./PLAN.md) - 전체 개발 계획 (Phase 1-12)
- [HANDOFF.md](./HANDOFF.md) - 세션 인수인계 문서
