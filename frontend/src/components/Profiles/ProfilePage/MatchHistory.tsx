import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

type MatchHistoryType = {
	id: string;
	opponent_avatar: string;
	opponent: string;
	my_score: number;
	opponent_score: number;
	status: string;
};

export default function MatchHistory() {
	const [matchHistory, setMatchHistory] = useState<MatchHistoryType[]>([]);

	useEffect(() => {
		axios.get('http://localhost:3000/game/user/match-history', {
			headers: {
				Authorization: Cookies.get('jwtToken'),
			}
		}).then((response) => {
			setMatchHistory(response.data.matches);
		}).catch((error) => {
		})
	}, []);

	if (!matchHistory) {
		return (
			<div className='d-flex p-2 text-center'>
				<p>Você não possui nenhuma partida no momento</p>
			</div>
		)
	}
	return (
		<div>
			{matchHistory.map((match: MatchHistoryType) => {
				return (
					<div className='d-flex p-2 justify-content-between hover text-center' key={match.id}>
						<img className='img-fluid rounded-circle' src={match.opponent_avatar} alt={`avatar do ${match.opponent} `} />
						<div className='fs-5 col-3'>
							<p>Oponente</p>
							<p>{match.opponent}</p>
						</div>
						<div className='fs-5 fw-bold col-2'>
							<p>HISTORY</p>
							<p>{`${match.opponent_score} X ${match.my_score}`}</p>
						</div>
						<p className='letter-pixel fs-1 derrota'>{match.status}</p>
					</div>
				)
			})}
		</div>
	);
}