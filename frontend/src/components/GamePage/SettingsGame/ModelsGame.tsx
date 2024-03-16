import ButtonModelsGame from "./ButtonModelsGame";
import playPong from '../../../assets/settingsGame/playPong.jpg'
import playSpecialPong from '../../../assets/settingsGame/playSpecialPong.jpg'
import bgFire from "../../../assets/game/planets/backgrounds/bgFire.jpg";

export default function ModelsGame(): JSX.Element {

	const cssDivFilhoSelectGame: React.CSSProperties = {
		position: 'relative',
		zIndex: 2,

		backgroundColor: '#ed9121',
		borderRadius: '1rem',
		boxShadow: '1px 2px 2px black inset, 0px -2px 2px #FFF inset',
		opacity: '1 !important',
		backgroundImage: `url(${bgFire})`,
		backgroundSize: 'cover',
	}

	return (
		<div style={cssDivFilhoSelectGame}>
			<div className="d-flex p-3" id='divOptionsStartGame'>
				<ButtonModelsGame
					photo={playPong}
					model="Normal"
					isRanking={false}
				/>
				<ButtonModelsGame
					photo={playPong}
					model="Ranqueado"
					isRanking={true}
				/>
				<ButtonModelsGame
					photo={playPong}
					model="VS COOP"
				/>
			</div>
			<div className="d-flex p-3">
				<ButtonModelsGame
					photo={playSpecialPong}
					model="Normal"
				/>
				<ButtonModelsGame
					photo={playSpecialPong}
					model="Ranqueado"
				/>
				<ButtonModelsGame
					photo={playSpecialPong}
					model="VS COOP"
				/>
			</div>
		</div>
	)
}
