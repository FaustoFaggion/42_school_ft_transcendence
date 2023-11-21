import { Injectable } from '@nestjs/common';
import { AddChatAdmDto, CreateChatroomDto, CreateDirectChatroomDto, CreateDirectMessageDto } from './dto/input.dto';
import { ChatroomRepository } from './chatroom.repository';
import { privateDecrypt } from 'crypto';
import { UsersService } from 'src/users/users.service';
import { DirectChatRoom, DirectMessage } from '@prisma/client';
import { ChatroomDto, ChatroomsDto, OutputDirectMessageDto, OutputDirectMessagesDto } from './dto/output.dto';

@Injectable()
export class ChatroomService {
	constructor(private readonly chatroomRepository: ChatroomRepository,
		private readonly userService: UsersService) { }

	async createChatroom(userId: string, dto: CreateChatroomDto): Promise<CreateChatroomDto> {

		let response = await this.chatroomRepository.createChatroom(userId, dto);
		return response;
	}

	async findAllChatroom(): Promise<ChatroomsDto> {

		let chats = await this.chatroomRepository.findAllChatroom();

		let outputDto = new ChatroomsDto;
		outputDto.chatrooms = [];

		for (const obj of chats) {
			let dto = new ChatroomDto;
			dto.id = obj.id;
			dto.name = obj.name;
			dto.type = obj.type;
			dto.photoUrl = obj.photoUrl;
			dto.owner_nickname = obj.owner.nickname;
			outputDto.chatrooms.push(dto);
		}
		return outputDto;
	}

	async createDirectChatroom(userId: string, dto: CreateDirectChatroomDto): Promise<OutputDirectMessagesDto> {

		console.log("USER1: ", userId);
		let user1 = await this.userService.findProfile(userId);

		let comp = user1._nickname.localeCompare(dto.user_nickname);
		let name;
		if (comp < 0) {
			name = user1._nickname + dto.user_nickname;
		}
		else {
			name = dto.user_nickname + user1._nickname
		}
		let chat: DirectChatRoom = await this.chatroomRepository.findDirectChatroom(name);

		if (!chat) {
			chat = await this.chatroomRepository.createDirectChatRoom(name);
		}
		return await this.findAllDirectMessage(name);
	}

	async createDirectMessage(userId: string, dto: CreateDirectMessageDto): Promise<OutputDirectMessagesDto> {

		console.log("USERID: ", userId);
		let user1 = await this.userService.findUser(userId);

		console.log("NICKNAME: ", user1.nickname)

		let comp = user1.nickname.localeCompare(dto.user_nickname);
		let chat;
		if (comp < 0) {
			chat = user1.nickname + dto.user_nickname;
		}
		else {
			chat = dto.user_nickname + user1.nickname
		}
		let msg = this.chatroomRepository.createDirectMessage(user1.nickname, chat, dto);

		return await this.findAllDirectMessage(chat); // findUnique
	}

	async findAllDirectMessage(name: string): Promise<OutputDirectMessagesDto> {
		let msg = await this.chatroomRepository.findAllDirectMessage(name);

		let outputDto = new OutputDirectMessagesDto;
		outputDto.direct_message = [];

		for (const obj of msg) {
			let dto = new OutputDirectMessageDto();
			dto.msg_id = obj.id;
			dto.content = obj.content;
			dto.imgUrl = obj.img_url;
			dto.user_nickname = obj.user_nickname;
			dto.date = obj.createdAt;
			outputDto.direct_message.push(dto);
		}
		return outputDto;
	}
}
