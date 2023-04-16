import React from "react"
import BookCard from "../components/Card/Card.component"
import moment from "moment"

function Home({ data: sheets }) {
	return (
		<>
			{sheets &&
				sheets.map(row => (
					<BookCard
						key={row.isbn}
						userId={row.userId}
						isbn={row.isbn}
						title={row.title}
						author={row.author}
						genre={row.genre}
						pbDate={moment(row.pbDate).format("LL")}
						desc={row.desc}
						nbPage={row.nbPage}
						bkInStck={row.bkInStck}
						price={row.price.$numberDecimal}
						isAvble={row.isAvble}
					/>
				))}
		</>
	)
}

export async function getServerSideProps() {
	const data = await fetch("http://localhost:4898/api/books/all").then(res =>
		res.json().then(result => {
			return result
		}),
	)
	return { props: { data } }
}

export default Home
