import { useLocation } from "react-router-dom";
import { CustomScene } from "./Config";
import React, { useEffect } from 'react';
import { socket } from '../../InitialPage/Contexts/Contexts';

export default function PongGame(): JSX.Element {
	const gameContainerRef = React.useRef<HTMLDivElement>(null);
	const id = useLocation().pathname.split('=')[1];

	useEffect(() => {
		socket.on('pongGame', (url: string) => {
		});
	}, [socket]);

	useEffect(() => {
		if (!gameContainerRef.current) return;

		const config = {
			type: Phaser.AUTO,
			parent: gameContainerRef.current,

			width: gameContainerRef.current?.clientWidth || window.innerWidth,
			height: gameContainerRef.current?.clientHeight || window.innerHeight,
			physics: {
				default: 'arcade',
				arcade: {
					gravity: { y: 0 },
					debug: false
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
