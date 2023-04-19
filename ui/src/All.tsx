import {useState} from 'react'
import './App.css'
import {getByName, savePokemon} from "./requests";

const All = () => {
    const [cards, setCards] = useState([]);
    const [name, setName] = useState("");

    const fetchCards = async (event: any) => {
        if (event != null) {
            event.preventDefault();
        }

        if (name != "") {
            const response = await getByName(name);
            setCards(response.data);
        }
    };

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

            <div>
                {cards.map((card, index) => (
                    <span style={{position: "relative"}}>
                        <button style={{position: "absolute", transform: "translate(319%, 555%)"}}>&#8661;</button>
                        <button style={{position: "absolute", transform: "translate(300%, 660%)"}}>&#43;</button>
                        <img className={card['missing'] ? 'missing' : ''}
                             key={index}
                             src={card['images']['small']}
                             alt={card['name']}
                             width="200"
                             height="300"
                             onClick={async () => {
                                 await savePokemon(card);
                                 fetchCards(null);
                             }}
                        /></span>
                ))}
            </div>
        </div>
    );
}

export default All;