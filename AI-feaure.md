# TradeMind AI Trade Suggestion Chatbot

## MVP-to-Production Build Plan

### Objective

Integrate a modern AI Trade Suggestion Chatbot into TradeMind that analyzes user prompts plus market data and returns structured trade ideas with transparent reasoning, risk parameters, and confidence.

---

# 1. Product Definition

## What the feature is

An authenticated in-app AI assistant that helps traders:

* analyze a symbol or market
* receive structured trade suggestions
* understand why a setup is valid
* save suggestion history
* connect suggestions back to their trading journal

## Core output

For a symbol like EURUSD, BTCUSD, XAUUSD, or NAS100, the system should return:

* signal: BUY / SELL / WAIT
* reasoning
* entry zone
* stop loss
* take profit targets
* risk-to-reward ratio
* win probability estimate
* best-fit strategy
* confidence score
* risk warning and market summary

---

# 2. MVP Scope

## MVP includes

* protected AI assistant page in TradeMind
* responsive modern chat UI
* suggested prompts
* chat history per user
* FastAPI endpoints for analysis and chat history
* market analysis engine using indicator logic and optionally mocked/provider-fed OHLC data
* structured JSON response from backend
* journal CTA: “Did you take this trade?”
* daily signals endpoint

## Phase 2 / Advanced

* news sentiment summary
* market regime detection
* performance tracking of prior suggestions
* learn mode explanations
* streaming responses
* provider-backed live data
* hybrid AI + quant reasoning
* recommendation feedback loop

---

# 3. Recommended Architecture

## Frontend

* Next.js App Router
* TypeScript
* Tailwind CSS
* shadcn/ui
* React Query for API state
* Zustand or Context for chat session state if needed
* Framer Motion for typing / panel animation

## Backend

* FastAPI
* Pydantic schemas
* SQLAlchemy ORM
* PostgreSQL
* service-oriented architecture

## AI / Quant Layer

MVP should use a **hybrid rules engine**:

1. fetch or simulate market data
2. compute indicators
3. classify trend/regime
4. match current conditions to strategy templates
5. generate structured signal JSON
6. optionally pass result through an LLM for explanation formatting

## Why this design

Do not make the first version entirely LLM-driven.
The best MVP is:

* cheaper to run
* easier to test
* more transparent
* safer for financial suggestions
* easier to validate against historical logic

---

# 4. High-Level Flow

1. User opens AI Assistant page
2. User enters prompt like “Analyze EURUSD”
3. Frontend sends request to `/chat/analyze`
4. Backend parses symbol + intent
5. Backend fetches or simulates OHLC + volume + news metadata
6. Quant engine computes indicators:

   * RSI
   * MACD
   * EMA/SMA
   * ATR
   * support/resistance
   * volatility
7. Strategy matcher scores candidate setups
8. Best setup is returned as structured response
9. Response is saved to chat history
10. Frontend renders AI bubble + structured signal card
11. User can save to journal or mark as taken

---

# 5. Folder Structure

```text
Trade-Mind/
  apps/
    web/
      app/
        (auth)/
        ai-assistant/
          page.tsx
        api/
          auth/
            clear/route.ts
            store/route.ts
      components/
        ai/
          ai-chat-shell.tsx
          ai-message-bubble.tsx
          ai-signal-card.tsx
          ai-typing-indicator.tsx
          ai-suggested-prompts.tsx
          ai-news-summary.tsx
          ai-history-panel.tsx
        layout/
        ui/
      lib/
        api.ts
        ai-types.ts
        auth.ts
      hooks/
        use-chat-scroll.ts
        use-ai-chat.ts
    api/
      app/
        api/
          routes/
            chat.py
            signals.py
            news.py
            history.py
        core/
          config.py
          security.py
        db/
          session.py
        models/
          user.py
          trade.py
          ai_chat.py
          ai_message.py
          ai_signal.py
          ai_usage.py
        schemas/
          chat.py
          signal.py
          market.py
          news.py
        services/
          ai_chat_service.py
          market_data_service.py
          indicator_service.py
          strategy_engine.py
          signal_service.py
          news_service.py
          history_service.py
        utils/
          prompt_parser.py
          market_math.py
          symbol_map.py
          timeframes.py
        tests/
          test_signal_service.py
          test_indicator_service.py
          test_chat_routes.py
  docs/
    ai-assistant-architecture.md
    deployment.md
```

