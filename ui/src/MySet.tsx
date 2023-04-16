import {useEffect, useState} from 'react'
import './App.css'
import axios from "axios";

const MySet = () => {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        fetchCards();
    }, []);

    const fetchCards = async () => {
        const response = await axios.get("http://localhost:3000/mySet/");
        setCards(response.data);
    }

    return (
        <div>
            <h1>Kolekcja</h1>

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