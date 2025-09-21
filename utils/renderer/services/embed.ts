declare global {
  interface Window {
    iFrameResize: any;
  }
}

export const loadIframeResizer = () => {
  if (typeof window === 'undefined') return;

  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/iframe-resizer/4.3.2/iframeResizer.min.js';
  script.async = true;
  script.onload = () => {
    if (window.iFrameResize) {
      window.iFrameResize(
        {
          checkOrigin: false,
          inPageLinks: true,
          heightCalculationMethod: 'taggedElement',
        },
        '.embed-content'
      );
    }
  };
  document.body.appendChild(script);
};