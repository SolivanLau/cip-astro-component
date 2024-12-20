import { useState } from "react";
const Counter = () => {
	const [count, setCount] = useState(0);

	return (
		<section>
			<h2>Count: {count}</h2>
			<p>I am built with react - try adjusting the count!</p>
			<button
				className="button button--default button--primary"
				onClick={() => setCount(count + 1)}
			>
				Increment
			</button>
			<button
				className="button button--default button--secondary"
				onClick={() => setCount(count - 1)}
			>
				Decrement
			</button>
		</section>
	);
};
export default Counter;
