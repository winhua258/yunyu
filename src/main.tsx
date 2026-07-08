import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { AuthProvider } from './components/AuthContext.tsx';
import { DataProvider } from './components/DataContext.tsx';


// 阻止 iOS Safari 雙擊與雙指捏合縮放最外層，保持網頁固定比例且不限制內部滾動
if (typeof document !== 'undefined') {
  document.addEventListener('touchstart', (event) => {
    if (event.touches.length > 1) {
      event.preventDefault(); // 阻止多指捏合縮放
    }
  }, { passive: false });

  let lastTouchEnd = 0;
  document.addEventListener('touchend', (event) => {
    const now = Date.now();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault(); // 阻止雙擊縮放
    }
    lastTouchEnd = now;
  }, { passive: false });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <App />
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>,
);
