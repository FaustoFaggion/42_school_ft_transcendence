// WebSocket for communication chat in real time

import { SubscribeMessage, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Socket, Server } from "socket.io";
import { AddChatUserDto, CreateChatroomDto, CreateDirectChatroomDto, CreateDirectMessageDto, DeleteChatroomDto, InputChatroomDto, InputChatroomMessageDto, InputOpenChatroomDto, WebsocketDto, WebsocketWithTimeDto } from "./dto/input.dto";
import { ChatroomService } from "./chatroom.service";
import { DisconnectDto, DisconnectUserDto } from "src/game/dtos/input.dto";
import { GameService } from "src/game/game.service";
import { UsersService } from "src/users/users.service";
import { Console } from "console";
import { JogoService } from "src/game/jogo/game.jogo.service";

interface queue {
	id: string,
	nickname: string,
	model: string,
	bar: string,
	client: Socket,
}

interface responseQueue {
	Player1: string,
	Player2: string,
	Player1Bar: string,
	Player2Bar: string,
	lider: string,
	room: string
}

interface rooms {
	paddleLider: number,
	paddlePlayer: number,
	positionBall: [number, number]
	room: string,
	isLider: boolean,
}

type Player = {
	id: string,
	socket: Socket,
}

@WebSocketGateway(
	{
		cors: {
			origin: '*',
			methods: ['GET', 'POST'],
			credentials: true
		}
	}
)
export class ChatroomGateway implements OnGatewayInit, OnGatewayConnection {

	matchs: {
		[key: string]: Player;
	} = {};
	static queues: Player[] = [];

	constructor(private readonly service: ChatroomService
		, private readonly gameService: GameService
		, private readonly chatroomService: ChatroomService
		, private readonly userService: UsersService
		, private readonly jogoService: JogoService
	) { }

	@WebSocketServer() server: Server;

	afterInit(server: Server) {
		console.log('Initialized!');
	}

	async handleConnection(client: Socket) {
		console.log("Client connected: ", client.id, client.handshake.auth.user);
		if (client.handshake.auth.user_id) {
			await this.userService.userSocketConnect(client.handshake.auth.user_id);
		}
	}

	async handleDisconnect(client: Socket) {
	// 	client.emit('desconectado', 'Desconectado com sucesso!');
		let user;
		if (client.handshake.auth.user_id) {
			user = await this.userService.userSocketDisconnect(client.handshake.auth.user_id);
		}
		console.log("Client disconnect: ",	user);
	}

	@SubscribeMessage('save-socket')
	async saveSocket(client: Socket, userId: string) {
		console.log("userId: ", userId, "\nsocketId: ", client.id);
	}

	@SubscribeMessage('create-group')
	async createChatroom(client: Socket, dto: CreateChatroomDto) {
		await this.chatroomService.createChatroom(dto.my_id, dto);
		this.server.emit("creatChat", "succeso");
	}

	@SubscribeMessage('delete-group')
	async deleteChatroom(client: Socket, dto: DeleteChatroomDto) {
		await this.chatroomService.deleteChatroom(dto.my_id, dto);
		this.server.to(dto.chatId).emit("deleteChat", "O chat foi deletado");
	}

	@SubscribeMessage('open-group')
	async openChatroom(client: Socket, dto: InputOpenChatroomDto) {
		client.join(dto.chatId);
	}

	@SubscribeMessage('close-group')
	async closeChatroom(client: Socket, dto: InputOpenChatroomDto) {
		client.leave(dto.chatId);
	}

	@SubscribeMessage('add-member-group')
	async	addMemberChatroom(client: Socket, dto: WebsocketDto) {
		await this.chatroomService.addMemberChatroom(dto.my_id, dto);
		this.server.to(dto.chat_id).emit("updateChat", "succeso");
	}

	@SubscribeMessage('add-adm-group')
	async addAdmChatroom(client: Socket, dto: WebsocketDto) {
		await this.chatroomService.addAdmChatroom(dto.my_id , dto);
		this.server.to(dto.chat_id).emit("updateChat", "succeso");
	}

	@SubscribeMessage('remove-adm-group')
	async removeAdmChatroom(client: Socket, dto: WebsocketDto) {
		await this.chatroomService.removeAdmChatroom(dto.my_id, dto);
		this.server.to(dto.chat_id).emit("updateChat", "succeso");
	}

	@SubscribeMessage('ban-member-group')
	async banMemberChatroom(client: Socket, dto: WebsocketDto) {
		await this.chatroomService.banMemberChatroom(dto.my_id, dto);

		let obj = {
			id: dto.other_id,
			msg: "Você foi banido desse chat"
		}
		this.server.to(dto.chat_id).emit("banMember", obj);
	}

