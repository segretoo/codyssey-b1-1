# 김문정 — Build Log (포트폴리오 웹사이트)

**미션**: B1-1 · 나를 소개하는 웹페이지 처음부터 만들기
외부 라이브러리 없이 순수 HTML/CSS/JavaScript로 만든 반응형 개인 포트폴리오입니다.

## 배포 URL
- GitHub 저장소: (배포 후 이 줄을 저장소 URL로 교체)
- GitHub Pages: (배포 후 이 줄을 배포 URL로 교체)

## 스크린샷
| Desktop | Mobile | Dark mode |
|---|---|---|
| ![desktop](./desktop.png) | ![mobile](./mobile.png) | ![dark](./dark.png) |

(스크린샷 파일 `desktop.png`, `mobile.png`, `dark.png`를 이 README와 같은 폴더에 넣으면 위 표에 자동으로 나타납니다.)

## 사용 기술
HTML5, CSS3(Flexbox, Grid, CSS 변수: 색상·폰트·간격), Vanilla JavaScript(ES6+), GitHub REST API, Intersection Observer API, EmailJS(폼 실제 전송, 보너스)
웹폰트: Gmarket Sans(제목), Pretendard(본문) — jsDelivr CDN

## 디자인 톤
블루(#2f6fea)를 메인으로, 라벤더는 히어로 배경의 파스텔 메시 그라디언트에, 민트는
"눈에 띄어야 할 곳"(이름 강조 보조, 학습 중 태그, GitHub 스타 수, 성공 메시지)에만
제한적으로 사용했습니다.

## 폴더 구조
```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── profile.svg   # 실제 사진으로 교체 가능한 플레이스홀더
└── README.md
```

## 주요 기능
- **반응형 레이아웃**: 모바일 퍼스트, 768px(태블릿) / 1024px(데스크톱) 브레이크포인트
- **다크 모드**: 첫 방문 시 `prefers-color-scheme`으로 시스템 설정을 감지하고, 이후에는 토글 상태를 `localStorage`에 저장해 새로고침 후에도 유지
- **햄버거 메뉴**: 768px 미만에서 우측 슬라이드 드로어(`classList.toggle`)로 열고 닫힘. 배경 클릭·닫기 버튼·`Esc` 키로도 닫힘
- **부드러운 스크롤**: 네비게이션 클릭 시 `scrollIntoView({ behavior: 'smooth' })`
- **스크롤 인터랙션**
  - 스크롤 60px 이상: 네비게이션 배경 전환 (`NAV_BG_THRESHOLD`, `js/main.js`에서 조정 가능)
  - 스크롤 300px 이상: 맨 위로 이동 버튼 노출 (`SCROLL_TOP_THRESHOLD`)
  - `Intersection Observer` (threshold `0.2`)로 섹션 진입 시 페이드업 애니메이션
- **GitHub API 연동**: `https://api.github.com/users/{아이디}/repos`에서 저장소 목록을 가져와 카드로 렌더링. 로딩 스피너 / 성공 카드 리스트 / 에러(재시도 버튼 포함) / 빈 상태 4가지를 모두 UI로 표현
- **폼 유효성 검사**: 이름/이메일/메시지 필수값 검증 + 이메일 형식 검증, 입력 필드 근처에 에러 메시지 표시
- **보너스 구현**
  - 프로젝트 언어별 필터링 (`array.filter()`)
  - Hero 섹션 타이핑(타자기) 효과 — 새로고침 없이 타이핑 → 대기 → 지우기 → 재시작이 반복됨
  - 시스템 다크 모드 자동 감지
  - 폼 실제 전송 (EmailJS) — 아래 "폼 실제 전송 연결하기" 참고
- **그 외 디테일**
  - Hero 배경에 별처럼 떠오르는 파티클 장식 (`prefers-reduced-motion` 감지 시 생략)
  - Skills 카드 / Projects 카드 hover 시 커서가 포인터로 바뀌는 인터랙션, Projects 카드는 전체가 클릭 영역

## 상태 관리
개별 변수 대신 `js/main.js` 상단의 `state` 객체(`state.theme`, `state.allRepos`, `state.activeLanguage`) 하나로 묶어서 관리합니다. `state` 자체는 `const`로 고정하고 내부 프로퍼티만 갱신합니다.

## 상태 → 렌더링 흐름 (요구사항 4항 대응)
1. 다크 모드 토글 → 테마 상태 변경 → `data-theme` 속성 변경 → 전체 화면 스타일 전환
2. GitHub API 호출 → 로딩/성공/에러/빈 상태 변경 → Projects 섹션 렌더링 변경
3. 폼 입력 → 유효성 상태 변경 → 에러 메시지 표시/숨김
4. (보너스) 필터 버튼 클릭 → 필터 상태 변경 → 프로젝트 목록 변경

## 로컬 실행
1. VS Code에서 이 폴더를 연다.
2. `Live Server` 확장을 설치하고 `index.html`에서 **Go Live**를 클릭한다.
3. `js/main.js` 상단의 `GITHUB_USERNAME` 값을 본인 GitHub 아이디로 확인/교체한다. (기본값: `segretoo`)

## GitHub Pages 배포
```bash
# 1) 새 저장소를 만들고 이 폴더 내용을 push
git init
git add .
git commit -m "feat: B1-1 포트폴리오 웹사이트"
git branch -M main
git remote add origin https://github.com/segretoo/<저장소이름>.git
git push -u origin main
```
2) GitHub 저장소 → **Settings → Pages** → Source를 `main` 브랜치 `/ (root)`로 설정
3) 몇 분 후 `https://segretoo.github.io/<저장소이름>/` 에서 접속 확인
4) 이 README의 "배포 URL" 항목을 실제 주소로 교체

