export const execSmoothScroll = (selector: string, index: number) => {
  const el = document.querySelectorAll(selector)[index];
  el.scrollIntoView();
};