	@SubscribeMessage('kick-member-group')
	async kickMemberChatroom(client: Socket, dto: WebsocketWithTimeDto) {
		await this.chatroomService.kickMemberChatroom(dto.my_id, dto);
		let obj = {
			id: dto.other_id,
			msg: "Você foi kickado desse chat"
		}
		this.server.to(dto.chat_id).emit("kickMember", obj);
	}

	@SubscribeMessage('mute-member-group')
	async muteMemberChatroom(client: Socket, dto: WebsocketWithTimeDto) {
		await this.chatroomService.muteMemberChatroom(dto.my_id, dto);
		let obj = {
			id: dto.other_id,
			msg: "Você foi mutado desse chat"
		}
		this.server.to(dto.chat_id).emit("kickMember", obj);
	}

	@SubscribeMessage('group-message')
	async chatroomMessage(client: Socket, dto: InputChatroomMessageDto) {
		let outputMsg: any = await this.service.createChatroomMessage(dto);
		outputMsg.chat_name = dto.chat_name;
		outputMsg = JSON.stringify(outputMsg);
		this.server.to(dto.chatId).emit('chatMessage', outputMsg);
	}

	@SubscribeMessage('direct-block')
	async directChatroomBlock(client: Socket, dto: CreateDirectChatroomDto) {
		let outputMsg: any = await this.service.directChatroomBlock(dto);
		// outputMsg = JSON.stringify(outputMsg);
		this.server.emit('directChatMessage', "chatroom blocked!!");
	}

	@SubscribeMessage('direct-message')
	async directChatroomMessage(client: Socket, dto: CreateDirectMessageDto) {
		let outputMsg: any = await this.service.createDirectMessage(dto);
		outputMsg = JSON.stringify(outputMsg);
		this.server.emit('directChatMessage', outputMsg);
	}

	@SubscribeMessage('check-status')
	async checkStatus(client: Socket, dto: DisconnectDto) {
		if (dto.msg == "entrei/sai") {
			await this.gameService.disconnect(dto);
		}
		this.server.emit('checkStatus', dto.msg);
	}

	@SubscribeMessage('rooms')
	async rooms(client: Socket, dto: rooms) {
		const room = dto.room

		this.server.to(room).emit('startGame', dto);
	}

	@SubscribeMessage('joinRoom')
	async handleJoinRoom(client: Socket, userId: any) {
		ChatroomGateway.queues.push({ id: userId.id, socket: client });

		if (ChatroomGateway.queues.length >= 2) {
			let player1 = ChatroomGateway.queues[0];
			let player2 = ChatroomGateway.queues[1];
			ChatroomGateway.queues.splice(0, 2);
			this.handleCreateMatch(player1, player2);
		}
	}

	@SubscribeMessage('sendInvite')
	async sendInvite(client: Socket, obj: { myId: string, myNickname: string, otherId: string,  msg: string }) {
		if (obj.msg == "convite") {
			this.matchs[obj.otherId] = { id: obj.myId, socket: client };
			this.server.emit('receiveConvite', obj);
		}
		else if (obj.msg == "response") {
			let player1: Player = {id : obj.myId, socket: client}
			let player2: Player = this.matchs[obj.myId];
			this.handleCreateMatch(player1, player2)
		}
	}

	@SubscribeMessage('createMatch')
	async handleCreateMatch(player1: Player, player2: Player) {
		const game = await this.jogoService.startGame(player1.id, player2.id, 5);
		if (game) {
			player1.socket.join(game.roomID);
			player2.socket.join(game.roomID);
			this.server.to(game.roomID).emit('startGame', game);
			this.server.emit('checkStatus', '');
		}
	}

	@SubscribeMessage('disconnect-user')
	async handleDisconnectUser(client: Socket, dto: DisconnectUserDto): Promise<any> {
		console.log("Disconnect-user Route");
		const game = await this.jogoService.disconnectUser(dto);
		this.server.to(game?.roomID).emit("updateGame", game);
	}

	@SubscribeMessage('updateGame')
	async handleUpdateGame(client: Socket, roomID: string) {
		const game = await this.jogoService.updateGame(roomID);
		if (game && game.winner) {
			this.server.emit('checkStatus', '');
		}
		this.server.to(game?.roomID).emit('updateGame', game);
	}

	@SubscribeMessage('updatePaddle')
	async handleUpdatePaddle(client: Socket, paddle_status: any) {
		// console.log("roomId: ", paddle_status.roomID, "\n isLeft: ", paddle_status.isLeft, "\n isUp: ", paddle_status.isUp);
		const game = await this.jogoService.movePaddle(paddle_status.roomID, paddle_status.isLeft, paddle_status.isUp, paddle_status.pause);
	}

	@SubscribeMessage('watch-match')
	async handleWatchMatch(client: Socket, ids: { playerId: string, watcherId: string }) {
		let game = await this.jogoService.watchMatch(ids.playerId, ids.watcherId);
		if (game) {
			client.join(game.roomID);
			client.emit('startGame', game);
			this.server.emit('checkStatus', '');
		}
	}
}
