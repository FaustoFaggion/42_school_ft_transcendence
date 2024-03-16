import { UserData } from '../../../InitialPage/Contexts/Contexts';
import { FormEvent, useContext, useState } from 'react';
import IdentifyInputName from "./IdentifyInputName";
import InputEditName from "./InputEditName";
import FolderSettingsGame from "./Folder";
import AudioRanger from "./AudioRanger";
import ButtonsConf from "./ButtonsConf";
import './animationEditInputName.css';
import Cookies from "js-cookie";
import axios from "axios";
import ButtonEdit from './ButtonsEdit';
import { IoIosClose } from "react-icons/io";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useEffect } from 'react';

type propsConfigurationGame = {
	closed: React.Dispatch<React.SetStateAction<boolean>>;
}

type infoUpdate = {
	nick_name: string,
	avatar: string,
	twoFA: boolean,
}

export default function ConfigurationGame(props: propsConfigurationGame): JSX.Element {
	const [handleOption, setHandleOption] = useState<boolean>(false);
	const [QRCODE, setQRCODE] = useState<string>('');
	const [show, setShow] = useState(false);
	const userData = useContext(UserData);

	const handleShow = () => {
		const checkbox = document.querySelector('#flexSwitchCheckDefault') as HTMLInputElement;
		if (!checkbox || !checkbox.checked) {
			return axios.post(`${process.env.REACT_APP_HOST_URL}/2FA/clear`, {}, {
				headers: {
					Authorization: Cookies.get('jwtToken'),
					"ngrok-skip-browser-warning": "69420"
				},
			}).then((res) => {
				setTfaEnabled(false);
			}).catch((err) => {
				console.log(err);
			})
		}
		getQRCODE();
		setShow(true);
	}

	useEffect(() => {
		verifyEnabled();
	}, []);

	function sendInfosUserBack(info: infoUpdate) {
		if (userData.user.twoFA === false && info.twoFA === true) {
			getQRCODE();
		}

		axios.post(`${process.env.REACT_APP_HOST_URL}/users/updateProfile`, info, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}
		}).then((res) => {
			setHandleOption(!handleOption);
			userData.updateDataUser();
		}).catch((err) => {

		})
	}

	const editProfile = (event: FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		const form = new FormData(event.currentTarget);

		// Verifique se o arquivo está sendo recuperado corretamente
		const avatarFile = form.get('avatar') as File;

		// Tente enviar FormData diretamente
		axios.post(`${process.env.REACT_APP_HOST_URL}/users/upload-avatar`, form, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420",
				'Content-Type': 'multipart/form-data' // Defina o tipo de conteúdo como multipart/form-data
			}
		}).then((res) => {
			userData.updateDataUser();
		}).catch((err) => {
			console.log(err);
		});
	};


	const getCorrectDiv = (isEditing: boolean) => {
		if (isEditing) return <InputEditName />
		return (
			<IdentifyInputName
				_avatar={userData.user.avatar}
				_nickname={userData.user.nickname}
			/>
		)
	}

	const getCorrectButton = (isEditing: boolean) => {
		if (isEditing) {
			return <ButtonEdit setEditProfile={setHandleOption} />
		}
		return (
			<ButtonsConf
				addedInputNameDef180={() => { setHandleOption(!handleOption) }}
				content='Edit'
			/>
		)
	}

	const getQRCODE = () => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/2FA`, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}
		}).then((res) => {
			setQRCODE(res.data);
		}).catch((err) => {
			console.log(err);
		})
	}

	const verifyTwoFA = () => {
		let token = document.getElementById('input-token') as HTMLInputElement;
		if (token.value === '') {
			return;
		}
		console.log("Verificando 2FA");
		axios.post(`${process.env.REACT_APP_HOST_URL}/2FA/validate`, {
			token: token.value,
		}, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			},
			timeout: 10000,
		}).then((res) => {
			if (res.data === true) {
				setTfaEnabled(true);
				setShow(false);
			}
		}).catch((err) => {
			console.log(err);
		});
	}

	const [tfaEnabled, setTfaEnabled] = useState<boolean>(userData.user.twoFA);
	const verifyEnabled = () => {
		axios.get(`${process.env.REACT_APP_HOST_URL}/2FA/verifyStatus`, {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			},
		}).then((res) => {
			console.log(res);
			setTfaEnabled(res.data);
		}).catch((err) => {
			console.log(err);
		})
	}

	return (
		<div className='position-fixed top-50 start-50 translate-middle p-2 rounded'
			style={{ backgroundColor: '#653b1e', width: '600px' }}
		>
			<IoIosClose
				size={30}
				onClick={() => props.closed(false)}
				className='position-absolute top-0 end-0 m-2 cursor-pointer'
				type='button'
			/>
			<h2 className='text-center text-white'>Game Settings</h2>
			<div className='bg-white rounded p-5'>
				<form onSubmit={editProfile}>
					<div className='div-nickname'>
						{getCorrectDiv(handleOption)}
					</div>
					<div className="d-flex justify-content-center">
						{getCorrectButton(handleOption)}
					</div>
					<AudioRanger />
					<div className="d-flex form-check form-switch">
						<input
							className="form-check-input me-2"
							type="checkbox"
							id="flexSwitchCheckDefault"
							onClick={handleShow}
							checked={tfaEnabled}
						/>
						<label className="ms-4 form-check-label text-black" htmlFor="flexSwitchCheckDefault">Habilitar a atutenticação de 2 fatores?</label>
					</div>
				</form>
			</div>

			<Modal show={show} onHide={() => setShow(false)}>
				<Modal.Header closeButton>
					<Modal.Title>Habilitar Two Factor Authenticator</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<div className='d-flex justify-content-center'>
						<img src={QRCODE} alt="QRCODE para autenticação 2FA" />
					</div>
					<input id='input-token' type="text" className="form-control" placeholder="Digite o codigo de verificação" aria-label="Recipient's username" aria-describedby="basic-addon2" />
				</Modal.Body>
				<Modal.Footer>
					<Button variant="secondary" onClick={() => setShow(false)}>
						Fechar modal
					</Button>
					<Button variant="primary" onClick={verifyTwoFA}>
						Salvar alterações
					</Button>
				</Modal.Footer>
			</Modal>

			<FolderSettingsGame />
		</div>
	)
}
