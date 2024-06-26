// ### Criar os objetos do nosso game ping pong ###

import { randomUUID } from "crypto";

class GWindow {
	width: number;
	height: number;

	constructor(width: number, height: number) {
		this.width = width;
		this.height = height;
	}
}

class GBall {
	positionX: number;
	positionY: number;
	directionX: number;
	directionY: number;
	directionY_up: boolean;
	angle: number;
	size: number;
	max_angle: number;
	path: number;
	velocity: number;
	acceleration_ratio: number;
	hit_positionY: number;

	constructor(velocity: number, acceleration_ratio: number) {
		this.positionX = 0;
		this.positionY = 0;
		this.directionX = 1;
		this.directionY = 1;
		this.directionY_up = false;
		this.angle = 0;
		this.size = 4;
		this.max_angle = 70;
		this.path = 1;
		this.velocity = velocity;
		this.acceleration_ratio = acceleration_ratio;
		this.hit_positionY = 0;
	}
}

class Paddle {
	positionY: number;
	positionX: number;
	velocity: number;
	position_front: number;

	width: number;
	height: number;

	constructor(positionX: number, positionY: number, velocity: number, width: number, height: number) {
		this.positionX = positionX;
		this.positionY = positionY;
		this.velocity = velocity;
		this.width = width
		this.height = height;
		this.position_front = positionY + (height / 2);
	}
}

class Player {
	id: string;
	nickname: string;
	status: boolean;

	constructor(id: string) {
		this.id = id;
		this.status = true;
	}
}

abstract class Power {
	x: number;
	y: number;
	size: number

	constructor(x: number, y: number) {
		this.x = x;
		this.y = y;
		this.size = 50;
	}

	abstract apply(paddle: Paddle): void;
}

export class AumentarPaddle extends Power {
	constructor(x: number, y: number) {
		super(x, y);
	}

	apply(paddle: Paddle) {
		paddle.height = paddle.height + 15;
	}
}

export class DiminuirPaddle extends Power {
	constructor(x: number, y: number) {
		super(x, y);
	}

	apply(paddle: Paddle) {
		paddle.height = paddle.height - 15;
	}
}


export class GGame {

	player_left: Player;
	player_right: Player;
	placarLeft: number;
	placarRight: number;

	participants: Array<string>;

	window: GWindow;

	ball: GBall;

	paddleLeft: Paddle;
	paddleInitialSize: number;
	paddleRight: Paddle;

	roomID: string;
	winner: string;
	loser: string;

	gameStatus: boolean;
	pixelIncrement: number;
	paddle_hits: number;
	hits_for_accelaration: number;
	ball_refX: number;
	ball_refY: number;
	pause: boolean;
	power: Power;
	watchs: Array<string>;
	lastPaddleHitted: string;
	isRaking: boolean;

	constructor(player_left_id: string, player_right_id: string, isRaking: boolean, hits_for_acceleration: any) {
		this.player_left = new Player(player_left_id);
		this.player_right = new Player(player_right_id);
		this.isRaking = isRaking;
		this.window = new GWindow(100, 100);
		this.ball = new GBall(1, 12);
		this.paddleLeft = new Paddle(0, 50, 1, 2, 20);
		this.paddleRight = new Paddle(100, 50, 1, 2, 20);
		this.roomID = randomUUID();
		this.placarLeft = 0;
		this.placarRight = 0;
		this.winner = "";
		this.loser = "";
		this.pixelIncrement = 2;
		this.paddle_hits = 0;
		this.hits_for_accelaration = hits_for_acceleration;

		this.paddleLeft.width = (this.paddleLeft.width / 100) * this.window.width;

		this.paddleInitialSize = (this.paddleLeft.height / 100) * this.window.height;
		this.paddleLeft.height = this.paddleInitialSize;
		this.paddleLeft.positionX = 0;
		this.paddleLeft.positionY = this.window.height / 2;

		this.paddleRight.width = (this.paddleRight.width / 100) * this.window.width;
		this.paddleRight.height = this.paddleInitialSize;
		this.paddleRight.positionX = this.window.width - (this.paddleRight.width);
		this.paddleRight.positionY = this.window.height / 2;

		// this.ball.directionX = Math.random() < 0.5 ? -1 : 1;
		this.ball.directionX = 1;
		this.ball.positionX = this.window.width / 2;
		this.ball.positionY = this.window.height / 2;
		this.ball.hit_positionY = this.ball.positionY;
		this.ball.size = (this.ball.size / 100) * this.window.height;
		this.ball_refX = this.ball.positionX;
		this.ball_refY = this.ball.positionY;

		this.paddleLeft.position_front = this.paddleLeft.positionY - (this.paddleLeft.height / 2);
		this.paddleRight.position_front = this.paddleRight.positionY - (this.paddleRight.height / 2);

		this.pause = false;
		this.winner = "";

		this.participants = [];
		this.watchs = [];
		this.power = null;
		this.participants.push(player_left_id);
		this.participants.push(player_right_id);
		this.lastPaddleHitted = "";
	}

	copy(ggame: GGame): GGame {
		let response: GGame =  new GGame(this.player_left.id, this.player_right.id, this.isRaking, this.hits_for_accelaration);
		response.player_left = ggame.player_left;
		response.player_right = ggame.player_right;
		response.placarLeft = ggame.placarLeft;
		response.placarRight = ggame.placarRight;

		response.window = ggame.window;

		response.ball = ggame.ball;

		response.paddleLeft = ggame.paddleLeft;
		response.paddleRight = ggame.paddleRight;

		response.roomID = ggame.roomID;
		response.winner = ggame.winner;
		response.loser = ggame.loser;

		response.gameStatus = ggame.gameStatus;
		response.pixelIncrement = ggame.pixelIncrement;
		response.paddle_hits = ggame.paddle_hits;
		response.hits_for_accelaration = ggame.hits_for_accelaration;
		response.ball_refX = ggame.ball_refX;
		response.ball_refY = ggame.ball_refY;
		response.pause = ggame.pause;
		return response;
	}

}