## 참고
- `images/profile.svg`는 실제 프로필 사진이 없을 때를 위한 이니셜 아바타입니다. 실제 사진으로 교체하려면 같은 파일명(`images/profile.svg` → 예: `profile.jpg`)으로 넣고 `index.html`의 `<img src>` 경로만 바꿔주면 됩니다.
- GitHub API는 비인증 호출 시 시간당 60회 제한이 있습니다. 반복 새로고침을 피하고, 403 응답을 받으면 에러 상태 UI(재시도 버튼)가 표시됩니다.

## 폼 실제 전송 연결하기 (보너스)
`js/main.js`에 EmailJS 연동 코드가 이미 들어있습니다. 계정만 연결하면 바로 실제 이메일 전송이 됩니다.
1. [emailjs.com](https://www.emailjs.com)에서 무료 가입 후 Email Service(Gmail 등)를 연결합니다.
2. Email Template을 만듭니다. 기본 제공되는 **"Contact Us"** 템플릿을 그대로 써도 되고, 이 프로젝트 코드는 그 템플릿의 변수명(`{{name}}`, `{{email}}`, `{{title}}`, `{{message}}`)에 맞춰져 있습니다.
   - Content(본문)에 `{{message}}` 변수가 들어가 있는지 꼭 확인하세요. 기본 템플릿엔 이름/이메일만 보이고 실제 문의 내용(`{{message}}`)이 빠져 있는 경우가 있어서, 없다면 본문에 직접 추가해야 방문자가 쓴 메시지가 메일에 담깁니다.
3. `js/main.js` 상단의 `EMAILJS_PUBLIC_KEY`, `EMAILJS_SERVICE_ID`, `EMAILJS_TEMPLATE_ID` 값을 발급받은 값으로 교체합니다.
4. 값을 교체하기 전까지는 자동으로 기존 방식(화면에 성공 메시지만 표시)으로 동작하니, 계정을 연결하지 않아도 폼 자체는 정상 작동합니다.

### 연동 테스트 방법
1. 위 3단계까지 값을 다 채운 뒤 Live Server로 사이트를 엽니다.
2. Contact 폼에 실제 받을 수 있는 이메일 주소로 테스트 메시지를 입력하고 "보내기"를 누릅니다.
3. 버튼이 잠깐 "전송 중..."으로 바뀌었다가 "메시지가 전송되었습니다"로 바뀌면 API 호출 자체는 성공한 것입니다.
4. EmailJS 대시보드 좌측 메뉴의 **History**(시계 아이콘)에서 방금 보낸 요청이 찍히는지 확인합니다. 여기서 성공/실패 여부와 에러 메시지를 바로 볼 수 있어 가장 정확합니다.
5. 실제 받는 메일함(스팸함도 확인)에 도착했는지 확인합니다.
6. 만약 "전송에 실패했습니다" 메시지가 뜨면, 브라우저 개발자 도구 콘솔(F12)에 `console.error`로 실제 에러가 찍혀 있으니 그 내용을 확인하면 원인(서비스 ID/템플릿 ID/퍼블릭 키 오타 등)을 알 수 있습니다.
