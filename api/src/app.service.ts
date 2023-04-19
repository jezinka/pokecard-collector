import {Injectable} from '@nestjs/common';
import axios from 'axios';
import * as fs from "fs";

@Injectable()
export class AppService {

    async getAllCards(): Promise<string> {
        const config = {
            headers: {'X-Api-Key': process.env.POKEMONTCG_API_KEY},
        };

        let counter = 0;
        let cards = [];

        const total = await axios.get(
            `https://api.pokemontcg.io/v2/cards?page=1`,
            config);

        for (var i = 1; i <= Math.ceil(total.data.totalCount / total.data.count); i++) {
            const response = await axios.get(
                `https://api.pokemontcg.io/v2/cards?page=${i}`,
                config);

            for (var card of response.data.data) {
                cards.push(card);
            }

            counter += response.data.count;
        }
        fs.writeFileSync(`../data/allCards.json`, JSON.stringify(cards));
        return `pobrano: ${counter} kart`;
    }

    async getPokemonCards(name: string, mySet: object[], allCards: object[]): Promise<object[]> {
        const filteredSet = allCards.filter((c) => {
            return (c['name'].toLowerCase()).indexOf(name.toLowerCase()) != -1
        });
        filteredSet.forEach((card) => {
            if (!mySet.some((mycard) => mycard['id'] == card['id'])) {
                card['missing'] = true;
            }
        });
        return filteredSet;
    }
}
