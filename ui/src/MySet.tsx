import {useEffect, useState} from 'react'
import './App.css'
import {deletePokemon, getCard} from "./requests";

const MySet = () => {
    const [cards, setCards] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchCards(null, "");
    }, []);

    const fetchCards = async (event: any, filterName: string) => {
        if (event != null) {
            event.preventDefault();
        }
        setName(filterName);
        const response = await getCard(filterName);
        setCards(response.data);
    }

    return (
        <div>
            <h1>Kolekcja</h1>
            <label>
                Nazwa karty:
                <input type="text" value={name} onChange={(event) => fetchCards(event, event.target.value)}/>
            </label>
            <div className="gallery">
                {cards.map((card, index) => (
                    <img
                        key={index}
                        src={card['images']['small']}
                        alt={card['name']}
                        width="200"
                        height="300"
                        onClick={async () => {
                            await deletePokemon(card);
                            fetchCards(null, name);
                        }}
                    />
                ))}
            </div>
        </div>
    );
}

export default MySet;