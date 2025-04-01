export const printUrl = (url: string) => {

    console.log(`Print Url`, url);

    // Create hidden iframe
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    // Load content and print
    iframe.src = url;

    return new Promise((resolve, reject) => {
        const maxWaitTime = 60000; // 10 seconds timeout
        const startTime = Date.now();

        const checkReadyState = () => {
            const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;

            if (iframeDoc?.readyState === 'complete') {
                setTimeout(() => {
                    try {
                        iframe.contentWindow?.print();
                        resolve(true);
                    } catch (error) {
                        console.error('Print failed:', error);
                        reject(error);
                    } finally {
                        setTimeout(() => {
                            document.body.removeChild(iframe);
                        }, 1000);
                    }
                }, 1000); // Additional delay to ensure content renders
                return;
            }

            if (Date.now() - startTime > maxWaitTime) {
                document.body.removeChild(iframe);
                reject(new Error('Timeout waiting for page to load'));
                return;
            }

            setTimeout(checkReadyState, 100);
        };

        iframe.onerror = () => {
            document.body.removeChild(iframe);
            reject(new Error('Failed to load page'));
        };

        iframe.onload = checkReadyState;
    });
};


export const getHostUrl = (host: string) => {
    const [hostname, port] = host.split(':');
  
    // Check for localhost or IP
    const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  
    const isIP = /^(\d{1,3}\.){3}\d{1,3}$/.test(hostname);
  
  
    if (isLocalhost || isIP) {
      return port ? `http://${hostname}:${port}` : `http://${hostname}:3000`;
    }
  
    return `https://${hostname}`;
  };