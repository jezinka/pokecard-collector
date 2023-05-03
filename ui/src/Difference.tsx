import {useEffect, useState} from 'react'
import './App.css'
import {fetchAllCardsets, getDifferenceByCardset, savePokemon} from "./requests";

const Difference = () => {
    const [cards, setCards] = useState([]);
    const [serie, setSerie] = useState("test");
    const [cardset, setCardset] = useState("");
    const [cardsets, setCardsets] = useState([]);
    const [filteredCardsets, setFilteredCardsets] = useState([]);
    const [series, setSeries] = useState([]);

    useEffect(() => {
        fetchCardsets();
    }, []);


    useEffect(() => {
        if (filteredCardsets.length > 0) {
            setCardset(filteredCardsets[0]['id']);
        }
    }, [filteredCardsets])

    useEffect(() => {
        fetchCards()
    }, [cardset]);

    useEffect(() => {
            if (series.length > 0) {
                setSerie(series[0]['name']);
            }
        },
        [series]);

    useEffect(() => {
        const foundSerie = series.find(s => s['name'] == serie);
        if (foundSerie != undefined) {
            const ids: object[] = foundSerie['id'];
            setFilteredCardsets(cardsets.filter(c => ids.indexOf(c['id']) != -1));
        }
    }, [serie])

    const fetchCards = async () => {
        if (cardset != "") {
            const response = await getDifferenceByCardset(cardset);
            setCards(response.data);
        }
    };

    const fetchCardsets = async () => {
        const response = await fetchAllCardsets();
        setSeries(response.data['series']);
        setCardsets(response.data['cardsets']);
    };

    return (
        <div>
            <h1>Różnica</h1>
            <label>
                Nazwa serii:
                <select value={serie} onChange={(event) => {
                    setSerie(event.target.value);
                }}>
                    {series.map((s: any) => {
                        let id = s['name'];
                        return <option key={id} value={id}>{s['name']} [{s['count']}/{s['total']}]</option>
                    })}
                </select>
            </label>

            <label>
                Nazwa zestawu:
                <select value={cardset} onChange={(event) => {
                    setCardset(event.target.value);
                }}>
                    {filteredCardsets.map((c: any) => {
                        let id = c['id'];
                        return <option key={id} value={id}>{c['name']} [{c['count']}/{c['total']}]</option>
                    })}
                </select>
                <img
                    width="30"
                    height="30"
                    src={`https://images.pokemontcg.io/${cardset}/symbol.png`}/>
            </label>
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
                             fetchCards();
                         }}
                    />
                ))}
            </div>
        </div>
    );
}

export default Difference;