---

# 6. Database Schema

## `ai_chats`

Represents a chat thread.

Fields:

* id
* user_id
* title
* symbol
* created_at
* updated_at

## `ai_messages`

Stores messages in a thread.

Fields:

* id
* chat_id
* role (`user`, `assistant`, `system`)
* content
* structured_payload (JSON)
* created_at

## `ai_signals`

Stores generated signal outputs.

Fields:

* id
* user_id
* chat_id
* symbol
* timeframe
* signal
* reason
* entry_zone_low
* entry_zone_high
* stop_loss
* take_profit_1
* take_profit_2
* take_profit_3
* risk_reward
* win_probability
* strategy
* confidence_score
* market_regime
* volatility_score
* status (`new`, `taken`, `missed`, `invalidated`, `closed`)
* created_at

## `ai_usage`

Tracks feature usage by user.

Fields:

* id
* user_id
* request_type
* symbol
* prompt
* tokens_used_optional
* response_time_ms
* created_at

## Journal integration enhancement

Add optional field to `trades`:

* source_signal_id nullable FK to `ai_signals.id`

This lets you measure whether AI suggestions were acted on and how they performed.

---

# 7. API Design

## POST `/chat/analyze`

Creates a structured analysis response from a user message.

### Request

```json
{
  "message": "Analyze EURUSD",
  "timeframe": "1H"
}
```

### Response

```json
{
  "chat_id": 12,
  "message_id": 88,
  "signal": {
    "pair": "EURUSD",
    "signal": "BUY",
    "reason": "Strong uptrend + RSI recovery + breakout confirmed",
    "entry_zone": "1.0840 - 1.0850",
    "stop_loss": "1.0815",
    "take_profit": ["1.0880", "1.0910"],
    "risk_reward": "1:2.5",
    "win_probability": "78%",
    "strategy": "Breakout Retest",
    "confidence": "High",
    "risk_warning": "News volatility may invalidate setup near NY session open"
  }
}
```

## GET `/signals/today`

Returns daily top signals.

## GET `/history/user`

Returns AI chat/signal history for the logged-in user.

## GET `/market/news`

Returns a concise news + sentiment summary for supported instruments.

## Optional future routes

* POST `/chat/feedback`
* PATCH `/signals/{id}/status`
* GET `/signals/performance`
* POST `/chat/explain`

---

# 8. Backend Schemas

## `schemas/chat.py`

```python
from pydantic import BaseModel, Field
from typing import Optional

class AnalyzeChatRequest(BaseModel):
    message: str = Field(min_length=2, max_length=500)
    timeframe: Optional[str] = "1H"

class SignalPayload(BaseModel):
    pair: str
    signal: str
    reason: str
    entry_zone: str
    stop_loss: str
    take_profit: list[str]
    risk_reward: str
    win_probability: str
    strategy: str
    confidence: str
    risk_warning: str
    market_summary: Optional[str] = None

class AnalyzeChatResponse(BaseModel):
    chat_id: int
    message_id: int
    signal: SignalPayload
```

---

# 9. Quant / AI Logic Architecture

## MVP engine design

Build 4 layers:

### A. Prompt parser

Extract:

* symbol
* timeframe
* requested style (`scalp`, `swing`, `breakout`)
* user intent (`analyze`, `buy_or_sell`, `best_trade`, `news`)

### B. Market data layer

For MVP, support two modes:

1. **provider mode**: real candles from a market API
2. **mock mode**: seeded synthetic candles for demo/testing

### C. Indicator layer

Compute:

* EMA 20 / 50 / 200
* RSI(14)
* MACD
* ATR
* rolling volume average
* support / resistance zones
* volatility regime

### D. Strategy engine

Strategies can be rule-scored:

* Trend Following
* Breakout Retest
* Mean Reversion
* Reversal
* Scalping Momentum

Each strategy gets a score from current conditions.
Return the top valid setup.

---

# 10. Strategy Engine Example

