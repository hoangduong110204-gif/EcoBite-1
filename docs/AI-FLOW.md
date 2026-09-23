# AI Assistant — Flow & Boundaries

## Status

The AI Assistant is a **separate module** and is currently **UI + mock responses only**. No model, no network, no AI SDK.

## Module layout

| Layer      | Path                          | Contents |
|------------|-------------------------------|----------|
| Routes     | `src/app/ai/`                 | `/ai` (welcome + chat states), `/ai/history` (11.5) |
| Components | `src/components/ai/`          | `ChatBubble` (more to come) |
| Feature    | `src/features/ai/`            | `useAiChat` hook (chat state) |
| Service    | `src/services/ai/`            | `AiService` interface + `mockAiService` |
| Mock data  | `src/data/ai/`                | keyword → canned reply table (suggestions carry `reasons[]`), quick prompts, conversation history |
| Types      | `src/types/ai/`               | `AiMessage`, `AiSuggestion`, `AiRequest`, … |

## Flow (current)

1. User opens `/ai` (entry point: link from Home).
2. `useAiChat.send(text)` appends the user message and calls `aiService.sendMessage`.
3. `mockAiService` waits ~600 ms, matches keywords against `data/ai/responses.ts`, and returns an assistant message (with optional suggestions), or a fallback.

## Loose coupling rules

- The AI module **must not import** from core ordering features (`features/cart`, `payment`, `order-history`, …) or from `types/order`, `types/cart`, etc.
- Suggestions reference restaurants/food bags **by id only** (`AiSuggestion.target`). The UI layer resolves the id and navigates with the router.
- The AI module may use shared primitives: `components/common`, `constants`, `utils/async`.
- Core ordering code never depends on the AI module; removing `ai/` must not break checkout, payment, or pickup.
- AI must never place orders, take payment, or mutate orders on its own.

## Connecting a real backend later

Implement `AiService` (`services/ai/types.ts`) with a real client and change the single binding in `services/ai/index.ts`. Screens and hooks do not change. Do this only when explicitly requested.
