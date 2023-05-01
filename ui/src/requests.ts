import axios, {AxiosResponse} from 'axios';

export async function savePokemon(card: any): Promise<AxiosResponse> {
    return await axios.post("http://localhost:3005/addPokemon/", card);
}

export async function deletePokemon(id: any): Promise<AxiosResponse> {
    return await axios.delete("http://localhost:3005/deletePokemon/" + id);
}

export async function getCard(filterName: string): Promise<AxiosResponse> {
    return await axios.get("http://localhost:3005/mySet/" + filterName);
}

export async function getByName(name: string): Promise<AxiosResponse> {
    return await axios.get("http://localhost:3005/pokemonCards/" + name);
}

export async function getDifferenceByCardset(cardset: string): Promise<AxiosResponse> {
    return await axios.get("http://localhost:3005/all/" + cardset);
}

export async function fetchAllCardsets(): Promise<AxiosResponse> {
    return await axios.get("http://localhost:3005/cardset/");
}