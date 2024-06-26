import { useState } from "react";
import { IconType } from "react-icons";
import InputButton from "./InputButton";

type buttonConfigurationProps = {
	Icon: IconType;
	content: string;
	function: (event: React.KeyboardEvent<HTMLInputElement>) => Promise<void>;
}

export default function Buttons(props: buttonConfigurationProps) : JSX.Element {
	const [showInput, setShowInput] = useState<boolean>(false);
	return (
		<>
		<h5 className="p-2 hover" onClick={() => setShowInput(!showInput)}>
			<props.Icon className="foto-list-friends bg-light text-black me-3 p-1" size={30} />
			{props.content}
		</h5>
		{showInput ? <InputButton function={props.function} placeholder={props.content}/> : null}
		</>
	)
}
