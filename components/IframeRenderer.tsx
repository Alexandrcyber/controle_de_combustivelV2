import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

export interface IframeRendererRef {
  getIframe: () => HTMLIFrameElement | null;
}

interface IframeRendererProps {
  children: React.ReactNode;
}

export const IframeRenderer = forwardRef<IframeRendererRef, IframeRendererProps>(({ children }, ref) => {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [iframeBody, setIframeBody] = useState<HTMLBodyElement | null>(null);

  const copyStyles = (sourceDoc: Document, targetDoc: Document) => {
    Array.from(sourceDoc.getElementsByTagName('link')).forEach(link => {
      if (link.rel === 'stylesheet') {
        const newLinkEl = targetDoc.createElement('link');
        newLinkEl.rel = 'stylesheet';
        newLinkEl.href = link.href;
        targetDoc.head.appendChild(newLinkEl);
      }
    });
    Array.from(sourceDoc.getElementsByTagName('style')).forEach(style => {
      const newStyleEl = targetDoc.createElement('style');
      newStyleEl.textContent = style.textContent;
      targetDoc.head.appendChild(newStyleEl);
    });
  };

  const handleLoad = () => {
    if (iframeRef.current && iframeRef.current.contentWindow) {
      const iframeDoc = iframeRef.current.contentWindow.document;
      iframeDoc.body.style.backgroundColor = '#0f172a';
      copyStyles(document, iframeDoc);
      setIframeBody(iframeDoc.body);
    }
  };

  useEffect(() => {
    const iframe = iframeRef.current;
    if (iframe) {
      iframe.addEventListener('load', handleLoad);
      // Garante que o load seja disparado
      if (iframe.contentWindow?.document.readyState === 'complete') {
        handleLoad();
      }
    }
    return () => {
      if (iframe) {
        iframe.removeEventListener('load', handleLoad);
      }
    };
  }, []);

  // Expõe o iframe para o componente pai
  useImperativeHandle(ref, () => ({
    getIframe: () => iframeRef.current,
  }));

  return (
    <iframe
      ref={iframeRef}
      style={{
        position: 'fixed',
        top: '-9999px',
        left: '-9999px',
        width: '1280px',
        height: '2000px',
        border: 'none',
        zIndex: -1,
      }}
      title="PDF Render Target"
      id="pdf-iframe"
      src="about:blank"
    >
      {iframeBody && ReactDOM.createPortal(children, iframeBody)}
    </iframe>
  );
});
