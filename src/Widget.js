import { useState } from 'react';

import './Widget.scss';

export default function Widget({ title, children }) {
	const [ show, setShow ] = useState(true);

	return (
		<div className="widget">
			<header>
				<div className="title">{title}</div>
				<div className={`expandCollapse ${show ? 'collapse' : 'expand'}`} onClick={() => setShow(!show)}></div>
			</header>
			{show && (
				<div className="content">
					{children}
				</div>
			)}
		</div>
	);
}