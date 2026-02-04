# 🧘 Mindfulness 웹앱 개발 계획

## 개요
iOS, Mac에서 Tailscale을 통해 접근 가능한 가벼운 명상/마음챙김 웹앱

---

## 기술 스택

| 구분 | 기술 | 비고 |
|------|------|------|
| Frontend | React + Vite | 빠른 빌드, HMR |
| Styling | Tailwind CSS | 유틸리티 우선, 반응형 쉬움 |
| Backend | Python (FastAPI) | 비동기, 자동 API 문서 |
| Database | SQLite | 단일 파일, 쿼리 용이 |
| Config | YAML | 사람이 읽기 쉬움 |

---

## 프로젝트 구조 (제안)

```
mindfulness/
├── frontend/                 # React 앱
│   ├── src/
│   │   ├── components/
│   │   │   ├── Timer/        # 명상 타이머
│   │   │   ├── Visuals/      # 아름다운 애니메이션들
│   │   │   ├── Stats/        # 통계 & Heatmap
│   │   │   └── Journal/      # 명상 후 기록
│   │   ├── hooks/
│   │   ├── pages/
│   │   └── assets/
│   │       └── sounds/       # 알림음, ambient 사운드
│   └── package.json
│
├── backend/                  # Python FastAPI
│   ├── app/
│   │   ├── main.py
│   │   ├── routes/
│   │   ├── models/
│   │   └── services/
│   │       └── discord.py    # Discord 알림
│   ├── requirements.txt
│   └── data/
│       └── mindfulness.db    # SQLite DB
│
├── config/
│   └── config.yaml           # 전체 설정
│
├── sounds/                   # 공유 사운드 파일
│   ├── bells/                # 시작/종료 벨
│   └── ambient/              # 배경 음악
│
└── scripts/
    └── generate_music.py     # AI 음악 생성 스크립트
```

---

## 핵심 기능

### 1. 명상 타이머 ⏱️
- **프리셋 시간**: 3분, 5분, 10분, 12분, 15분, 20분, 30분
- **커스텀 시간**: 사용자 설정 가능
- **시작/종료 알림음**: 다양한 벨 소리 선택
  - 티베트 싱잉볼
  - 부드러운 종
  - 자연 소리 (새, 물)
  - 커스텀 업로드

### 2. 아름다운 비주얼 🎨
명상 중 표시되는 시각적 요소 (Apple Watch 스타일)

| 비주얼 | 설명 |
|--------|------|
| Breathing Circle | 숨쉬기에 맞춰 확대/축소되는 원 |
| Particle Flow | 부드럽게 흐르는 파티클 |
| Gradient Waves | 그라데이션 물결 |
| Aurora | 오로라 효과 |
| Mandala | 회전하는 만다라 패턴 |
| Minimalist | 단순한 진행 표시 |

### 3. 배경 음악/사운드 🎵
- **Ambient 사운드**
  - 빗소리, 파도, 숲속, 모닥불
  - 백색/갈색/핑크 노이즈
- **AI 생성 음악** (Gemini API)
  - 명상에 적합한 ambient 음악 생성
  - 다양한 무드 선택 가능
- **볼륨 조절**: 개별 + 마스터

### 4. 기록 & 저널 📝
명상 완료 후 기록:
- 날짜 & 시간 (자동)
- 명상 길이 (자동)
- 기분 (이모지 선택)
- 메모 (선택적 텍스트)
- 사용한 비주얼/사운드 (자동)

### 5. 통계 & 시각화 📊
- **Heatmap**: GitHub 스타일 연간 활동
- **주간/월간 차트**: 명상 시간 추이
- **스트릭**: 연속 명상 일수
- **총 통계**: 총 세션, 총 시간, 평균 시간
- **시간대 분석**: 주로 명상하는 시간

### 6. Discord 알림 🔔
- 명상 완료 시 알림
- 일일/주간 요약
- 스트릭 달성 축하
- 리마인더 (선택적)

---

## config.yaml 예시