## Example rules for BUY breakout retest

Conditions:

* price above EMA 50 and EMA 200
* RSI between 50 and 68 after recent recovery
* MACD histogram turning positive
* breakout above resistance with candle close confirmation
* ATR not excessively high

If conditions pass:

* signal = BUY
* strategy = Breakout Retest
* entry zone = breakout retest band
* stop loss = below retest swing low
* TP targets = RR-based or next resistance zones
* confidence = weighted score bucket

## Win probability logic

For MVP, calculate from pattern scoring + historical template weights.
Example:

* trend alignment = +20
* momentum confirmation = +20
* breakout confirmation = +15
* clean RR >= 2 = +10
* low news risk = +10
* proximity to strong support/resistance = +10
* volatility acceptable = +15

Then map score to probability band:

* 85–100 → 78–86%
* 70–84 → 68–77%
* 55–69 → 58–67%
* below 55 → WAIT / low conviction

Make sure to label clearly that this is an internal modeled probability estimate, not guaranteed accuracy.

---

# 11. Frontend UX Structure

## AI assistant page layout

Three-column desktop concept:

* left: suggested prompts / top setups / watchlist
* center: chat thread + input
* right: latest structured signal card + market summary

On mobile:

* stacked layout
* chat first
* slide-up detail panel for signal card

## Components

### `AiChatShell`

Wraps layout, top bar, history, and input.

### `AiMessageBubble`

Displays user/assistant messages.

### `AiSignalCard`

Displays signal fields in a card:

* BUY/SELL badge
* symbol
* confidence
* entry/SL/TP
* RR ratio
* strategy
* warnings

### `AiSuggestedPrompts`

Clickable prompt chips:

* Analyze EURUSD
* Should I buy BTCUSD now?
* Best setup for Gold today
* Give me a scalping setup for NAS100

### `AiTypingIndicator`

Animated assistant loading state.

### `AiHistoryPanel`

Prior conversations/signals.

---

# 12. Frontend Page Example

## `apps/web/app/ai-assistant/page.tsx`

```tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell } from '@/components/layout';
import { AiChatShell } from '@/components/ai/ai-chat-shell';
import { getToken } from '@/lib/api';

export default function AiAssistantPage() {
  const router = useRouter();

  useEffect(() => {
    if (!getToken()) {
      router.replace('/login');
    }
  }, [router]);

  return (
    <AppShell>
      <AiChatShell />
    </AppShell>
  );
}
```

---

# 13. AI Chat Hook Example

## `hooks/use-ai-chat.ts`

```tsx
import { useEffect, useRef, useState } from 'react';
import { apiFetch } from '@/lib/api';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  structured?: any;
};

export function useAiChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(message: string) {
    if (!message.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: message,
    };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);
    setError('');

    try {
      const res = await apiFetch('/chat/analyze', {
        method: 'POST',
        body: JSON.stringify({ message, timeframe: '1H' }),
      });

      const aiMessage: ChatMessage = {
        id: String(res.message_id),
        role: 'assistant',
        content: `${res.signal.signal} setup on ${res.signal.pair}`,
        structured: res.signal,
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err: any) {
      setError(err.message || 'Analysis failed');
    } finally {
      setLoading(false);
    }
  }

  return { messages, loading, error, send, bottomRef };
}
```

---

# 14. Chat UI Component Example

## `components/ai/ai-chat-shell.tsx`

