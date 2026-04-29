import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useI18n } from '../lib/i18n';

interface Point {
  x: number;
  y: number;
}

export const SnakeGame: React.FC<{ onExit?: () => void, userAlias?: string }> = ({ onExit, userAlias }) => {
  const { lang } = useI18n();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const S = 15;
    const W = canvas.width / S;
    const H = canvas.height / S;

    let snake: Point[] = [{ x: 10, y: 10 }];
    let dir: Point = { x: 1, y: 0 };
    let food: Point = { x: 5, y: 5 };
    let currentScore = 0;

    const placeFood = () => {
      food = {
        x: Math.floor(Math.random() * W),
        y: Math.floor(Math.random() * H)
      };
    };

    const handleKey = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (dir.y === 0) dir = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (dir.y === 0) dir = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (dir.x === 0) dir = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (dir.x === 0) dir = { x: 1, y: 0 }; break;
      }
    };

    window.addEventListener('keydown', handleKey);

    const gameLoop = setInterval(async () => {
      const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };

      // Wall collision
      if (head.x < 0 || head.x >= W || head.y < 0 || head.y >= H) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      // Self collision
      if (snake.some(s => s.x === head.x && s.y === head.y)) {
        setGameOver(true);
        clearInterval(gameLoop);
        return;
      }

      snake.unshift(head);

      if (head.x === food.x && head.y === food.y) {
        currentScore += 10;
        setScore(currentScore);
        placeFood();
      } else {
        snake.pop();
      }

      // Draw
      ctx.fillStyle = '#09090b';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#10b981';
      snake.forEach(s => ctx.fillRect(s.x * S, s.y * S, S - 1, S - 1));

      ctx.fillStyle = '#f43f5e';
      ctx.fillRect(food.x * S, food.y * S, S - 1, S - 1);
    }, 100);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKey);
    };
  }, [gameStarted, gameOver]);

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4 bg-zinc-950 p-6 rounded-3xl border border-emerald-500/20">
      <div className="flex justify-between w-full mb-2">
        <div className="text-emerald-500 font-mono text-sm tracking-widest font-bold">// {lang === 'TR' ? 'YILAN_PROTOKOLÜ' : 'SNAKE_PROTOCOL'}</div>
        <div className="text-zinc-100 font-mono text-sm font-bold">{lang === 'TR' ? 'SKOR' : 'SCORE'}: {score}</div>
      </div>
      
      <div className="relative border border-emerald-500/30 rounded-xl overflow-hidden bg-black shadow-2xl shadow-emerald-500/5">
        <canvas ref={canvasRef} width={300} height={300} />
        {!gameStarted && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-4 text-center">
            <h3 className="text-emerald-400 font-bold mb-4 italic tracking-tighter text-xl underline underline-offset-4">{lang === 'TR' ? 'OPTIMİZASYONA HAZIR MISIN?' : 'READY TO OPTIMIZE?'}</h3>
            <button 
              onClick={() => setGameStarted(true)}
              className="px-6 py-2 bg-emerald-500 text-black font-bold rounded-full hover:bg-emerald-400 transition-colors"
            >
              {lang === 'TR' ? 'OYUNU BAŞLAT' : 'START GAME'}
            </button>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm p-4 text-center">
            <h3 className="text-rose-500 font-bold mb-2 italic tracking-tighter text-xl">{lang === 'TR' ? 'SİSTEM ÇÖKTÜ' : 'SYSTEM COLLAPSED'}</h3>
            <div className="text-zinc-400 text-xs mb-6 font-mono uppercase tracking-widest">{lang === 'TR' ? 'Final Skoru' : 'Final Score'}: {score}</div>
            <div className="flex gap-2">
              <button 
                onClick={() => { setGameOver(false); setScore(0); }}
                className="px-4 py-2 border border-emerald-500/30 text-emerald-400 text-xs font-bold rounded-lg hover:bg-emerald-500/10"
              >
                {lang === 'TR' ? 'YENİDEN BAŞLAT' : 'REBOOT'}
              </button>
              <button 
                onClick={onExit}
                className="px-4 py-2 border border-rose-500/30 text-rose-500 text-xs font-bold rounded-lg hover:bg-rose-500/10"
              >
                X {lang === 'TR' ? 'ÇIKIŞ' : 'EXIT'}
              </button>
            </div>
          </div>
        )}
      </div>
      
      <div className="text-[10px] text-zinc-600 font-mono uppercase tracking-tighter">{lang === 'TR' ? 'Güvenli yolda ilerlemek için ok tuşlarını kullanın' : 'Use arrow keys to navigate the secure path'}</div>
    </div>
  );
};
