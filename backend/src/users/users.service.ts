import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { UsersRepository } from './users.repository';
import { userInfo } from 'os';
import { AuthService } from 'src/auth/auth.service';
import { UserResumeDto, OutputUsersResumeDto, UserProfileDto } from './dtos/output.dtos';
import { CreateUserDto } from './dtos/createUser.dto';
import { GameService } from 'src/game/game.service';
import { AddFriendDto } from './dtos/input.dtos';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository,
              private readonly gameService: GameService) {}

  
  async createUser(dto: CreateUserDto): Promise<User> {
    return await this.userRepository.createUser(dto);
  }
  
  async addFriend(userId: string, nick_name: AddFriendDto): Promise<User[]> {
    let status = await this.userRepository.addFriend(userId, nick_name);

    return await this.getFriends(userId);
  }

  async deleteFriend(userId: string, nick_name: AddFriendDto): Promise<User[]> {
    let status =  await this.userRepository.deleteFriend(userId, nick_name);
  
    return await this.getFriends(userId);
  }

  async findUserAuth(userEmail: string): Promise<User> {
    return await this.userRepository.findUserAuth(userEmail);
  }

  async findUser(userId: string): Promise<User> {
    return await this.userRepository.findUser(userId);
  }
  
  async getFriends(userId: string): Promise<User[]> {
    let response = await this.userRepository.findUserWithFriends(userId);
    return response.friends;
  }

  async findOnlineUsers(userId: string): Promise<any> {
    console.log(userId);
    let response = await this.userRepository.findOnlineUsers(userId);

    // let onlineUsersDto = new OnlineUsersDto();
    // onlineUsersDto._avatar = response.
    console.log("REsponse:", response);
    return response;
  }

  async findProfile(userId: string): Promise<UserProfileDto> {

    let user = await this.userRepository.findUser(userId);
    let wins = await this.gameService.numberOfUserMatchWins(userId);
    let loses = await this.gameService.numberOfUserMatchLoses(userId);
    let draws = await this.gameService.numberOfUserMatchDraws(userId);
    

    let userProfileDto = new UserProfileDto();
    userProfileDto._login = user.login;
    userProfileDto._avatar = user.avatar;
    userProfileDto._first_name = user.first_name;
    userProfileDto._last_name = user.last_name;
    userProfileDto._nickname = user.nickname;
    userProfileDto._wins = wins;
    userProfileDto._loses = loses;
    userProfileDto._draws = draws;

    return userProfileDto;
  }

}