```yaml
# Server Configuration
server:
  host: "0.0.0.0"
  port: 8000
  debug: false

# Database
database:
  path: "./backend/data/mindfulness.db"

# Timer Presets (minutes)
timer:
  presets: [3, 5, 10, 12, 15, 20, 30]
  default: 10

# Notifications
discord:
  enabled: true
  webhook_url: "YOUR_DISCORD_WEBHOOK_URL"
  notify_on:
    session_complete: true
    streak_milestone: true
    daily_summary: false
    weekly_summary: true

# AI Music Generation
music_generation:
  provider: "gemini"
  api_key: "YOUR_GEMINI_API_KEY"
  output_dir: "./sounds/generated"

# Visuals
visuals:
  default: "breathing_circle"
  available:
    - breathing_circle
    - particle_flow
    - gradient_waves
    - aurora
    - mandala
    - minimalist

# Sounds
sounds:
  bells_dir: "./sounds/bells"
  ambient_dir: "./sounds/ambient"
  default_bell: "singing_bowl"
  default_ambient: "rain"
```

---

## 데이터베이스 스키마

```sql
-- 명상 세션 기록
CREATE TABLE sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    started_at DATETIME NOT NULL,
    ended_at DATETIME,
    duration_seconds INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,

    -- 설정
    visual_type TEXT,
    bell_sound TEXT,
    ambient_sound TEXT,
    ambient_volume REAL,

    -- 기록
    mood TEXT,  -- emoji
    note TEXT,

    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 일일 통계 (캐시용)
CREATE TABLE daily_stats (
    date DATE PRIMARY KEY,
    total_sessions INTEGER DEFAULT 0,
    total_seconds INTEGER DEFAULT 0,
    streak_count INTEGER DEFAULT 0
);

-- 설정 저장
CREATE TABLE user_settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

---

## API 엔드포인트

```
# 세션
POST   /api/sessions              # 세션 시작
PATCH  /api/sessions/{id}         # 세션 업데이트 (완료, 메모 추가)
GET    /api/sessions              # 세션 목록 (필터링, 페이지네이션)
GET    /api/sessions/{id}         # 세션 상세

# 통계
GET    /api/stats/summary         # 전체 요약
GET    /api/stats/heatmap         # 히트맵 데이터
GET    /api/stats/chart           # 차트 데이터 (주간/월간)
GET    /api/stats/streak          # 스트릭 정보

# 설정
GET    /api/settings              # 설정 조회
PUT    /api/settings              # 설정 업데이트

# 사운드
GET    /api/sounds/bells          # 벨 소리 목록
GET    /api/sounds/ambient        # Ambient 소리 목록
POST   /api/sounds/generate       # AI 음악 생성 요청

# 헬스체크
GET    /api/health                # 서버 상태
```

---

## 개발 단계 (Phase)

### Phase 1: 기본 기능 ✅
- [ ] 프로젝트 셋업 (React + FastAPI)
- [ ] 기본 타이머 구현
- [ ] 시작/종료 벨 소리
- [ ] 세션 기록 저장
- [ ] 기본 UI

### Phase 2: 비주얼 & 사운드 🎨
- [ ] 명상 비주얼 구현 (최소 3개)
- [ ] Ambient 사운드 추가
- [ ] 사운드 믹싱 (벨 + ambient)
- [ ] 비주얼/사운드 선택 UI

### Phase 3: 통계 & 기록 📊
- [ ] 명상 후 기록 UI (기분, 메모)
- [ ] Heatmap 구현
- [ ] 차트 (주간/월간)
- [ ] 스트릭 계산 및 표시

### Phase 4: 알림 & 연동 🔔
- [ ] Discord 웹훅 연동
- [ ] 알림 설정 UI
- [ ] PWA 설정 (iOS 홈 화면 추가용)

### Phase 5: AI 음악 생성 🎵
- [ ] Gemini API 연동
- [ ] 음악 생성 UI
- [ ] 생성된 음악 관리

### Phase 6: 마무리 ✨
- [ ] 모바일 반응형 최적화
- [ ] 다크/라이트 모드
- [ ] 성능 최적화
- [ ] 배포 스크립트

---

## 논의 필요 사항 ❓

1. **비주얼 우선순위**: 어떤 비주얼을 먼저 구현할까요?
2. **Ambient 사운드**: 어떤 소리들을 우선 추가할까요?
3. **Discord 알림 내용**: 어떤 정보를 포함할까요?
4. **다국어 지원**: 한국어만? 영어도?
5. **백업 방식**: 자동 백업이 필요할까요?

---

## 참고 자료

- [FastAPI 문서](https://fastapi.tiangolo.com/)
- [React 문서](https://react.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Gemini API](https://ai.google.dev/)
- [Discord Webhooks](https://discord.com/developers/docs/resources/webhook)
