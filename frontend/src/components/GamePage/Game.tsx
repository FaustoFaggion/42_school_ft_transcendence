import { CustomScene } from "./Config";
import React, { useEffect } from 'react';

const PongGame = () => {
  const gameContainerRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainerRef.current) return;
    const config = {
      type: Phaser.AUTO,
      parent: gameContainerRef.current,
      
      width:  gameContainerRef.current?.clientWidth || window.innerWidth,
      height: gameContainerRef.current?.clientHeight || window.innerHeight,
      physics: {
        default: 'arcade',
        arcade: {
          gravity: { y: 0 },
          debug: true
        }
      },
      scene: [CustomScene]
    };

    const game = new Phaser.Game(config);

    return () => {
      if (game) {
        game.destroy(true);
      }
    };
  }, []);

  return <div ref={gameContainerRef} className="h-100 rounded bg-custon-roxo" />;

};

export default PongGame;
