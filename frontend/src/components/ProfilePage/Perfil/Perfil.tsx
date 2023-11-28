import axios from 'axios';
import Cookies from 'js-cookie';
import Profile from './Image';
import { useContext, useEffect, useState } from 'react';
import rank1 from '../../../static/rankLevel/rank1.png';
import rank2 from '../../../static/rankLevel/rank2.png';
import rank3 from '../../../static/rankLevel/rank3.png';
import rank4 from '../../../static/rankLevel/rank4.png';
import rank5 from '../../../static/rankLevel/rank5.png';
import rank6 from '../../../static/rankLevel/rank6.png';
import Rank from './rank';
import Pointer from './pontos';
import { DataUser } from '../../InitialPage/InitialPage';

type infosUserPerfil = {
	nickname: string;
	wins: number;
	draws: number;
	loses: number;
	avatar: string;
}

const rankMappings = [
	{ max: 5, rank: rank1, borderImg: 'mt-5 borderDivFotoRank1 d-flex', borderWrite: 'd-flex borderWriteRank1 w-100 justify-content-center align-items-center w-100' },
	{ max: 10, rank: rank2, borderImg: 'mt-5 borderDivFotoRank2 d-flex', borderWrite: 'd-flex borderWriteRank2 w-100 justify-content-center align-items-center pb-5' },
	{ max: 15, rank: rank3, borderImg: 'mt-5 borderDivFotoRank3 d-flex', borderWrite: 'd-flex borderWriteRank3 w-100 justify-content-center align-items-center w-100' },
	{ max: 20, rank: rank4, borderImg: 'mt-5 borderDivFotoRank4 d-flex', borderWrite: 'd-flex borderWriteRank4 w-100 justify-content-center align-items-end pb-5 w-100' },
	{ max: 25, rank: rank4, borderImg: 'mt-5 borderDivFotoRank4 d-flex', borderWrite: 'd-flex borderWriteRank4 w-100 justify-content-center align-items-end pb-5 w-100' },
	{ max: 30, rank: rank4, borderImg: 'mt-5 borderDivFotoRank4 d-flex', borderWrite: 'd-flex borderWriteRank4 w-100 justify-content-center align-items-end pb-5 w-100' },
	{ max: 35, rank: rank5, borderImg: 'mt-5 borderDivFotoRank5 d-flex', borderWrite: 'd-flex borderWriteRank4 w-100 justify-content-center align-items-end pb-5 w-100' },
	{ max: Infinity, rank: rank6, borderImg: 'mt-5 borderDivFotoRank6 d-flex', borderWrite: 'd-flex borderWriteRank4 w-100 justify-content-center align-items-end pb-5 w-100' },
];

type formattingRankUser = {
	rank: string;
	borderImg: string;
	borderWrite: string;
}

export default function InformationsUser() {
	const [user, setInfosUser] = useState<infosUserPerfil>({} as infosUserPerfil);
	const dataUser = useContext(DataUser);

	const handleRank = (pointers: number): formattingRankUser => {
		return rankMappings.find((item) => pointers <= item.max) ||
			rankMappings[rankMappings.length - 1];
	}

	const getProfile = (): void => {
		axios.get('http://localhost:3000/users/profile ', {
			headers: {
				Authorization: Cookies.get('jwtToken'),
			}
		})
			.then((response) => {
				setInfosUser(response.data);
			}
			).catch((error) => {
			})
	}

	let pointers: number = user.wins - user.loses;
	let maping: formattingRankUser = handleRank(pointers);

	useEffect(() => {
		getProfile();
	}, []);

	const { rank, borderImg, borderWrite } = maping;
	let aux = user.wins + user.draws;
	let kda: number = aux === 0 ? user.loses : aux / user.loses;
	return (
		<div className='text-center text-white'>
			<Profile
				borderImg={borderImg}
				avatar={dataUser.user._avatar}
				nickname={dataUser.user._nickname}
			/>
			<div className='d-flex flex-column align-items-center'>
				<Rank rank={rank} />
				<Pointer
					wins={user.wins}
					loses={user.loses}
					draws={user.draws}
					kda={kda}
					borderWrite={borderWrite}
					pointers={pointers}
				/>
			</div>
		</div>
	);
}