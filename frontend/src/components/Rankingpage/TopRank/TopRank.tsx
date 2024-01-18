import axios from "axios"
import Cookies from "js-cookie"
import React, { useEffect, useState } from "react"
import AvatarAndUser from "./AvatarAndUser"
import Score from "./Score"

export type typeRaking = {
	id: string
	avatar: string
	nickname: string
	points: number,
	draws: number,
	ladder: number,
	loses: number,
	matches: number,
	wins: number,
}

export default function TopRank() {
	const [ranking, setRanking] = useState<typeRaking[]>([])

	function getRanking() {
		axios.get('https://990d-187-62-198-223.ngrok-free.app/users/ladder', {
			headers: {
				Authorization: Cookies.get('jwtToken'),
				"ngrok-skip-browser-warning": "69420"
			}, timeout: 5000
		}).then((res) => {
			setRanking(res.data)
		}
		)
	}
	useEffect(() => {
		getRanking()
	}, [])

	let itemsCenter = "row g-0 h-100 d-flex align-items-center justify-content-center"

	const cssDivRanking: React.CSSProperties = {
		// backgroundColor: '#7cdedb',
		backgroundColor: '#684640',
		// backgroundColor: 'transparent',
		height: '4rem',
		// 4c264b
	}
	return (
		<>
			{ranking.map((user, index) => (
				<div className="row g-0 text-center shadow-grounps p-1 mt-2 fw-bold" key={user.id} style={cssDivRanking}>
					<div className="col-5 h-100">
						<div className={itemsCenter}>
							<div className="col-2">
								<p>{index + 1}</p>
							</div>
							<div className="col-10 h-100 p-1">
								<AvatarAndUser avatarUrl={user.avatar}
									nickname={user.nickname}
								/>
							</div>
						</div>
					</div>

					<div className="col-2"></div>

					<div className="col-5 h-100">
						<div className={itemsCenter}>
							<div className="col-10 h-100">
								<Score statusPart={user} />
							</div>
							<div className="col-2 h-100 d-flex">
								<p className="m-auto">100</p>
							</div>
						</div>
					</div>
				</div>
			))}
		</>
	)
}
