export default function Rank({rank}: {rank: string}): JSX.Element {
	return (
		<div className='p-2 h-100'>
			<img className='img-fluid h-100' src={rank} alt={`Foto do rank da pessoa`} />
		</div>
	)
}