```tsx
'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAiChat } from '@/hooks/use-ai-chat';

const prompts = [
  'Analyze EURUSD',
  'Should I buy BTCUSD now?',
  'Best trade for Gold today?',
  'Give me a scalping setup for NAS100',
];

export function AiChatShell() {
  const [input, setInput] = useState('');
  const { messages, loading, error, send, bottomRef } = useAiChat();

  return (
    <div className="grid gap-4 lg:grid-cols-[280px_minmax(0,1fr)_360px]">
      <Card className="border-white/10 bg-black/40">
        <CardContent className="p-4 space-y-3">
          <h3 className="text-sm font-semibold text-white">Suggested prompts</h3>
          {prompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => {
                setInput(prompt);
                send(prompt);
              }}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-left text-sm text-slate-200 hover:bg-white/10"
            >
              {prompt}
            </button>
          ))}
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/40 min-h-[70vh]">
        <CardContent className="flex h-full flex-col p-4">
          <div className="mb-4 flex-1 space-y-3 overflow-y-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={message.role === 'user' ? 'flex justify-end' : 'flex justify-start'}
              >
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm ${message.role === 'user' ? 'bg-emerald-500 text-slate-950' : 'bg-white/10 text-white'}`}>
                  <p>{message.content}</p>
                  {message.structured ? (
                    <div className="mt-3 rounded-xl border border-white/10 bg-black/30 p-3 text-xs text-slate-200">
                      <p><strong>Signal:</strong> {message.structured.signal}</p>
                      <p><strong>Strategy:</strong> {message.structured.strategy}</p>
                      <p><strong>Entry:</strong> {message.structured.entry_zone}</p>
                      <p><strong>SL:</strong> {message.structured.stop_loss}</p>
                      <p><strong>TP:</strong> {message.structured.take_profit?.join(', ')}</p>
                      <p><strong>Win Probability:</strong> {message.structured.win_probability}</p>
                      <p><strong>Confidence:</strong> {message.structured.confidence}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            ))}

            {loading ? (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-slate-300">
                  AI is analyzing market structure...
                </div>
              </div>
            ) : null}

            <div ref={bottomRef} />
          </div>

          {error ? <p className="mb-3 text-sm text-rose-300">{error}</p> : null}

          <form
            className="flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
              setInput('');
            }}
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask TradeMind AI to analyze a market..."
              className="border-white/10 bg-white/5 text-white"
            />
            <Button type="submit" disabled={loading}>
              Send
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-black/40">
        <CardContent className="p-4">
          <h3 className="text-sm font-semibold text-white">Daily Market Outlook</h3>
          <p className="mt-3 text-sm text-slate-300">
            Use `/signals/today` and `/market/news` to populate this panel with top setups, regime summaries, and risk headlines.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
```

---

# 15. FastAPI Route Example

## `app/api/routes/chat.py`

```python
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.chat import AnalyzeChatRequest, AnalyzeChatResponse
from app.services.ai_chat_service import analyze_chat_request
from app.api.deps import get_current_user
from app.models.user import User

router = APIRouter()

