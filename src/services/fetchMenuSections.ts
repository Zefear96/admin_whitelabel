import axios from "axios";
import type { SectionMenuType } from "../types/sections";
import { sections2 } from "../config/menu/sections2";

export async function fetchMenuSections(): Promise<SectionMenuType[]> {
    try {
        // const response = await axios.get('/api/sections');
        // return response.data;
        const response = sections2;
        // console.log(response)
        return response
    } catch (error) {
        console.log('Failed to load sections menu:', error);
        throw new Error('Failed to load sections menu')
    }

}