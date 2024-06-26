import { Module } from '@nestjs/common';
import { ChatroomService } from './chatroom.service';
import { ChatroomController } from './chatroom.controller';
import { ChatroomRepository } from './chatroom.repository';
import { UsersRepository } from 'src/users/users.repository';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/database/prisma.service';
import { GameService } from 'src/game/game.service';
import { GameRepository } from 'src/game/game.repository';
import { ChatroomGateway } from './websocket.controller';
import { JogoService } from 'src/game/jogo/game.jogo.service';

@Module({
  controllers: [ChatroomController ],
  providers: [JogoService, ChatroomService, ChatroomRepository, UsersService, UsersRepository, PrismaService, GameService, GameRepository, ChatroomGateway]
})
export class ChatroomModule {}