@router.post('/analyze', response_model=AnalyzeChatResponse)
def analyze_chat(
    payload: AnalyzeChatRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return analyze_chat_request(db=db, user=current_user, payload=payload)
```

---

# 16. AI Chat Service Example

## `services/ai_chat_service.py`

```python
from app.services.market_data_service import get_market_snapshot
from app.services.strategy_engine import generate_signal
from app.utils.prompt_parser import extract_symbol_and_intent


def analyze_chat_request(db, user, payload):
    symbol, timeframe, style = extract_symbol_and_intent(payload.message, payload.timeframe)
    snapshot = get_market_snapshot(symbol=symbol, timeframe=timeframe)
    signal = generate_signal(symbol=symbol, timeframe=timeframe, snapshot=snapshot, style=style)

    # persist chat thread + assistant output here
    # simplified response below
    return {
        'chat_id': 1,
        'message_id': 1,
        'signal': signal,
    }
```

---

# 17. Market Snapshot Contract

## `market_data_service.py`

The service should return normalized market state:

```python
{
  'symbol': 'EURUSD',
  'timeframe': '1H',
  'candles': [...],
  'trend': 'uptrend',
  'volatility': 'moderate',
  'rsi': 58.4,
  'macd': {
    'line': 0.0014,
    'signal': 0.0011,
    'histogram': 0.0003,
  },
  'ema_20': 1.0831,
  'ema_50': 1.0817,
  'ema_200': 1.0760,
  'support': [1.0815, 1.0790],
  'resistance': [1.0852, 1.0881],
  'volume_score': 0.73,
  'news_risk': 'medium',
}
```

---

# 18. News Sentiment Layer

## MVP

You may simulate or summarize manually tagged sentiment for supported symbols.

## Advanced

Integrate real market/news APIs and score:

* positive
* negative
* neutral
* event risk severity

Return:

```json
{
  "symbol": "XAUUSD",
  "sentiment": "Neutral-Bullish",
  "headline_summary": "Gold supported by softer dollar tone but faces resistance ahead of key macro release.",
  "risk_level": "High"
}
```

---

# 19. Learn Mode

Add a toggle in UI:

* Normal mode
* Learn mode

When enabled, append educational explanation:

* why trend following works here
* why breakout retests are higher probability
* what invalidates the setup
* what a beginner should watch for

This can be generated by template logic first, then upgraded with LLM explanation later.

---

# 20. Journal Integration

When a signal is shown, add CTA buttons:

* Took this trade
* Save to journal
* Ignore

If user clicks “Took this trade”:

* prefill trade form with symbol, direction, entry, stop loss, take profits
* store `source_signal_id`

Later you can compare AI suggestions vs actual user execution/performance.

---

# 21. Security Best Practices

* require auth for all AI routes
* rate-limit `/chat/analyze`
* track per-user daily AI usage
* validate supported symbols and timeframes
* do not present advice as guaranteed outcomes
* add disclaimer: educational/trader-support tool, not financial advice
* log requests and failures for auditability
* isolate market provider keys in env vars
* sanitize and cap message length
* use structured outputs from backend rather than rendering raw model text as truth

---

# 22. Deployment Notes

## Frontend on Vercel

Set:

```env
NEXT_PUBLIC_API_URL=https://trade-mind.onrender.com
```

## Backend on Render

Set:

```env
APP_ENV=production
DATABASE_URL=<render postgres internal url>
CORS_ORIGINS=https://trade-mind-web.vercel.app
SECRET_KEY=<long random secret>
```

## Optional provider env vars

```env
MARKET_DATA_PROVIDER=mock
MARKET_DATA_API_KEY=
NEWS_API_KEY=
OPENAI_API_KEY=
```

Use `MARKET_DATA_PROVIDER=mock` for MVP demo mode if live data integration is not ready.

---

# 23. MVP vs Advanced Version

## MVP

* protected AI chat page
* prompt parsing
* mock/live market snapshot abstraction
* quant strategy engine
* structured response cards
* saved chat history
* daily signals endpoint
* journal CTA

## Advanced

* live provider integrations
* sentiment/news aggregation
* streaming chat
* feedback loop and signal outcome tracking
* personalized strategy ranking per user
* LLM explanation layer
* backtesting-based probability scoring
* multi-timeframe confluence engine

---

# 24. Scaling Recommendations

* cache market snapshots by symbol/timeframe
* offload heavy analysis to background workers if provider calls grow
* persist signal outcomes to refine strategy scoring
* introduce model registry for strategy versions
* support websocket market updates for premium users
* add feature flags for AI modes
* store explainable factor weights for each recommendation

---

# 25. Recommended Build Order

1. Add DB models and schemas
2. Build `/chat/analyze` with mock market data
3. Build indicator and strategy services
4. Build AI chat page and message UI
5. Save user chat history
6. Add `/signals/today`
7. Add journal integration CTA
8. Add news sentiment panel
9. Add usage tracking and rate limits
10. Upgrade to provider-backed live data

---

# 26. Mentor Notes

## What to optimize first

Do not start with “AI magic.”
Start with:

* structured signal engine
* deterministic quant logic
* transparent outputs
* good UX

That gives you a real MVP fast.

## What impresses users most

Users care about:

* clarity
* speed
* confidence
* readability
* whether the setup feels understandable

So make the assistant feel:

* fast
* professional
* well-structured
* visually trustworthy

## Best first demo

A great first demo is:

* user logs in
* opens AI assistant
* clicks “Analyze EURUSD”
* receives a strong signal card
* clicks “Took this trade”
* trade form opens prefilled

That shows full product integration, not just a chatbot.

---

# 27. Final Recommendation

For TradeMind, the strongest architecture is:

* quant/rules engine for signal generation
* LLM only for explanation and summarization later
* chat UI integrated deeply with journal and analytics
* strong structured outputs
* auth-protected usage and saved history

This will give you:

* better reliability
* better speed
* easier testing
* stronger product credibility
* easier scaling into premium AI features
