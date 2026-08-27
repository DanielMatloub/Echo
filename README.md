# Echo

Live audio captioning in your browser.

**Live demo:** https://echo-seven-hazel.vercel.app/

## What it does

Echo transcribes speech in real time using your device's microphone. Text appears at the top of the screen and scrolls down as you speak, with older lines fading out.

## Features

- Real-time speech-to-text transcription
- Adjustable sensitivity slider to filter out low-confidence results
- Older lines fade out as new speech comes in
- Live indicator with pulsing dot
- Clear button to reset the transcript
- Works with any audio source your microphone can pick up

## Tech stack

- **Frontend:** React
- **Speech:** Web Speech API (built into Chrome)
- **Deployment:** Vercel

## Running locally

```bash
cd frontend
npm install
npm start
```

## Notes

- Works best in Chrome — the Web Speech API has limited support in Safari and Firefox
- Requires microphone permission
- No audio is sent to any server — all transcription happens locally in the browser

## Roadmap

- Speaker lock mode
- Multiple language support
- Transcript export
