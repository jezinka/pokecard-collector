import {useEffect, useState} from 'react'
import './App.css'
import {fetchAllCardsets, getDifferenceByCardset, savePokemon} from "./requests";

const Difference = () => {
    const [cards, setCards] = useState([]);
    const [cardset, setCardset] = useState("");
    const [cardsets, setCardsets] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);

    const fetchCards = async (event: any) => {
        if (event != null) {
            event.preventDefault();
        }

        if (cardset != "") {
            const response = await getDifferenceByCardset(cardset);
            setCards(response.data);
        }
    };

    const fetchCardsets = async () => {
        const response = await fetchAllCardsets();
        setCardsets(response.data);
        setCardset(getId(response.data[0]));
    };

    function getId(c: string) {
        return c.substring(0, c.indexOf(";"));
    }

    return (
        <div>
            <h1>Różnica</h1>
            <form onSubmit={fetchCards}>
                <label>
                    Nazwa zestawu:
                    <select value={cardset} onChange={(event) => setCardset(event.target.value)}>
                        {cardsets.map((c: string) => {
                            let id = getId(c);
                            return <option key={id} value={id}>{c.substring(c.indexOf(";") + 1)}</option>
                        })}
                    </select>
                </label>
                <button type="submit">Submit</button>
            </form>
            <div className="gallery">
                {cards.map((card, index) => (
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
                    />
                ))}
            </div>
        </div>
    );
}

export default Difference;