import Button from "./Button";
import { MdOutlinePersonAddDisabled, MdDeleteSweep } from 'react-icons/md';
import { AiOutlineUserAdd } from 'react-icons/ai';
import { GiBroadDagger } from 'react-icons/gi';
import { MdBlock } from "react-icons/md";
import axios from "axios";
import { FormEvent, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { ChatContext } from "../ChatPublic";
import AlterPassword from "./AlterPassword";
import GetUsersGame from "./GetUsersGame";
import { UserData, socket } from "../../../InitialPage/Contexts/Contexts";
import ButtonTime from "./KickMember";
import { IoIosRemoveCircleOutline } from "react-icons/io";


type UsersGame = {
	id: string;
	nickname: string;
	avatar: string;
	is_active: boolean;
}

export default function AllButtons(): JSX.Element {
	const { chatData: { name, id } } = useContext(ChatContext);
	const dataUser = useContext(UserData).user;
	const [playersGame, setPlayersGame] = useState<UsersGame[]>([]);

	useEffect(() => {
		GetUsersGame().then((res) => {
			setPlayersGame(res);
		})
	}, [])

	const getUserId = (nickname: string): string => {
		if (!playersGame) return ''
		const getDataNickname = playersGame.find((user) => user.nickname === nickname) || '';
		return getDataNickname ? getDataNickname.id : ''
	}

	const addedNewMember = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key !== 'Enter') return;
		const userId = getUserId(event.currentTarget.value);
		if (userId) {
			let obj = {
				my_id: dataUser.id,
				other_id: userId,
				chat_name: name,
				chat_id: id,
			}
			socket.emit('add-member-group', obj);
		}
	}

	const addAdm = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key !== 'Enter') return;
		const userId = getUserId(event.currentTarget.value);
		if (userId) {
			if (userId) {
				let obj = {
					my_id: dataUser.id,
					other_id: userId,
					chat_name: name,
					chat_id: id,
				}
				socket.emit('add-adm-group', obj);
			}
		}
	}

	const removedAdm = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key !== 'Enter') return;
		const userId = getUserId(event.currentTarget.value);
		if (userId) {
			let obj = {
				my_id: dataUser.id,
				other_id: userId,
				chat_name: name,
				chat_id: id,
			}
			socket.emit('remove-adm-group', obj);
		}
	}

	const banMember = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key !== 'Enter') return;
		const userId = getUserId(event.currentTarget.value);

		console.log("BanMember: ");
		if (userId) {
			let obj = {
				my_id: dataUser.id,
				other_id: userId,
				chat_name: name,
				chat_id: id,
			}
			console.log("obj: ", obj);
			socket.emit('ban-member-group', obj);
		}
	}

	const deleteChat = (event: React.KeyboardEvent<HTMLInputElement>): void => {
		if (event.key !== 'Enter') return;
		if (event.currentTarget.value !== name) return;
		let obj = {
			my_id: dataUser.id,
			chat_name: name,
			password: event.currentTarget.value,
			chatId: id,
		}
		console.log(obj);
		socket.emit('delete-group', obj);
	}

	const removePassword = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key !== "Enter") return;
		console.log(event.currentTarget.value)
		axios.post(`${process.env.REACT_APP_HOST_URL}/chatroom/remove-password-group`, {
			chat_name: name,
			password: event.currentTarget.value,
		}, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420"
			}
		}).then((res) => {
			console.log("Resposta alter senha: ", res.data);
		}).catch((err) => {
			console.log("Resposta alter Error: ", err);
		})

	}
	const changePassword = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);
		axios.post(`${process.env.REACT_APP_HOST_URL}/chatroom/change-password-group`, {
			chat_name: name,
			old_password: form.get('password'),
			new_password: form.get('newPassword'),
			confirm_password: form.get('confirmNewPassword'),
		}, {
			headers: {
				Authorization: Cookies.get("jwtToken"),
				"ngrok-skip-browser-warning": "69420"
			}
		}).then((res) => {
			console.log("Resposta alter senha: ", res.data);
		}).catch((err) => {
			console.log("Resposta alter Error: ", err);
		})
	}
	return (
		<div className="p-3 text-start position-relative">
			<Button
				Icon={AiOutlineUserAdd}
				content="Adicionar Pessoas"
				function={addedNewMember}
			/>
			<Button
				Icon={GiBroadDagger}
				content="Adicionar Administrador"
				function={addAdm}
			/>
			<Button
				Icon={GiBroadDagger}
				content="Remover Administrador"
				function={removedAdm}
			/>
			<Button
				Icon={MdOutlinePersonAddDisabled}
				content="Banir Tripulante"
				function={banMember}
			/>
			<ButtonTime
				Icon={MdBlock}
				content="Chutar Tripulante"
				getUserId={getUserId}
				my_id={dataUser.id}
				chat_name={name}
				chat_id={id}
				id={"kick"}
				route="kick-member-group"
			/>

			<AlterPassword funcChange={changePassword} />
			<Button
				Icon={MdDeleteSweep}
				content="Apagar Grupo"
				function={deleteChat}
			/>

			<Button
				Icon={IoIosRemoveCircleOutline}
				content="remover senha"
				function={removePassword}
			/>

		</div>
	)
}
//TODO: Alter password Bug
