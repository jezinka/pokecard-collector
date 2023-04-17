import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

const MySet = () => {
    const [cards, setCards] = useState([]);
    const [name, setName] = useState("");

    useEffect(() => {
        fetchCards(null);
    }, []);

    const fetchCards = async (event:any) => {
        if(event != null) {
            event.preventDefault();
        }
        const response = await axios.get("http://localhost:3000/mySet/" + name);
        setCards(response.data);
    }

    return (
        <div>
            <h1>Kolekcja</h1>
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
                    />
                ))}
            </div>
        </div>
    );
}

export default MySet;