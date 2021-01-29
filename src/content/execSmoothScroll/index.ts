export const execSmoothScroll = (selector: string, index: number) => {
  console.log(`document.querySelectorAll('${selector}')[${index}]`);
  const el = document.querySelectorAll(selector)[index];
  el.scrollIntoView();
};
