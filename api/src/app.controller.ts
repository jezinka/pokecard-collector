import {Body, Controller, Delete, Get, HttpCode, Param, Post} from '@nestjs/common';
import {AppService} from './app.service';
import * as _ from 'lodash';
import * as fs from "fs";

@Controller()
export class AppController {
    private allCards: object[];
    private mySet: object[];
    private cardset: object[];

    constructor(private readonly appService: AppService) {
        this.allCards = JSON.parse(fs.readFileSync('../data/allCards.json', 'utf-8'));
        this.mySet = JSON.parse(fs.readFileSync('../data/mySet.json', 'utf-8'));
        this.cardset = JSON.parse(fs.readFileSync('../data/cardset.json', 'utf-8'));
    }

    @Get('mySet/:name?')
    async getMySet(@Param('name') name?: string): Promise<object[]> {
        if (name != null && name != "") {
            return this.mySet.filter((c) => {
                return (c['name'].toLowerCase()).indexOf(name.toLowerCase()) != -1;
            });
        }
        return this.mySet.sort((c1, c2) => (c1['name'] > c2['name']) ? 1 : -1);
    }

    @Get('cardset')
    async getCardset(): Promise<object> {

        const counts = new Map<string, number>();
        for (const item of this.mySet.map((card) => card['set'].id)) {
            const count = counts.get(item) || 0;
            counts.set(item, count + 1);
        }

        const cardsets: object[] = [];
        const series: object[] = [];

        for (const [id, count] of counts) {
            let foundCardset = this.cardset.find((cardset) => cardset['id'] == id);
            cardsets.push({
                "id": id,
                "count": count,
                "total": foundCardset['total'],
                "name": foundCardset['name'],
                "series": foundCardset['series']
            });

            const foundSerie = series.find(s => s['name'] == foundCardset['series']);
            if (foundSerie != undefined) {
                foundSerie['id'].push(id);
                foundSerie['total'] += foundCardset['total'];
                foundSerie['count'] += count;
            } else {
                series.push({
                    "id": [id],
                    "name": foundCardset['series'],
                    "total": foundCardset['total'],
                    "count": count
                });
            }
        }

        for (const cardset of this.cardset) {
            if (!cardsets.some((c) => c['id'].startsWith(cardset['id']))) {
                cardsets.push({
                    "id": cardset['id'],
                    "count": 0,
                    "total": cardset['total'],
                    "name": cardset['name'],
                    "series": cardset['series']
                });
                const foundSerie = series.find(s => s['name'] == cardset['series']);
                if (foundSerie != undefined) {
                    foundSerie['id'].push(cardset['id']);
                    foundSerie['total'] += cardset['total'];
                } else {
                    series.push({
                        "id": [cardset['id']],
                        "name": cardset['series'],
                        "total": cardset['total'],
                        "count": 0
                    });
                }
            }
        }
        return {"cardsets": _.sortBy(cardsets, "count").reverse(), "series": _.sortBy(series, "count").reverse()};
    }

    @Get('all/:cardset')
    async getAll(@Param('cardset') cardset: string): Promise<object[]> {
        let cardsInSet = _.cloneDeep(this.allCards);
        cardsInSet = cardsInSet.filter((card) => card['set'].id == cardset);
        cardsInSet.forEach((card) => {
            if (!this.mySet.some((mycard) => mycard['id'] == card['id'])) {
                card['missing'] = true;
            }
        });
        return cardsInSet;
    }

    @Get('refreshAll')
    @HttpCode(200)
    async refreshAllCards(): Promise<string> {
        return this.appService.getAllCards();
    }

    @Get('pokemonCards/:name')
    async getPokemonCards(@Param('name') name): Promise<object[]> {
        return this.appService.getPokemonCards(name, _.cloneDeep(this.mySet), _.cloneDeep(this.allCards));
    }

    @Post('addPokemon')
    @HttpCode(201)
    async addPokemon(@Body() cardJson: object) {
        if (!this.mySet.some((card: object) => card['id'] == cardJson['id'])) {
            // @ts-ignore
            this.mySet.push(cardJson);
            fs.writeFileSync(`../data/mySet.json`, JSON.stringify(this.mySet));
        }
    }

    @Delete('deletePokemon/:id')
    @HttpCode(204)
    async deletePokemon(@Param('id') id) {
        this.mySet = this.mySet.filter((card: any) => card.id != id);
        fs.writeFileSync(`../data/mySet.json`, JSON.stringify(this.mySet));
    }
}
