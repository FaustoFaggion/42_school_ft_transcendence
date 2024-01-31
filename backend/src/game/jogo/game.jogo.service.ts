// Aqui vamos colocar nossos serviços,
// que é startgame, updategame, checkcoliissionpaddle e checkcollisionwall.

import { Injectable } from "@nestjs/common";
import { GGame } from "./game.jogo.interfaces";
import { User } from "@prisma/client";

@Injectable()
export class JogoService {
	static rooms: GGame[] = [];

	async startGame(player1: String, player2: String, hits_for_acceleration: number) {
		console.log("\nentrei startGame\n");
		const game = new GGame(player1, player2, hits_for_acceleration);
		JogoService.rooms.push(game);
		return game;
	}

	// Y: acima + / abaixo - X: direita + / esquerda -
	verifyCollisionPaddles(game: GGame) {
		let verifyCollisionPaddleLeft = () => {

			let half_paddle_size = game.paddleLeft.height / 2;
			let half_ball_size = game.ball.size / 2;

			if (game.ball.positionX <= game.paddleLeft.positionX) {

				if ((game.ball.positionY + half_ball_size) < (game.paddleLeft.positionY - half_paddle_size)) {
					game.placarRight++;
					return false
				}
				if ((game.ball.positionY - half_ball_size) > (game.paddleLeft.positionY + half_paddle_size)) {
					game.placarRight++;
					return false
				}

				//Muda direção em X, mudando o sinal do numero
				game.ball.directionX *= -1;
				game.paddle_hits++;

				//Cálculo do ângulo
				if (game.ball.positionY >= game.paddleLeft.positionY) {
					let paddle_hit = (game.ball.positionY - game.paddleLeft.positionY) / half_paddle_size;
					game.ball.angle *= game.ball.max_angle * paddle_hit;
					game.ball.directionY = 1;

				}
				if (game.ball.positionY < game.paddleLeft.positionY) {
					let paddle_hit = (game.ball.positionY - game.paddleLeft.positionY) / half_paddle_size;
					game.ball.angle *= paddle_hit;
					game.ball.directionY = -1;
				}
				return true;
			}
		}

		let verifyCollisionPaddleRight = () => {
			let half_paddle_size = game.paddleRight.height / 2;
			let half_ball_size = game.ball.size / 2;

			if (game.ball.positionX >= game.paddleRight.positionX) {
				if ((game.ball.positionY + half_ball_size) < (game.paddleRight.positionY - half_paddle_size)) {
					game.placarLeft++;
					return false
				}
				if ((game.ball.positionY - half_ball_size) > (game.paddleRight.positionY + half_paddle_size)) {
					game.placarLeft++;
					return false
				}

				//Muda direção em X, mudando o sinal do numero
				game.ball.directionX *= -1;
				game.paddle_hits++;

				//Cálculo do ângulo
				if (game.ball.positionY >= game.paddleRight.positionY) {
					let paddle_hit = (game.ball.positionY - game.paddleRight.positionY) / half_paddle_size;
					game.ball.angle *= paddle_hit;
					game.ball.directionY = 1;
				}
				if (game.ball.positionY < game.paddleRight.positionY) {
					let paddle_hit = (game.ball.positionY - game.paddleRight.positionY) / half_paddle_size;
					game.ball.angle *= paddle_hit;
					game.ball.directionY = -1;
				}
			}
			return true;
		}

		if (verifyCollisionPaddleLeft() == false) {
			console.log("entrei");
			return false
		}
		if (verifyCollisionPaddleRight() == false) {
			console.log("entrei3");
			return false
		}
		return true;
	}

	verifyCollisionWall(game: GGame) {
		let verifyCollisionWallUp = () => {
			if (game.ball.positionY <= 0) {
				game.ball.angle = 180 - game.ball.angle;
				game.ball.directionY *= -1;
				return true;
			}
		}

		let verifyCollisionWallDown = () => {
			if (game.ball.positionY >= game.window.height) {
				game.ball.angle = 180 - game.ball.angle;
				game.ball.directionY *= -1;
				return true;
			}
		}

		verifyCollisionWallUp();
		verifyCollisionWallDown();
	}

	moveBall(game: GGame) {
		game.ball.positionX += game.ball.velocity;
		game.ball.positionY += game.ball.angle;
	}

	movePaddle(game: GGame, player: string, move: string) {
		if (player == "left") {
			if (move == "up") {
				game.paddleLeft.positionY += game.paddleLeft.velocity;
			} else if (move == "down") {
				game.paddleLeft.positionY -= game.paddleLeft.velocity;
			}
		}
		else if (player == "right") {
			if (move == "up") {
				game.paddleRight.positionY += game.paddleRight.velocity;
			} else if (move == "down") {
				game.paddleRight.positionY -= game.paddleRight.velocity;
			}
		}
	}

	checkScore(game: GGame) {
		if (game.placarLeft == 10 || game.placarRight == 10) {
			return 'left';
		}
		return false;
	}

	checkWinner(game: GGame) {
		if (game.placarLeft == 10) {
			return game.player_left;
		}
		else if (game.placarRight == 10) {
			return game.player_right;
		}
	}

	CheckDisconnectUser(game: GGame, player: User) {
		if (game.player_left.id == player.id) {
			game.player_left.status = false;
			return true;
		} else if (game.player_right.id == player.id) {
			game.player_right.status = false;
			return true;
		}
	}

	resetGame(game: GGame) {
		game.ball.positionX = game.window.width / 2;
		game.ball.positionY = game.window.height / 2;
		game.ball.velocity = 5;
		game.ball.directionX = 1;
		game.ball.directionY = 1;
		game.ball.angle = Math.random() < 0.5 ? -1 : 1;
		game.paddleLeft.positionY = game.window.height / 2;
		game.paddleRight.positionY = game.window.height / 2;
	}

	updateGame(gameID: string) {
		let index = 0;
		if (JogoService.rooms.length == 0) {
			return;
		}
		for (let game of JogoService.rooms) {
			if (game.roomID == gameID) {
				break;
			}
			index++
		}

		if (this.verifyCollisionPaddles(JogoService.rooms[index]) == false) {
			if (this.checkScore(JogoService.rooms[index])) {
				this.checkWinner(JogoService.rooms[index]);
			}
			this.resetGame(JogoService.rooms[index]);
		}
		else {
			this.verifyCollisionWall(JogoService.rooms[index]);
		}

		JogoService.rooms[index].ball.positionX += JogoService.rooms[index].ball.path * JogoService.rooms[index].ball.directionX;

		if (JogoService.rooms[index].ball.angle != 0) {
			let tan = Math.tan(JogoService.rooms[index].ball.angle);
			JogoService.rooms[index].ball.positionY = JogoService.rooms[index].ball.positionX / tan;
		}

		console.log("depois position", JogoService.rooms[index].ball.positionX);
		console.log("depois position", JogoService.rooms[index].ball.positionY);

		if (JogoService.rooms[index].paddle_hits % JogoService.rooms[index].hits_for_accelaration == 0) {
			JogoService.rooms[index].ball.velocity += JogoService.rooms[index].ball.velocity * (JogoService.rooms[index].ball.acceleration_ratio / 100);
		}

		JogoService.rooms[index].paddleLeft.position_front = JogoService.rooms[index].paddleLeft.positionY + (JogoService.rooms[index].paddleLeft.height / 2);
		JogoService.rooms[index].paddleLeft.position_front = JogoService.rooms[index].paddleRight.positionY + (JogoService.rooms[index].paddleRight.height / 2);

		return JogoService.rooms[index];
	}
}

