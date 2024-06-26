import { IsNotEmpty, IsString, ValidateIf } from "class-validator";

export class CreateDirectChatroomDto {
	@IsNotEmpty({message: 'Nickname can not be empty.'})
	my_nickname:		string;

	@IsNotEmpty({message: 'Nickname can not be empty.'})
	other_nickname:		string;
}

export class CreateDirectMessageDto {

	@IsNotEmpty({message: 'content can not be empty.'})
	@IsString({message: 'content has to be a string.'})
	content:			string;

	@IsNotEmpty({message: 'my_nickname can not be empty.'})
	my_nickname:		string;

	@IsNotEmpty({message: 'other_nickname can not be empty.'})
	other_nickname:		string;
}

export class CreateChatroomDto {
	@IsNotEmpty({message: 'My id can not be empty.'})
	my_id:			string;
	
	@IsString({message: 'Chatroom name must be a string.'})
	@IsNotEmpty({message: 'Chatroom name can not be empty.'})
	name:			string;

	@IsString()
	type:			string;

	@ValidateIf(o => o.password != null)
	@IsString()
	password:		string;

	@IsString()
	photoUrl:		string;
}

export class ChangePasswordDto {
	@IsNotEmpty({message: 'chat_name can not be empty.'})
	chat_name:			string;

	@IsNotEmpty({message: 'old_password can not be empty.'})
	old_password:		string;

	@IsNotEmpty({message: 'new_password can not be empty.'})
	new_password:		string;

	@IsNotEmpty({message: 'confirm_password can not be empty.'})
	confirm_password:	string;
}

export class RemovePasswordDto {
	@IsNotEmpty({message: 'chat_name can not be empty.'})
	chat_name:			string;

	@IsNotEmpty({message: 'old_password can not be empty.'})
	password:		string;
}

export class AddChatUserDto {
	@IsNotEmpty({message: 'User id can not be empty.'})
	add_id:			string;

	@IsNotEmpty({message: 'Add: Chatroom name can not be empty.'})
	chat_name:		string;

}

export class InputChatroomDto {
	@IsNotEmpty({message: 'Create: Chatroom name can not be empty.'})
	chat_name:			string;

	@ValidateIf(o => o.password != null)
	@IsString()
	password:		string;
}

export class DeleteChatroomDto {
	@IsNotEmpty({message: 'My id can not be empty.'})
	my_id:			string;

	@IsNotEmpty({message: 'Delete: Chatroom id can not be empty.'})
	chatId:			string;
	
	@IsNotEmpty({message: 'Delete: Chatroom name can not be empty.'})
	chat_name:			string;

	@ValidateIf(o => o.password != null)
	@IsString()
	password:		string;
}

export class InputChatroomMessageDto {
	@IsNotEmpty({message: 'Message: Content can not be empty.'})
	content:		string;

	@IsNotEmpty({message: 'Message: Chatroom id can not be empty.'})
	chatId:			string;

	@IsNotEmpty({message: 'Message: User id can not be empty.'})
	user_id:		string;

	@IsNotEmpty({message: 'Message: Chatroom name can not be empty.'})
	chat_name:		string;
}

export class InputOpenChatroomDto {
	@IsNotEmpty({message: 'Open: Chatroom id can not be empty.'})
	chatId:			string;
}

export class WebsocketDto {
	@IsNotEmpty({message: 'My id can not be empty.'})
	my_id:			string;

	@IsNotEmpty({message: 'ban id can not be empty.'})
	other_id:			string;

	@IsNotEmpty({message: 'WebSocket: Chatroom name can not be empty.'})
	chat_name:		string;

	@IsNotEmpty({message: 'WebSocket: Chatroom id can not be empty.'})
	chat_id:		string;
}

export class WebsocketWithTimeDto {
	@IsNotEmpty({message: 'My id can not be empty.'})
	my_id:			string;

	@IsNotEmpty({message: 'ban id can not be empty.'})
	other_id:			string;

	@IsNotEmpty({message: 'WebSeocket w: Chatroom name can not be empty.'})
	chat_name:		string;

	@IsNotEmpty({message: 'WebSeocket w: Chatroom id can not be empty.'})
	chat_id:		string;

	@IsNotEmpty({message: 'Time can not be empty.'})
	time:			number;
}



