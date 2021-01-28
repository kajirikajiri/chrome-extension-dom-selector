// typescriptだと、event.source.postMessageのあたりで

export const exec = (event, message) =>{
  event.source.postMessage(message, event.origin)
}