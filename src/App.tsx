import { useState, useEffect, useRef } from 'react';
import './App.css';

interface ContactItem {
  text: string;
  url: string;
}

const contacts: ContactItem[] = [
  { text: 'www.dimamurugov.ru', url: 'https://www.dimamurugov.ru' },
  { text: 'vk.com/dimamurugov', url: 'https://vk.com/dimamurugov' },
  { text: 'telegram: @dimamurugov', url: 'https://t.me/dimamurugov' },
  { text: 'github.com/dimamurugov', url: 'https://github.com/dimamurugov' },
  { text: 'instagram: @dimamurugov', url: 'https://instagram.com/dimamurugov' },
  { text: 'dimamurugov@gmail.com', url: 'mailto:dimamurugov@gmail.com' },
];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animate, setAnimate] = useState(false);
  const animationTimerRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);

  // Циклическая смена второстепенного контента
  useEffect(() => {
    intervalRef.current = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % contacts.length);
    }, 3000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Запуск анимации при смене индекса
  useEffect(() => {
    if (animationTimerRef.current) clearTimeout(animationTimerRef.current);
    setAnimate(true);
    animationTimerRef.current = window.setTimeout(() => {
      setAnimate(false);
    }, 300);
  }, [currentIndex]);

  const currentContact = contacts[currentIndex];

  return (
    <div className="container">
      <h1 className="main-name">dimamurugov</h1>
      <a
        href={currentContact.url}
        target="_blank"
        rel="noopener noreferrer"
        className={`sub-line ${animate ? 'animate' : ''}`}
      >
        {currentContact.text}
      </a>
    </div>
  );
}

export default App;