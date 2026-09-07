# 🌙 김문정 — Build Log

**미션**: B1-1 · 나를 소개하는 웹페이지 처음부터 만들기
외부 라이브러리 없이 순수 HTML/CSS/JavaScript로 완성한 반응형 개인 포트폴리오입니다.

## 개발 환경
- 에디터: VS Code + Live Server 확장
- 언어: HTML5 / CSS3 / Vanilla JavaScript (ES6+)
- 외부 라이브러리: 사용하지 않음 (`EmailJS` SDK는 보너스 "폼 실제 전송"에서만 예외적으로 사용)
- 웹폰트: Gmarket Sans(제목), Pretendard(본문) — jsDelivr CDN
- 배포: GitHub Pages
- 권장 브라우저: 최신 Chrome

## 배포 URL
- GitHub 저장소: https://github.com/segretoo/codyssey-b1-1
- 배포 사이트: https://segretoo.github.io/codyssey-b1-1/

## 스크린샷
| Desktop | Mobile | Dark mode |
|---|---|---|
| ![desktop](./desktop.png) | ![mobile](./mobile.png) | ![dark](./dark.png) |

## 프로젝트 개요
HTML/CSS/JavaScript는 브라우저가 이해하는 유일한 언어이고, React 같은 프레임워크도 결국 이 세 가지로 변환되어 동작합니다. 이 프로젝트는 그 기초를 직접 손으로 확인하기 위해, 프레임워크나 라이브러리 없이 "사용자 이벤트 → 상태 변경 → 화면 업데이트"가 이어지는 흐름을 처음부터 끝까지 구현한 반응형 포트폴리오입니다.

GitHub API를 연동해 실제 서비스에서 자주 등장하는 로딩 · 에러 · 빈 상태를 직접 처리했고, 다크 모드 · 폼 유효성 검사 · 스크롤 인터랙션까지 하나의 정적 사이트 안에서 다뤘습니다.

## 이 과제로 확인하고 싶었던 것
- HTML에서 시맨틱 태그를 왜 쓰는지, 어떤 기준으로 구조를 나눴는지
- CSS Flexbox와 Grid의 차이, 그리고 언제 각각을 선택해야 하는지
- `querySelector`로 요소를 고르고 `addEventListener`로 이벤트를 연결하는 흐름
- 화살표 함수 · 구조분해 할당 · 배열 메서드(`map`/`filter`)가 왜 필요한지
- `fetch` + `async/await`로 비동기 데이터를 가져와 로딩/성공/실패를 UI로 표현하는 방법
- "하나의 기능"을 만들 때 이벤트 → 상태 변경 → DOM 업데이트가 어떻게 연결되는지 (React 학습 전 기초 체득)

## 실행 방법
```bash
git clone https://github.com/segretoo/codyssey-b1-1.git
cd codyssey-b1-1
```
1. VS Code에서 위 폴더를 연다.
2. `Live Server` 확장을 설치하고 `index.html`에서 **Go Live**를 클릭한다.
3. `js/main.js` 상단의 `GITHUB_USERNAME` 값을 본인 GitHub 아이디로 확인/교체한다. (기본값: `segretoo`)

## 기능 목록 & 테스트 체크리스트
| 영역 | 기능 | 확인 방법 |
|---|---|---|
| Hero | 타이핑 효과, 배경 파티클 | 새로고침 없이 문장이 타이핑 → 대기 → 삭제 → 재시작을 반복하는지 확인 |
| 반응형 레이아웃 | 모바일 퍼스트, 768px(태블릿) / 1024px(데스크톱) 분기 | 브라우저 창 크기를 줄였을 때 레이아웃이 모바일에 맞게 바뀌는지 확인 |
| 다크 모드 | 토글 클릭 시 테마 전환, `localStorage` 저장, 시스템 설정 자동 감지(보너스) | 토글 클릭 → 새로고침 후에도 테마가 유지되는지 확인 |
| 햄버거 메뉴 | 768px 미만에서 우측 슬라이드 드로어로 열고 닫힘 | 모바일 너비에서 버튼 클릭 시 메뉴가 나타나고, 다시 클릭·배경 클릭·`Esc`로 닫히는지 확인 |
| 스크롤 인터랙션 | 60px↑ 네비 배경 전환, 300px↑ 맨 위로 버튼, `Intersection Observer` 등장 애니메이션 | 스크롤하면서 각 기준값에서 정상 동작하는지 확인 |
| Projects (GitHub API) | `fetch`+`async/await`로 저장소 목록 렌더링 | 새로고침 시 로딩 스피너 → 카드 리스트가 뜨는지, 데이터가 없거나 요청이 실패하면 빈 상태/에러(재시도 버튼) 메시지가 뜨는지 확인 |
| 언어 필터 (보너스) | 저장소 언어별 필터 버튼, Skills 태그와 연동 | 필터 버튼 또는 Skills의 언어 태그 클릭 시 Projects 목록이 바뀌는지 확인 |
| Contact 폼 | 필수값·이메일 형식 검증, `EmailJS` 실제 전송(보너스) | 필드를 비운 채 제출 시 에러 메시지가 즉시 뜨는지, 정상 입력 후 제출 시 성공 메시지가 뜨는지 확인 |

## 상태 관리
개별 변수 대신 `js/main.js` 상단의 `state` 객체(`state.theme`, `state.allRepos`, `state.activeLanguage`) 하나로 묶어서 관리합니다. `state` 자체는 `const`로 고정하고 내부 프로퍼티만 갱신합니다.

### 상태 → 렌더링 흐름 (요구사항 4항 대응)
1. 다크 모드 토글 → 테마 상태 변경 → `data-theme` 속성 변경 → 전체 화면 스타일 전환
2. GitHub API 호출 → 로딩/성공/에러/빈 상태 변경 → Projects 섹션 렌더링 변경
3. 폼 입력 → 유효성 상태 변경 → 에러 메시지 표시/숨김
4. (보너스) 필터 버튼 클릭 → 필터 상태 변경 → 프로젝트 목록 변경

## 폴더 구조
```
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── images/
│   └── profile.svg   # 실제 사진으로 교체 가능한 플레이스홀더
├── desktop.png / mobile.png / dark.png   # 스크린샷
└── README.md
```

## 디자인 톤
블루(`#2f6fea`)를 메인으로, 라벤더는 히어로 배경의 파스텔 메시 그라디언트에, 민트는 "눈에 띄어야 할 곳"(이름 강조 보조, 학습 중 태그, GitHub 스타 수, 성공 메시지)에만 제한적으로 사용했습니다.

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

## GitHub Pages 재배포 (참고)
```bash
git add .
git commit -m "fix: 업데이트 내용"
git push
```
`main` 브랜치에 push하면 GitHub Pages가 자동으로 다시 배포합니다. Settings → Pages에서 진행 상태를 확인할 수 있습니다.
