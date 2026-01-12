# /wrap - 세션 마무리

세션 마무리 - 문서 업데이트, 자동화 기회, 다음 할 일을 분석합니다.

## 설명

다음과 같은 상황에서 이 스킬을 사용하세요:
- "세션 정리", "마무리해줘", "오늘 끝"
- "이제 정리하자", "오늘은 여기까지"
- "커밋할거 있어", "뭐 기록해야해"
- "/wrap", "wrap up session"

## 실행 흐름

### Phase 1: 병렬 분석 (4개 에이전트)

Task 도구를 사용하여 4개 에이전트를 **동시에** 실행:

1. **doc-updater** (subagent_type: `session-wrap:doc-updater`)
   - 프롬프트: "이 세션을 분석하고 CLAUDE.md와 context.md 업데이트를 제안하세요. 대화에서 패턴, 결정, 문서화할 가치가 있는 지식을 검토하세요."

2. **automation-scout** (subagent_type: `session-wrap:automation-scout`)
   - 프롬프트: "이 세션에서 자동화 기회를 분석하세요. 반복 명령어, 다단계 워크플로우, skill/command/agent가 될 수 있는 패턴을 찾으세요."

3. **learning-extractor** (subagent_type: `session-wrap:learning-extractor`)
   - 프롬프트: "이 세션에서 배운 것을 추출하세요. TIL, 실수와 수정, 발견, 효과적인 패턴을 식별하세요."

4. **followup-suggester** (subagent_type: `session-wrap:followup-suggester`)
   - 프롬프트: "이 세션에서 후속 작업을 식별하세요. 미완성 작업, 언급된 TODO, 필요한 개선, 다음 세션 우선순위를 찾으세요."

### Phase 2: 중복 검증

Phase 1 완료 후 실행:

5. **duplicate-checker** (subagent_type: `session-wrap:duplicate-checker`)
   - 프롬프트: Phase 1 결과 전체를 포함하고 기존 CLAUDE.md 내용과 대조하여 검증 요청

### Phase 3: 사용자 선택

AskUserQuestion을 사용하여 옵션 제시:

**질문**: "세션 분석 결과로 무엇을 할까요?"

**옵션** (multiSelect: true):
1. **변경사항 커밋** - 현재 변경사항으로 커밋 생성
2. **CLAUDE.md 업데이트** - 문서 제안 적용
3. **자동화 생성** - 제안된 skill/command 생성
4. **배운 것 저장** - TIL과 발견 기록
5. **후속 작업 저장** - 다음 세션용 작업 목록 저장

## 구현

```
# Phase 1: 4개 에이전트 병렬 실행
Task(doc-updater) + Task(automation-scout) + Task(learning-extractor) + Task(followup-suggester)

# Phase 1 완료 대기

# Phase 2: duplicate-checker로 검증
Task(duplicate-checker) with Phase 1 결과

# Phase 3: 사용자에게 선택 요청
AskUserQuestion with multiSelect 옵션

# 선택된 작업 실행
```

## 출력

요약 제시:

```
## 세션 마무리 완료

### 문서 업데이트
- [CLAUDE.md에 X개 제안]

### 자동화 기회
- [Y개 잠재적 자동화 발견]

### 배운 것
- [Z개 TIL 추출]

### 후속 작업
- [다음 세션에 N개 작업]

무엇을 할까요?
```

## 주의사항

- 모든 출력은 한국어로 합니다
- Phase 1은 반드시 병렬로 실행하세요 (효율성)
- Phase 2는 Phase 1 완료 후 실행하세요 (의존성)
- 사용자 선택을 존중하세요 (강제 X)
