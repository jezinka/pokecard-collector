import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

const Difference = () => {
    const [cards, setCards] = useState([]);
    const [cardset, setCardset] = useState("");
    const [cardsets, setCardsets] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);

    const fetchCards = async (event: any) => {
        event.preventDefault();
        if (cardset != "") {
            const response = await axios.get(
                "http://localhost:3000/all/" + cardset
            );
            setCards(response.data);
        }
    };

    const fetchCardsets = async () => {
        const response = await axios.get(
            "http://localhost:3000/cardset/"
        );
        setCardsets(response.data);
        setCardset(response.data[0].substring(0, response.data[0].indexOf(";")))
    };

    return (
        <div>
            <h1>Różnica</h1>
            <form onSubmit={fetchCards}>
                <label>
                    Nazwa zestawu:
                    <select value={cardset} onChange={(event) => setCardset(event.target.value)}>
                        {cardsets.map((c:string) => {
                            return <option key={c.substring(0, c.indexOf(";"))} value={c.substring(0, c.indexOf(";"))}>{c.substring(c.indexOf(";")+1)}</option>
                        })}
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
            <div className="gallery">
                {cards.map((card, index) => (
                    <img className={card['missing'] ? 'missing' : ''}
                        key={index}
                        src={card.images.small}
                        alt={card.name}
                        width="200"
                        height="300"
                    />
                ))}
            </div>
        </div>
    );
}

export default Difference;