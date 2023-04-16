import {useState} from 'react'
import './App.css'
import axios from "axios";

const All = () => {
    const [cards, setCards] = useState([]);
    const [name, setName] = useState("");

    const fetchCards = async (event: any) => {
        event.preventDefault();
        if (name != "") {
            const response = await axios.get(
                "http://localhost:3000/pokemonCards/" + name
            );
            setCards(response.data.data);
        }
    };

    const addPokemon = async (card: any) => {
        const response = await axios.post(
            "http://localhost:3000/addPokemon/", card
        );
        if (response) {
            console.log(`zapisano - ${card.name}`);
        }
    };

    function savePokemon(card: any) {
        addPokemon(card);
    }

    return (
        <div>
            <h1>Pokemon Cards Gallery</h1>
            <form onSubmit={fetchCards}>
                <label>
                    Nazwa karty:
                    <input type="text" value={name} onChange={(event) => setName(event.target.value)}/>
                </label>
                <button type="submit">Submit</button>
            </form>

            <div className="gallery">
                {cards.map((card, index) => (
                    <img
                        key={index}
                        src={card.images.small}
                        alt={card.name}
                        width="200"
                        height="300"
                        onClick={() => savePokemon(card)}
                    />
                ))}
            </div>
        </div>
    );
}

export default All;