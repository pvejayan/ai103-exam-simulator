# AI-103 Exam Simulator Test-Taker Guide

This simulator contains original practice questions aligned to the Microsoft Learn AI-103 skills measured. It is not official Microsoft, Pearson VUE, MeasureUp, or exam-dump content.

## Recommended Practice Plan

1. Start with **Quick simulation** to establish a baseline.
2. Use **Section practice** for weak areas.
3. Use **Code practice** for SDK, parameter, and snippet interpretation questions.
4. Use **Full simulation** when you want exam stamina practice.
5. Review every missed or flagged question and map it back to the Microsoft Learn topic.

## How To Approach Questions

- Read the final sentence first so you know what the question is asking.
- Identify whether it asks for a service, SDK object, parameter, method, result value, or architecture pattern.
- For multiple-response questions, choose only the required answers. One extra answer makes the item wrong.
- Flag questions that take too long and return to them after easier items.

## Code-Based Questions

For code snippets, inspect:

- SDK client type, such as `SpeechRecognizer`, `SpeechSynthesizer`, `SearchClient`, or `DocumentIntelligenceClient`.
- Method name, such as `recognize_once_async`, `speak_text_async`, `search`, or `begin_analyze_document`.
- Key parameters, such as `query_type`, `semantic_configuration_name`, `vector_queries`, `speech_synthesis_voice_name`, `analyzer_id`, and `tool_choice`.
- Environment variables, such as `MODEL_DEPLOYMENT_NAME`, `SPEECH_KEY`, `SPEECH_REGION`, or `PROJECT_ENDPOINT`.
- Result checks, such as `SynthesizingAudioCompleted`, `TranslatedSpeech`, and `SpeechServiceResponse_JsonResult`.

## Speech And Voice Live Topics To Review

- Speech to text
- Text to speech and neural voices
- Speech translation
- Pronunciation assessment
- Custom speech and custom voice
- Voice Live API for real-time voice agents
- Voice Live with Foundry Agent Service
- Voice Live conversational features such as interruption detection, end-of-turn detection, echo cancellation, and noise suppression

Microsoft Learn references:

- https://learn.microsoft.com/azure/ai-services/speech-service/voice-live
- https://learn.microsoft.com/azure/ai-services/speech-service/voice-live-agents-quickstart
- https://learn.microsoft.com/azure/ai-services/speech-service/get-started-text-to-speech
- https://learn.microsoft.com/azure/ai-services/speech-service/how-to-recognize-speech
- https://learn.microsoft.com/azure/ai-services/speech-service/get-started-speech-translation
- https://learn.microsoft.com/azure/ai-services/speech-service/how-to-pronunciation-assessment
- https://learn.microsoft.com/azure/ai-services/speech-service/custom-neural-voice

## Scoring

The app simulates the Microsoft certification passing threshold by showing a scaled score out of 1000. A simulated score of `700` or greater is treated as a pass.

Use the section breakdown to decide what to study next. The score is a practice signal, not a predictor or guarantee of exam performance.
