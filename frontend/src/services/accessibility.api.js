import api from './api'

export const accessibilityApi = {
  textToSpeech: (data) =>
    api.post('/accessibility/tts', data),
  
  translate: (data) =>
    api.post('/accessibility/translate', data),
  
  getSupportedLanguages: () =>
    api.get('/accessibility/languages')
}
